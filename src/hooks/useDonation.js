import { useCallback, useRef } from "react";
import { useDonations, useUI, ActionTypes } from "../context/AppContext";
import { useNotification } from "./useNotification";
import { donationService, formatCurrency } from "../services/paymentService";

/**
 * Custom hook for managing donations
 * Provides methods to process donations and track their status
 */
export function useDonation() {
  const { donations, dispatch } = useDonations();
  const { ui } = useUI();
  const { showPaymentInitiated, showPaymentSuccess, showPaymentFailed, showError, showInfo } = useNotification();
  const pollingRef = useRef(null);

  /**
   * Process a new donation
   */
  const processDonation = useCallback(async ({ donorName, phoneNumber, amount, message }) => {
    // Set processing state
    dispatch({ type: ActionTypes.SET_PAYMENT_PROCESSING, payload: true });
    dispatch({ type: ActionTypes.SET_DONATION_LOADING, payload: true });
    dispatch({ type: ActionTypes.SET_DONATION_ERROR, payload: null });

    try {
      showInfo("Connecting to M-PESA...");

      const result = await donationService.processDonation({
        donorName,
        phoneNumber,
        amount,
        message,
      });

      if (result.success) {
        // Store the donation
        dispatch({ type: ActionTypes.SET_CURRENT_DONATION, payload: result.donation });
        dispatch({ type: ActionTypes.ADD_DONATION_TO_HISTORY, payload: result.donation });

        showPaymentInitiated(amount);

        // Start polling for status
        startStatusPolling(result.donation.checkoutRequestId, amount);

        return { success: true, donation: result.donation };
      } else {
        showPaymentFailed(result.error);
        dispatch({ type: ActionTypes.SET_DONATION_ERROR, payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || "An unexpected error occurred";
      showPaymentFailed(errorMessage);
      dispatch({ type: ActionTypes.SET_DONATION_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: ActionTypes.SET_PAYMENT_PROCESSING, payload: false });
      dispatch({ type: ActionTypes.SET_DONATION_LOADING, payload: false });
    }
  }, [dispatch, showPaymentInitiated, showPaymentFailed, showInfo]);

  /**
   * Poll for payment status
   */
  const startStatusPolling = useCallback((checkoutRequestId, amount) => {
    // Clear any existing polling
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    let attempts = 0;
    const maxAttempts = 24; // 2 minutes (5 second intervals)

    pollingRef.current = setInterval(async () => {
      attempts++;

      if (attempts > maxAttempts) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
        
        // Mark as timeout
        dispatch({
          type: ActionTypes.UPDATE_DONATION_STATUS,
          payload: { checkoutRequestId, status: "TIMEOUT" },
        });
        showPaymentFailed("Payment verification timed out. Please check your M-PESA messages.");
        return;
      }

      try {
        const result = await donationService.checkStatus(checkoutRequestId);

        if (result.success && result.status !== "PENDING") {
          clearInterval(pollingRef.current);
          pollingRef.current = null;

          // Update donation status
          dispatch({
            type: ActionTypes.UPDATE_DONATION_STATUS,
            payload: { checkoutRequestId, status: result.status },
          });

          if (result.status === "COMPLETED") {
            showPaymentSuccess(amount);
          } else if (result.status === "FAILED") {
            showPaymentFailed(result.message);
          }
        }
      } catch (error) {
        console.error("Status polling error:", error);
      }
    }, 5000); // Poll every 5 seconds
  }, [dispatch, showPaymentSuccess, showPaymentFailed]);

  /**
   * Stop status polling
   */
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  /**
   * Clear current donation
   */
  const clearCurrentDonation = useCallback(() => {
    stopPolling();
    dispatch({ type: ActionTypes.CLEAR_CURRENT_DONATION });
  }, [dispatch, stopPolling]);

  /**
   * Open donation modal
   */
  const openDonationModal = useCallback(() => {
    dispatch({ type: ActionTypes.OPEN_DONATION_MODAL });
  }, [dispatch]);

  /**
   * Close donation modal
   */
  const closeDonationModal = useCallback(() => {
    dispatch({ type: ActionTypes.CLOSE_DONATION_MODAL });
  }, [dispatch]);

  return {
    // State
    currentDonation: donations.currentDonation,
    donationHistory: donations.donationHistory,
    isLoading: donations.loading,
    error: donations.error,
    isProcessing: ui.paymentProcessing,
    isModalOpen: ui.donationModalOpen,

    // Actions
    processDonation,
    clearCurrentDonation,
    stopPolling,
    openDonationModal,
    closeDonationModal,
  };
}
