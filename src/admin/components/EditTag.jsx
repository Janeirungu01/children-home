import { FaEdit } from "react-icons/fa";
import { useAdmin } from "../../context/AdminContext";

/**
 * Small edit tag that appears next to editable content when admin mode is enabled
 * Click to start editing that section
 */
export default function EditTag({ sectionId, label, className = "" }) {
  const { isAdminMode, startEditing, editingSection } = useAdmin();

  if (!isAdminMode) return null;
  if (editingSection === sectionId) return null; // Hide when already editing

  return (
    <button
      onClick={() => startEditing(sectionId)}
      className={`inline-flex items-center gap-1.5 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-50 ${className}`}
      title={`Edit ${label}`}
    >
      <FaEdit className="w-3 h-3" />
      <span className="hidden sm:inline">{label || "Edit"}</span>
    </button>
  );
}
