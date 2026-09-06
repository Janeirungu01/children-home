import { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [editingSection, setEditingSection] = useState(null);

  // Check admin status on mount and URL change
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const userStr = localStorage.getItem("adminUser");
    const adminParam = searchParams.get("admin");

    if (token && userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
        // Enable admin mode if ?admin=true or already in admin mode
        setIsAdminMode(adminParam === "true" || isAdminMode);
      } catch {
        // Invalid stored data
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        setAdminUser(null);
        setIsAdminMode(false);
      }
    } else {
      setAdminUser(null);
      setIsAdminMode(false);
    }
  }, [searchParams]);

  const enableAdminMode = () => {
    if (adminUser) {
      setIsAdminMode(true);
      // Add ?admin=true to URL without navigating
      const url = new URL(window.location);
      url.searchParams.set("admin", "true");
      window.history.replaceState({}, "", url);
    }
  };

  const disableAdminMode = () => {
    setIsAdminMode(false);
    setEditingSection(null);
    // Remove ?admin from URL
    const url = new URL(window.location);
    url.searchParams.delete("admin");
    window.history.replaceState({}, "", url);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdminUser(null);
    setIsAdminMode(false);
    setEditingSection(null);
    navigate("/");
  };

  const startEditing = (sectionId) => {
    setEditingSection(sectionId);
  };

  const stopEditing = () => {
    setEditingSection(null);
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminMode,
        adminUser,
        editingSection,
        enableAdminMode,
        disableAdminMode,
        logout,
        startEditing,
        stopEditing,
        isLoggedIn: !!adminUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}

// Helper to check if user is admin (can be used outside context)
export function getAdminToken() {
  return localStorage.getItem("adminToken");
}

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
