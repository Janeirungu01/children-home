import { Navigate, useLocation } from "react-router-dom";

/**
 * Protects admin routes - redirects to login if not authenticated
 */
export default function AdminAuthGuard({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("adminToken");
  
  if (!token) {
    // Redirect to admin login, saving the intended destination
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  return children;
}

/**
 * Check if admin is authenticated
 */
export function isAdminAuthenticated() {
  return !!localStorage.getItem("adminToken");
}

/**
 * Get admin user info
 */
export function getAdminUser() {
  const userStr = localStorage.getItem("adminUser");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Get admin token
 */
export function getAdminToken() {
  return localStorage.getItem("adminToken");
}

/**
 * Logout admin
 */
export function logoutAdmin() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
}
