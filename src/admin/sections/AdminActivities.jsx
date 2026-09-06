import { useEffect, useState } from "react";
import apiPublic from "../../api/axiosPublic";
import api from "../../api/axios";
import { API } from "../../api/endpoints";
import EditableSection from "../components/EditableSection";
import DocumentImage from "../DocumentImage";
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight, FaEdit, FaTrash, FaPlus, FaGripVertical, FaImage } from "react-icons/fa";

export default function AdminActivities({ isEditing, onEdit, onClose }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivity, setNewActivity] = useState({ title: "", subtitle: "", body: "" });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await apiPublic.get(API.SEARCH_ACTIVITIES, {
        params: { groupName: "ACTIVITIES", pageSize: 50 },
      });
      setActivities(res.data?.result?.content ?? []);
    } catch (error) {
      console.error("Failed to load activities", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save would update order/positions on backend
      onClose();
    } catch (err) {
      console.error("Failed to save", err);
    } finally {
      setSaving(false);
    }
  };

  const updateActivity = async (id, field, value) => {
    setActivities(activities.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const deleteActivity = async (id) => {
    if (!confirm("Delete this activity?")) return;
    try {
      await api.delete(`${API.DELETE_ACTIVITIES}/${id}`);
      setActivities(activities.filter(a => a.id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Failed to delete activity");
    }
  };

  const saveActivityEdit = async (activity) => {
    try {
      await api.put(`${API.UPDATE_ACTIVITIES}/${activity.id}`, {
        title: activity.title,
        subtitle: activity.subtitle,
        body: activity.body,
      });
      setEditingActivity(null);
    } catch (err) {
      console.error("Failed to update", err);
      alert("Failed to save changes");
    }
  };

  const addActivity = async () => {
    if (!newActivity.title.trim()) return alert("Title is required");
    try {
      const res = await api.post(API.ADD_ACTIVITIES, {
        ...newActivity,
        groupName: "ACTIVITIES",
      });
      setActivities([...activities, res.data.result]);
      setShowAddModal(false);
      setNewActivity({ title: "", subtitle: "", body: "" });
    } catch (err) {
      console.error("Failed to add", err);
      alert("Failed to add activity");
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    
    const newActivities = [...activities];
    const draggedActivity = newActivities[draggedItem];
    newActivities.splice(draggedItem, 1);
    newActivities.splice(index, 0, draggedActivity);
    setActivities(newActivities);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <EditableSection
      isEditing={isEditing}
      onEdit={onEdit}
      onClose={onClose}
      onSave={handleSave}
      title="Activities Section"
      saving={saving}
    >
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FaCalendarAlt className="w-3 h-3" />
              Our Latest News
            </div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Recent Activities & Projects
            </h2>
            <p className="text-gray-600 text-lg">
              See how we're making a difference in the lives of children through our programs and initiatives.
            </p>

            {/* Add Activity Button */}
            {isEditing && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-6 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                <FaPlus className="w-4 h-4" />
                Add New Activity
              </button>
            )}
          </div>

          {/* Activities Grid */}
          {activities.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCalendarAlt className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Activities Yet</h3>
              <p className="text-gray-500">Check back soon for updates on our latest programs and events.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity, index) => (
                <article
                  key={activity.id}
                  draggable={isEditing}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 ${
                    isEditing ? "cursor-move" : ""
                  } ${draggedItem === index ? "opacity-50" : ""}`}
                >
                  {/* Drag Handle & Edit Controls */}
                  {isEditing && (
                    <div className="flex items-center justify-between bg-gray-100 px-4 py-2">
                      <div className="flex items-center gap-2 text-gray-500">
                        <FaGripVertical className="w-4 h-4" />
                        <span className="text-sm">Drag to reorder</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingActivity(editingActivity === activity.id ? null : activity.id)}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          <FaEdit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteActivity(activity.id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gray-200">
                      <DocumentImage
                        documentId={activity.document?.documentId}
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute top-4 left-4">
                      <span className="bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                        Activity
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Editable Location */}
                    {editingActivity === activity.id ? (
                      <input
                        type="text"
                        value={activity.subtitle || ""}
                        onChange={(e) => updateActivity(activity.id, "subtitle", e.target.value)}
                        placeholder="Location"
                        className="w-full text-green-600 text-sm mb-3 bg-gray-100 border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      activity.subtitle && (
                        <div className="flex items-center gap-2 text-green-600 text-sm mb-3">
                          <FaMapMarkerAlt className="w-3 h-3" />
                          <span className="capitalize">{activity.subtitle}</span>
                        </div>
                      )
                    )}

                    {/* Editable Title */}
                    {editingActivity === activity.id ? (
                      <input
                        type="text"
                        value={activity.title}
                        onChange={(e) => updateActivity(activity.id, "title", e.target.value)}
                        className="w-full text-lg font-bold text-gray-900 mb-3 bg-gray-100 border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      <h3 className="text-lg font-bold text-gray-900 mb-3 capitalize line-clamp-2 group-hover:text-green-700 transition-colors">
                        {activity.title}
                      </h3>
                    )}

                    {/* Editable Description */}
                    {editingActivity === activity.id ? (
                      <>
                        <textarea
                          value={activity.body || ""}
                          onChange={(e) => updateActivity(activity.id, "body", e.target.value)}
                          rows={3}
                          className="w-full text-gray-600 text-sm bg-gray-100 border border-gray-300 rounded px-2 py-1 mb-4"
                        />
                        <button
                          onClick={() => saveActivityEdit(activity)}
                          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                          {activity.body}
                        </p>
                        <div className="flex items-center gap-2 text-green-600 font-medium text-sm group-hover:gap-3 transition-all">
                          <span>Read more</span>
                          <FaArrowRight className="w-3 h-3" />
                        </div>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Activity</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Activity title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newActivity.subtitle}
                  onChange={(e) => setNewActivity({ ...newActivity, subtitle: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., Nairobi, Kenya"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newActivity.body}
                  onChange={(e) => setNewActivity({ ...newActivity, body: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Describe this activity..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addActivity}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </EditableSection>
  );
}
