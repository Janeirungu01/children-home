import { useNotification } from "../hooks/useNotification";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle, FaTimes, FaMobileAlt } from "react-icons/fa";

const iconMap = {
  success: <FaCheckCircle className="w-5 h-5" />,
  error: <FaExclamationCircle className="w-5 h-5" />,
  warning: <FaExclamationTriangle className="w-5 h-5" />,
  info: <FaInfoCircle className="w-5 h-5" />,
  payment: <FaMobileAlt className="w-5 h-5" />,
};

const colorMap = {
  success: "bg-green-50 border-green-500 text-green-800",
  error: "bg-red-50 border-red-500 text-red-800",
  warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
  info: "bg-blue-50 border-blue-500 text-blue-800",
  payment: "bg-emerald-50 border-emerald-500 text-emerald-800",
};

const iconColorMap = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
  payment: "text-emerald-500",
};

export default function Notifications() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg animate-slide-in ${colorMap[notification.type] || colorMap.info}`}
          role="alert"
        >
          <span className={iconColorMap[notification.type] || iconColorMap.info}>
            {iconMap[notification.type] || iconMap.info}
          </span>
          
          <p className="flex-1 text-sm font-medium">{notification.message}</p>
          
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      ))}
      
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
