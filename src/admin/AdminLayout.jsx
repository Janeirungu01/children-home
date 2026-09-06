import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { getAdminUser, logoutAdmin } from "./AdminAuthGuard";
import { FaEdit, FaEye, FaUserPlus, FaSignOutAlt, FaUser, FaTachometerAlt } from "react-icons/fa";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: <FaTachometerAlt /> },
  { path: "/?admin=true", label: "Edit Website", icon: <FaEdit />, external: true },
  { path: "/", label: "View Website", icon: <FaEye />, external: true, newTab: true },
  { path: "/admin/create-user", label: "Create User", icon: <FaUserPlus /> },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getAdminUser();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Brighter Together
          </h2>
          <p className="text-green-400 text-sm mt-1">Admin Panel</p>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-4 py-3 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <FaUser className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name || user.username}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            item.external ? (
              item.newTab ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <span className="text-gray-400">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 py-3 px-4 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <span className="text-gray-400">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${
                  isActive(item.path) 
                    ? "bg-green-600 text-white" 
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className={isActive(item.path) ? "text-white" : "text-gray-400"}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-3 px-4 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
