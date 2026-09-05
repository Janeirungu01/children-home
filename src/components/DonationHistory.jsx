import { FaCheckCircle, FaTimesCircle, FaClock, FaReceipt } from "react-icons/fa";
import { useDonation } from "../hooks/useDonation";
import { formatCurrency } from "../services/paymentService";

const statusConfig = {
  PENDING: {
    icon: <FaClock className="w-4 h-4" />,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    label: "Pending",
  },
  COMPLETED: {
    icon: <FaCheckCircle className="w-4 h-4" />,
    color: "text-green-600",
    bg: "bg-green-50",
    label: "Completed",
  },
  FAILED: {
    icon: <FaTimesCircle className="w-4 h-4" />,
    color: "text-red-600",
    bg: "bg-red-50",
    label: "Failed",
  },
  TIMEOUT: {
    icon: <FaTimesCircle className="w-4 h-4" />,
    color: "text-gray-600",
    bg: "bg-gray-50",
    label: "Timeout",
  },
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function maskPhone(phone) {
  if (!phone || phone.length < 6) return phone;
  return phone.slice(0, 6) + "***" + phone.slice(-2);
}

export default function DonationHistory({ maxItems = 5, showTitle = true }) {
  const { donationHistory } = useDonation();

  if (donationHistory.length === 0) {
    return null;
  }

  const displayedDonations = donationHistory.slice(0, maxItems);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {showTitle && (
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <FaReceipt className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-gray-900">Recent Donations</h3>
        </div>
      )}

      <div className="divide-y divide-gray-50">
        {displayedDonations.map((donation) => {
          const status = statusConfig[donation.status] || statusConfig.PENDING;

          return (
            <div
              key={donation.id}
              className="px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(donation.amount)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 truncate">
                    {donation.donorName || "Anonymous"} • {maskPhone(donation.phoneNumber)}
                  </p>

                  {donation.message && (
                    <p className="text-sm text-gray-400 mt-1 truncate italic">
                      "{donation.message}"
                    </p>
                  )}
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">
                    {formatDate(donation.createdAt)}
                  </p>
                  <p className="text-xs text-gray-300 font-mono mt-1">
                    {donation.id}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {donationHistory.length > maxItems && (
        <div className="px-5 py-3 bg-gray-50 text-center">
          <button className="text-sm text-primary font-medium hover:underline">
            View all {donationHistory.length} donations
          </button>
        </div>
      )}
    </div>
  );
}
