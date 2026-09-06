import { FaSignOutAlt, FaEye, FaEyeSlash, FaUser, FaCog, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

/**
 * Floating admin bar at the top of the page when admin mode is enabled
 */
export default function AdminBar() {
  const { isAdminMode, adminUser, disableAdminMode, logout, isLoggedIn } = useAdmin();

  // Don't render if not logged in as admin
  if (!isLoggedIn) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] transition-transform duration-300 ${isAdminMode ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="bg-gray-900/95 backdrop-blur-sm text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between">
          {/* Left - Mode indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Edit Mode</span>
            </div>
            <span className="text-xs text-gray-400 hidden sm:block">
              Click edit buttons to modify content
            </span>
          </div>

          {/* Right - User & Actions */}
          <div className="flex items-center gap-3">
            {/* User info */}
            {adminUser && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                <FaUser className="w-3 h-3" />
                <span>{adminUser.name || adminUser.email}</span>
              </div>
            )}

            {/* Dashboard link */}
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
            >
              <FaCog className="w-3 h-3" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            {/* Exit edit mode */}
            <button
              onClick={disableAdminMode}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
            >
              <FaEyeSlash className="w-3 h-3" />
              <span className="hidden sm:inline">Exit Edit</span>
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition-colors"
            >
              <FaSignOutAlt className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Small button to enable admin mode (shown when logged in but not in edit mode)
 */
export function AdminModeToggle() {
  const { isAdminMode, enableAdminMode, isLoggedIn } = useAdmin();

  if (!isLoggedIn || isAdminMode) return null;

  return (
    <button
      onClick={enableAdminMode}
      className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
    >
      <FaEdit className="w-4 h-4" />
      <span className="text-sm font-medium">Edit Site</span>
    </button>
  );
}
