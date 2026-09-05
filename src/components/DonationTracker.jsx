import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaMobileAlt, FaTimes } from "react-icons/fa";
import { useDonation } from "../hooks/useDonation";
import { formatCurrency } from "../services/paymentService";

/**
 * A floating tracker that shows the current donation status
 * Appears after a donation is initiated and stays until completed/failed
 */
export default function DonationTracker() {
  const { currentDonation, clearCurrentDonation } = useDonation();
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTracker, setShowTracker] = useState(false);

  useEffect(() => {
    if (currentDonation && currentDonation.status === "PENDING") {
      setShowTracker(true);
      setIsMinimized(false);
    } else if (currentDonation && (currentDonation.status === "COMPLETED" || currentDonation.status === "FAILED")) {
      // Keep showing for 5 seconds after completion
      const timer = setTimeout(() => {
        setShowTracker(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentDonation]);

  if (!showTracker || !currentDonation) return null;

  const status = currentDonation.status;
  const isPending = status === "PENDING";
  const isCompleted = status === "COMPLETED";
  const isFailed = status === "FAILED" || status === "TIMEOUT";

  const handleDismiss = () => {
    setShowTracker(false);
    clearCurrentDonation();
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className={`fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isPending
            ? "bg-yellow-500"
            : isCompleted
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      >
        {isPending && <FaSpinner className="w-6 h-6 text-white animate-spin" />}
        {isCompleted && <FaCheckCircle className="w-6 h-6 text-white" />}
        {isFailed && <FaTimesCircle className="w-6 h-6 text-white" />}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
      {/* Header */}
      <div
        className={`px-4 py-3 flex items-center justify-between ${
          isPending
            ? "bg-yellow-50"
            : isCompleted
            ? "bg-green-50"
            : "bg-red-50"
        }`}
      >
        <div className="flex items-center gap-2">
          {isPending && (
            <>
              <FaSpinner className="w-4 h-4 text-yellow-600 animate-spin" />
              <span className="font-medium text-yellow-800">Processing Payment</span>
            </>
          )}
          {isCompleted && (
            <>
              <FaCheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">Payment Successful</span>
            </>
          )}
          {isFailed && (
            <>
              <FaTimesCircle className="w-4 h-4 text-red-600" />
              <span className="font-medium text-red-800">Payment Failed</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-black/5 rounded transition-colors"
            title="Minimize"
          >
            <span className="block w-3 h-0.5 bg-gray-400" />
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-black/5 rounded transition-colors"
            title="Dismiss"
          >
            <FaTimes className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <FaMobileAlt className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">
              {formatCurrency(currentDonation.amount)}
            </p>
            <p className="text-xs text-gray-500">
              to {currentDonation.phoneNumber}
            </p>
          </div>
        </div>

        {isPending && (
          <div className="bg-yellow-50 rounded-lg p-3 text-sm text-yellow-800">
            <p className="font-medium mb-1">Check your phone</p>
            <p className="text-yellow-600">
              Enter your M-PESA PIN to complete the donation
            </p>
          </div>
        )}

        {isCompleted && (
          <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
            <p className="font-medium">Thank you for your donation!</p>
            <p className="text-green-600 text-xs mt-1">
              Ref: {currentDonation.id}
            </p>
          </div>
        )}

        {isFailed && (
          <div className="bg-red-50 rounded-lg p-3 text-sm text-red-800">
            <p className="font-medium">Payment was not completed</p>
            <p className="text-red-600 text-xs mt-1">
              Please try again or use manual M-PESA transfer
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
