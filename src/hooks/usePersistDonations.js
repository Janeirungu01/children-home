import { useEffect } from "react";
import { useDonations, ActionTypes } from "../context/AppContext";

const STORAGE_KEY = "btf_donation_history";
const MAX_STORED_DONATIONS = 50;

/**
 * Hook to persist donation history to localStorage
 * Automatically saves and loads donation history
 */
export function usePersistDonations() {
  const { donations, dispatch } = useDonations();

  // Load donation history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({
            type: ActionTypes.SET_DONATION_HISTORY,
            payload: parsed,
          });
        }
      }
    } catch (error) {
      console.error("Failed to load donation history:", error);
    }
  }, [dispatch]);

  // Save donation history to localStorage when it changes
  useEffect(() => {
    try {
      if (donations.donationHistory.length > 0) {
        // Keep only the most recent donations
        const toStore = donations.donationHistory.slice(0, MAX_STORED_DONATIONS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      }
    } catch (error) {
      console.error("Failed to save donation history:", error);
    }
  }, [donations.donationHistory]);

  return null;
}

/**
 * Component wrapper for the hook (to use in App.jsx)
 */
export function DonationPersistence() {
  usePersistDonations();
  return null;
}
