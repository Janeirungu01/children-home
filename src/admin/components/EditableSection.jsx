import { FaEdit, FaTimes, FaSave } from "react-icons/fa";

/**
 * Wrapper component that adds edit overlay to any section
 */
export default function EditableSection({ 
  children, 
  isEditing, 
  onEdit, 
  onClose, 
  onSave,
  title,
  saving = false 
}) {
  return (
    <div className="relative group">
      {/* Edit Button Overlay - Shows on hover */}
      {!isEditing && (
        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="absolute inset-0 bg-green-500/5 border-2 border-dashed border-green-500/30 rounded-lg" />
          <button
            onClick={onEdit}
            className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg transition-colors pointer-events-auto"
          >
            <FaEdit className="w-4 h-4" />
            <span>Edit {title}</span>
          </button>
        </div>
      )}

      {/* Editing Mode Header */}
      {isEditing && (
        <div className="sticky top-12 z-20 bg-green-600 text-white px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <FaEdit className="w-5 h-5" />
            <span className="font-semibold">Editing: {title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-white text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <FaSave className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <FaTimes className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Content with optional edit border */}
      <div className={isEditing ? "ring-2 ring-green-500 ring-offset-2" : ""}>
        {children}
      </div>
    </div>
  );
}
