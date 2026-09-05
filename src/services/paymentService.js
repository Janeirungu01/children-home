import axios from "axios";

// Single backend URL - configurable via environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9094";

// Create axios instance
const paymentApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout for payment requests
});

/**
 * M-PESA Payment Service
 */
export const mpesaService = {
  /**
   * Initiate M-PESA STK Push (Lipa Na M-PESA Online)
   * This triggers a payment prompt on the user's phone
   * 
   * @param {Object} params - Payment parameters
   * @param {string} params.phoneNumber - Phone number (254XXXXXXXXX format)
   * @param {number} params.amount - Amount in KES
   * @param {string} params.accountReference - Reference for the payment
   * @param {string} params.transactionDesc - Description of the transaction
   * @returns {Promise<Object>} - STK Push response
   */
  initiateSTKPush: async ({ phoneNumber, amount, accountReference, transactionDesc }) => {
    try {
      // Format phone number to 254 format
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      const response = await paymentApi.post("/payments/management/mpesa/stk-push", {
        phoneNumber: formattedPhone,
        amount: Math.round(amount), // Ensure whole number
        accountReference: accountReference || "BRIGHTER-DONATION",
        transactionDesc: transactionDesc || "Donation to Brighter Together Foundation",
      });

      return {
        success: true,
        data: response.data,
        checkoutRequestId: response.data?.CheckoutRequestID,
        merchantRequestId: response.data?.MerchantRequestID,
        message: "Payment request sent. Please check your phone.",
      };
    } catch (error) {
      console.error("STK Push Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Failed to initiate payment",
        code: error.response?.status,
      };
    }
  },

  /**
   * Query STK Push transaction status
   * 
   * @param {string} checkoutRequestId - The CheckoutRequestID from STK Push response
   * @returns {Promise<Object>} - Transaction status
   */
  querySTKStatus: async (checkoutRequestId) => {
    try {
      const response = await paymentApi.post("/payments/management/mpesa/stk-query", {
        checkoutRequestId,
      });

      return {
        success: true,
        data: response.data,
        resultCode: response.data?.ResultCode,
        resultDesc: response.data?.ResultDesc,
        isComplete: response.data?.ResultCode === "0",
      };
    } catch (error) {
      console.error("STK Query Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to query transaction status",
      };
    }
  },

  /**
   * Get transaction by reference
   * 
   * @param {string} reference - Transaction reference
   * @returns {Promise<Object>} - Transaction details
   */
  getTransaction: async (reference) => {
    try {
      const response = await paymentApi.get(`/payments/management/transaction/${reference}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Transaction not found",
      };
    }
  },

  /**
   * Get donation history for a phone number
   * 
   * @param {string} phoneNumber - Donor's phone number
   * @returns {Promise<Object>} - Donation history
   */
  getDonationHistory: async (phoneNumber) => {
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const response = await paymentApi.get("/payments/management/donations", {
        params: { phoneNumber: formattedPhone },
      });
      return {
        success: true,
        data: response.data?.result || [],
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch donation history",
        data: [],
      };
    }
  },
};

/**
 * Donation Service - Higher level abstraction for donations
 */
export const donationService = {
  /**
   * Process a donation via M-PESA
   * 
   * @param {Object} donation - Donation details
   * @param {string} donation.donorName - Donor's name (optional)
   * @param {string} donation.phoneNumber - Phone number
   * @param {number} donation.amount - Amount in KES
   * @param {string} donation.message - Donation message (optional)
   * @returns {Promise<Object>} - Donation result
   */
  processDonation: async ({ donorName, phoneNumber, amount, message }) => {
    // Validate inputs
    if (!phoneNumber || !amount) {
      return {
        success: false,
        error: "Phone number and amount are required",
      };
    }

    if (amount < 10) {
      return {
        success: false,
        error: "Minimum donation amount is KES 10",
      };
    }

    if (amount > 150000) {
      return {
        success: false,
        error: "Maximum single transaction is KES 150,000",
      };
    }

    // Generate unique reference
    const reference = generateDonationReference();

    // Initiate STK Push
    const result = await mpesaService.initiateSTKPush({
      phoneNumber,
      amount,
      accountReference: reference,
      transactionDesc: `Donation${donorName ? ` from ${donorName}` : ""}: ${message || "Support children"}`,
    });

    if (result.success) {
      return {
        success: true,
        donation: {
          id: reference,
          donorName: donorName || "Anonymous",
          phoneNumber: formatPhoneNumber(phoneNumber),
          amount,
          message,
          status: "PENDING",
          checkoutRequestId: result.checkoutRequestId,
          merchantRequestId: result.merchantRequestId,
          createdAt: new Date().toISOString(),
        },
        message: result.message,
      };
    }

    return result;
  },

  /**
   * Check donation status
   * 
   * @param {string} checkoutRequestId - Checkout request ID
   * @returns {Promise<Object>} - Status result
   */
  checkStatus: async (checkoutRequestId) => {
    const result = await mpesaService.querySTKStatus(checkoutRequestId);
    
    if (result.success) {
      let status = "PENDING";
      if (result.resultCode === "0") {
        status = "COMPLETED";
      } else if (result.resultCode) {
        status = "FAILED";
      }

      return {
        success: true,
        status,
        message: result.resultDesc,
        isComplete: result.isComplete,
      };
    }

    return result;
  },
};

// Utility Functions

/**
 * Format phone number to 254XXXXXXXXX format
 * Handles various input formats: 0712345678, +254712345678, 254712345678, 712345678
 * 
 * @param {string} phone - Phone number in any format
 * @returns {string} - Formatted phone number
 */
export function formatPhoneNumber(phone) {
  if (!phone) return "";
  
  // Remove all non-digit characters
  let cleaned = phone.toString().replace(/\D/g, "");
  
  // Handle different formats
  if (cleaned.startsWith("0")) {
    // 0712345678 -> 254712345678
    cleaned = "254" + cleaned.substring(1);
  } else if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
    // 712345678 -> 254712345678
    cleaned = "254" + cleaned;
  } else if (cleaned.startsWith("254")) {
    // Already in correct format
  } else if (cleaned.startsWith("+254")) {
    cleaned = cleaned.substring(1);
  }
  
  return cleaned;
}

/**
 * Validate Kenyan phone number
 * 
 * @param {string} phone - Phone number
 * @returns {boolean} - Is valid
 */
export function isValidKenyanPhone(phone) {
  const formatted = formatPhoneNumber(phone);
  // Kenyan numbers: 254 followed by 9 digits starting with 7 or 1
  return /^254[71]\d{8}$/.test(formatted);
}

/**
 * Generate unique donation reference
 * 
 * @returns {string} - Unique reference
 */
export function generateDonationReference() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BTF-${timestamp}-${random}`;
}

/**
 * Format amount with currency
 * 
 * @param {number} amount - Amount
 * @returns {string} - Formatted amount
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default {
  mpesa: mpesaService,
  donation: donationService,
  formatPhoneNumber,
  isValidKenyanPhone,
  generateDonationReference,
  formatCurrency,
};
