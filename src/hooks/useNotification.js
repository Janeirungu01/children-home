import { useCallback } from "react";
import { useNotifications, ActionTypes } from "../context/AppContext";

/**
 * Custom hook for managing notifications
 * @returns notification action functions
 */
export function useNotification() {
  const { notifications, dispatch } = useNotifications();

  const showNotification = useCallback((message, type = "info", duration = 5000) => {
    const id = Date.now();
    
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: { id, message, type, duration },
    });

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
      }, duration);
    }

    return id;
  }, [dispatch]);

  const showSuccess = useCallback((message, duration) => {
    return showNotification(message, "success", duration);
  }, [showNotification]);

  const showError = useCallback((message, duration) => {
    return showNotification(message, "error", duration);
  }, [showNotification]);

  const showWarning = useCallback((message, duration) => {
    return showNotification(message, "warning", duration);
  }, [showNotification]);

  const showInfo = useCallback((message, duration) => {
    return showNotification(message, "info", duration);
  }, [showNotification]);

  // Payment-specific notifications
  const showPaymentInitiated = useCallback((amount) => {
    return showNotification(
      `Payment of KES ${amount.toLocaleString()} initiated. Check your phone for M-PESA prompt.`,
      "payment",
      8000
    );
  }, [showNotification]);

  const showPaymentSuccess = useCallback((amount) => {
    return showNotification(
      `Thank you! Your donation of KES ${amount.toLocaleString()} was successful.`,
      "success",
      6000
    );
  }, [showNotification]);

  const showPaymentFailed = useCallback((reason) => {
    return showNotification(
      reason || "Payment could not be completed. Please try again.",
      "error",
      6000
    );
  }, [showNotification]);

  const showPaymentPending = useCallback(() => {
    return showNotification(
      "Waiting for payment confirmation. Please enter your M-PESA PIN.",
      "payment",
      10000
    );
  }, [showNotification]);

  const removeNotification = useCallback((id) => {
    dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
  }, [dispatch]);

  const clearAll = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_NOTIFICATIONS });
  }, [dispatch]);

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPaymentInitiated,
    showPaymentSuccess,
    showPaymentFailed,
    showPaymentPending,
    removeNotification,
    clearAll,
  };
}
