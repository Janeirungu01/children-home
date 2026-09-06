import { useEffect, useState, useRef } from "react";
import apiPublic from "../api/axiosPublic";
import api from "../api/axios";
import { API } from "../api/endpoints";
import DocumentImage from "../admin/DocumentImage";
import { useAdmin } from "../context/AdminContext";
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaArrowRight, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaChevronLeft, 
  FaChevronRight,
  FaTimes,
  FaUpload,
  FaImages,
  FaSave,
  FaSpinner,
  FaPause,
  FaPlay
} from "react-icons/fa";

export default function ActivitiesSection() {
  const { isAdminMode } = useAdmin();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  
  // Global slideshow state
  const [isPaused, setIsPaused] = useState(false);
  const [currentFeatured, setCurrentFeatured] = useState(0);

  useEffect(() => {
    fetchActivities();
  }, []);

  // Auto-rotate featured activity every 5 seconds
  useEffect(() => {
    if (activities.length <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentFeatured(prev => (prev + 1) % activities.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activities.length, isPaused]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await apiPublic.get(API.SEARCH_ACTIVITIES, {
        params: { pageSize: 50 },
      });
      const data = res.data?.result?.content ?? [];
      setActivities(data);
    } catch (error) {
      console.error("Failed to load activities", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id) => {
    if (!confirm("Delete this activity? This cannot be undone.")) return;
    try {
      await api.delete(`/activities/delete-activity-by-id?id=${id}`);
      setActivities(activities.filter(a => a.id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Failed to delete activity");
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto" />
            <div className="h-12 bg-gray-200 rounded w-96 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const featuredActivity = activities[currentFeatured];

  return (
    <section id="program" className="py-20 bg-gradient-to-br from-gray-50 via-white to-green-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FaCalendarAlt className="w-3 h-3" />
            Our Impact in Action
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Recent Activities & Events
          </h2>
          <p className="text-gray-600 text-lg">
            Witness the joy and transformation happening through our programs
          </p>
        </div>

        {/* Featured Activity Showcase */}
        {activities.length > 0 && featuredActivity && (
          <div className="relative mb-16 rounded-3xl overflow-hidden shadow-2xl group">
            <div className="relative h-[400px] md:h-[500px]">
              {featuredActivity.document?.documentId ? (
                <DocumentImage
                  documentId={featuredActivity.document.documentId}
                  alt={featuredActivity.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <FaImages className="w-20 h-20 text-white/30" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="max-w-2xl">
                  {featuredActivity.subtitle && (
                    <div className="flex items-center gap-2 text-green-400 text-sm mb-3">
                      <FaMapMarkerAlt className="w-3 h-3" />
                      <span className="capitalize">{featuredActivity.subtitle}</span>
                    </div>
                  )}
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 capitalize">
                    {featuredActivity.title}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-6">
                    {featuredActivity.body}
                  </p>
                  
                  {isAdminMode && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingActivity(featuredActivity)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                      >
                        <FaEdit className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => deleteActivity(featuredActivity.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                      >
                        <FaTrash className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {activities.length > 1 && (
                <div className="absolute bottom-8 right-8 flex items-center gap-4">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    {isPaused ? <FaPlay className="w-3 h-3" /> : <FaPause className="w-3 h-3" />}
                  </button>
                  
                  <div className="flex gap-2">
                    {activities.slice(0, 5).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentFeatured(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === currentFeatured 
                            ? "w-8 bg-white" 
                            : "w-2 bg-white/50 hover:bg-white/70"
                        }`}
                      />
                    ))}
                    {activities.length > 5 && (
                      <span className="text-white/50 text-xs ml-1">+{activities.length - 5}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isAdminMode && (
            <button
              onClick={() => setShowAddModal(true)}
              className="group bg-white border-2 border-dashed border-gray-300 hover:border-green-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 min-h-[320px] transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-16 h-16 bg-green-50 group-hover:bg-green-100 rounded-2xl flex items-center justify-center transition-colors">
                <FaPlus className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Add Activity</h3>
                <p className="text-gray-500 text-sm">Create new activity with multiple photos</p>
              </div>
            </button>
          )}

          {activities.length === 0 && !isAdminMode ? (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCalendarAlt className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Activities Yet</h3>
              <p className="text-gray-500">Check back soon for updates on our programs.</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isAdminMode={isAdminMode}
                onEdit={() => setEditingActivity(activity)}
                onDelete={() => deleteActivity(activity.id)}
                index={index}
              />
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Activity Modal */}
      {(showAddModal || editingActivity) && (
        <ActivityModal
          activity={editingActivity}
          onClose={() => {
            setShowAddModal(false);
            setEditingActivity(null);
          }}
          onSave={() => {
            fetchActivities();
            setShowAddModal(false);
            setEditingActivity(null);
          }}
        />
      )}
    </section>
  );
}

// Activity Card with slideshow for multiple images
function ActivityCard({ activity, isAdminMode, onEdit, onDelete, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // For now, activities have one main image from backend
  // In future, this could be expanded to support multiple images
  const hasImage = activity.document?.documentId;
  
  const heights = ['h-64', 'h-72', 'h-80'];
  const cardHeight = heights[index % heights.length];

  return (
    <article
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ${cardHeight}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0">
        {hasImage ? (
          <DocumentImage
            documentId={activity.document.documentId}
            alt={activity.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <FaImages className="w-12 h-12 text-green-300" />
          </div>
        )}
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`} />
      </div>

      {isAdminMode && (
        <div className={`absolute top-3 right-3 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-lg"
          >
            <FaEdit className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
          >
            <FaTrash className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-5">
        {activity.subtitle && (
          <div className="flex items-center gap-2 text-green-400 text-xs mb-2">
            <FaMapMarkerAlt className="w-2.5 h-2.5" />
            <span className="capitalize">{activity.subtitle}</span>
          </div>
        )}
        
        <h3 className="text-lg font-bold text-white mb-2 capitalize line-clamp-2 group-hover:text-green-300 transition-colors">
          {activity.title}
        </h3>
        
        <p className={`text-white/70 text-sm line-clamp-2 transition-all duration-300 ${isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'}`}>
          {activity.body}
        </p>
        
        <div className={`flex items-center gap-2 text-green-400 text-sm mt-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <span>View Details</span>
          <FaArrowRight className="w-3 h-3" />
        </div>
      </div>
    </article>
  );
}

// Add/Edit Activity Modal with MULTIPLE IMAGES support
function ActivityModal({ activity, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: activity?.title || "",
    subtitle: activity?.subtitle || "",
    body: activity?.body || "",
  });
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize with existing image if editing
  useEffect(() => {
    if (activity?.document?.documentId) {
      setImages([{
        id: 'existing-' + activity.document.documentId,
        documentId: activity.document.documentId,
        isExisting: true,
        preview: null
      }]);
    }
  }, [activity]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = files.map((file, idx) => ({
      id: `new-${Date.now()}-${idx}`,
      file: file,
      preview: URL.createObjectURL(file),
      isExisting: false
    }));

    setImages(prev => [...prev, ...newImages]);
    
    // Reset file input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const moveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    setImages(prev => {
      const newImages = [...prev];
      const [removed] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, removed);
      return newImages;
    });
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    if (images.length === 0) {
      alert("Please add at least one photo");
      return;
    }

    setSaving(true);
    try {
      const activityData = {
        title: formData.title,
        subtitle: formData.subtitle,
        body: formData.body,
        groupName: "ACTIVITIES",
      };

      if (activity?.id) {
        activityData.id = activity.id;
      }

      const formDataPayload = new FormData();
      formDataPayload.append("activitiesRequestDTO", JSON.stringify(activityData));
      
      // Use first image (main image)
      const mainImage = images[0];
      if (mainImage.file) {
        formDataPayload.append("document", mainImage.file);
      } else if (mainImage.isExisting && mainImage.documentId) {
        // Fetch existing image blob
        const imgRes = await api.get(`/documents/view-image?documentId=${mainImage.documentId}`, {
          responseType: 'blob'
        });
        const file = new File([imgRes.data], 'existing.jpg', { type: imgRes.data.type || 'image/jpeg' });
        formDataPayload.append("document", file);
      }

      await api.post("/activities/create-activities", formDataPayload, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      onSave();
    } catch (err) {
      console.error("Failed to save activity", err);
      alert("Failed to save activity. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {activity ? "Edit Activity" : "Add New Activity"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Multiple Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos * <span className="text-gray-400 font-normal">(First image is the main photo)</span>
            </label>
            
            {/* Image Grid */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {images.map((img, index) => (
                <div 
                  key={img.id} 
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group border-2 border-gray-200 hover:border-green-500 transition-colors"
                >
                  {/* Image Display */}
                  {img.isExisting && img.documentId ? (
                    <DocumentImage
                      documentId={img.documentId}
                      alt="Activity"
                      className="w-full h-full object-cover"
                    />
                  ) : img.preview ? (
                    <img 
                      src={img.preview} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <FaImages className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Main badge */}
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded font-medium z-10">
                      Main
                    </span>
                  )}
                  
                  {/* Controls overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {/* Move left */}
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index - 1)}
                        className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                        title="Move left"
                      >
                        <FaChevronLeft className="w-3 h-3" />
                      </button>
                    )}
                    
                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                      title="Remove"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                    
                    {/* Move right */}
                    {index < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index + 1)}
                        className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                        title="Move right"
                      >
                        <FaChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Add more button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-gray-300 hover:border-green-500 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-green-600 transition-colors bg-gray-50 hover:bg-green-50"
              >
                <FaUpload className="w-6 h-6" />
                <span className="text-xs font-medium">Add Photos</span>
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="text-xs text-gray-500">
              Upload multiple photos. Drag to reorder. First photo will be the main display image.
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Kajiado Children's Home Visit"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g., Kajiado, Kenya"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              rows={4}
              placeholder="Describe this activity and its impact..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !formData.title.trim() || images.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FaSave />
                {activity ? "Save Changes" : "Create Activity"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
