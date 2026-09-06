import { Link, useNavigate } from "react-router-dom";
import { getAdminUser, logoutAdmin } from "../AdminAuthGuard";
import { FaUser, FaSignOutAlt, FaCog, FaEye, FaSave } from "react-icons/fa";

/**
 * Admin Toolbar - Fixed bar at top showing admin controls
 */
export default function AdminToolbar() {
  const navigate = useNavigate();
  const user = getAdminUser();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
        {/* Left - Brand & Mode */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <FaCog className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">Edit Mode</span>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">
            Click on any section to edit
          </span>
        </div>

        {/* Center - Quick Actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          >
            <FaEye className="w-3 h-3" />
            <span className="hidden sm:inline">Preview Site</span>
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          >
            <FaCog className="w-3 h-3" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </div>

        {/* Right - User & Logout */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <FaUser className="w-3 h-3 text-gray-400" />
              <span className="text-gray-300">{user.name || user.email}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
          >
            <FaSignOutAlt className="w-3 h-3" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
