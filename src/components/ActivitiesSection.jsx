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
  FaPlay,
  FaRandom,
  FaSortNumericDown
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
          <FeaturedActivityCard 
            activity={featuredActivity}
            isAdminMode={isAdminMode}
            onEdit={() => setEditingActivity(featuredActivity)}
            onDelete={() => deleteActivity(featuredActivity.id)}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            currentFeatured={currentFeatured}
            setCurrentFeatured={setCurrentFeatured}
            totalActivities={activities.length}
          />
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

// Featured Activity with image slideshow
function FeaturedActivityCard({ 
  activity, 
  isAdminMode, 
  onEdit, 
  onDelete, 
  isPaused, 
  setIsPaused, 
  currentFeatured, 
  setCurrentFeatured, 
  totalActivities 
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const documents = activity.documents || [];
  const slideshowMode = activity.slideshowMode || 'SEQUENTIAL';
  
  // Image slideshow within activity
  useEffect(() => {
    if (documents.length <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      if (slideshowMode === 'RANDOM') {
        // Random: pick a different random image
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * documents.length);
        } while (nextIndex === currentImageIndex && documents.length > 1);
        setCurrentImageIndex(nextIndex);
      } else {
        // Sequential: go to next image
        setCurrentImageIndex(prev => (prev + 1) % documents.length);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [documents.length, isPaused, slideshowMode, currentImageIndex]);
  
  // Reset image index when activity changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activity.id]);

  const currentDoc = documents[currentImageIndex];

  return (
    <div className="relative mb-16 rounded-3xl overflow-hidden shadow-2xl group">
      <div className="relative h-[400px] md:h-[500px]">
        {currentDoc?.documentId ? (
          <DocumentImage
            documentId={currentDoc.documentId}
            alt={activity.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <FaImages className="w-20 h-20 text-white/30" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Image indicators for multiple images */}
        {documents.length > 1 && (
          <div className="absolute top-4 left-4 flex gap-1.5">
            {documents.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentImageIndex 
                    ? "w-6 bg-white" 
                    : "w-1.5 bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-2xl">
            {activity.subtitle && (
              <div className="flex items-center gap-2 text-green-400 text-sm mb-3">
                <FaMapMarkerAlt className="w-3 h-3" />
                <span className="capitalize">{activity.subtitle}</span>
              </div>
            )}
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 capitalize">
              {activity.title}
            </h3>
            <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-6">
              {activity.body}
            </p>
            
            {isAdminMode && (
              <div className="flex gap-2">
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                >
                  <FaEdit className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={onDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                >
                  <FaTrash className="w-3 h-3" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
        
        {totalActivities > 1 && (
          <div className="absolute bottom-8 right-8 flex items-center gap-4">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              {isPaused ? <FaPlay className="w-3 h-3" /> : <FaPause className="w-3 h-3" />}
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: Math.min(totalActivities, 5) }).map((_, i) => (
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
              {totalActivities > 5 && (
                <span className="text-white/50 text-xs ml-1">+{totalActivities - 5}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Activity Card with slideshow for multiple images
function ActivityCard({ activity, isAdminMode, onEdit, onDelete, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const documents = activity.documents || [];
  const slideshowMode = activity.slideshowMode || 'SEQUENTIAL';
  const hasImages = documents.length > 0;
  
  // Auto slideshow when hovered
  useEffect(() => {
    if (!isHovered || documents.length <= 1) return;
    
    const interval = setInterval(() => {
      if (slideshowMode === 'RANDOM') {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * documents.length);
        } while (nextIndex === currentSlide && documents.length > 1);
        setCurrentSlide(nextIndex);
      } else {
        setCurrentSlide(prev => (prev + 1) % documents.length);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isHovered, documents.length, slideshowMode, currentSlide]);
  
  const heights = ['h-64', 'h-72', 'h-80'];
  const cardHeight = heights[index % heights.length];
  const currentDoc = documents[currentSlide];

  return (
    <article
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ${cardHeight}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setCurrentSlide(0); }}
    >
      <div className="absolute inset-0">
        {hasImages && currentDoc?.documentId ? (
          <DocumentImage
            documentId={currentDoc.documentId}
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

      {/* Image count badge */}
      {documents.length > 1 && (
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
          <FaImages className="w-3 h-3" />
          <span>{documents.length}</span>
        </div>
      )}

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

      {/* Image slideshow dots */}
      {documents.length > 1 && isHovered && (
        <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1.5">
          {documents.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentSlide(i); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlide 
                  ? "w-4 bg-white" 
                  : "w-1.5 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
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

// Constants for file upload limits
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_TOTAL_SIZE_MB = 10;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

// Format file size for display
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Add/Edit Activity Modal with MULTIPLE IMAGES support
function ActivityModal({ activity, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: activity?.title || "",
    subtitle: activity?.subtitle || "",
    body: activity?.body || "",
    slideshowMode: activity?.slideshowMode || "SEQUENTIAL",
  });
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Calculate total size of new files
  const totalNewFilesSize = images
    .filter(img => !img.isExisting && img.file)
    .reduce((sum, img) => sum + (img.file?.size || 0), 0);

  // Initialize with existing images if editing
  useEffect(() => {
    if (activity?.documents && activity.documents.length > 0) {
      const existingImages = activity.documents.map((doc, idx) => ({
        id: 'existing-' + doc.documentId,
        documentId: doc.documentId,
        isExisting: true,
        preview: null,
        displayOrder: doc.displayOrder ?? idx
      }));
      // Sort by displayOrder
      existingImages.sort((a, b) => a.displayOrder - b.displayOrder);
      setImages(existingImages);
    }
  }, [activity]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setError(null);
    const validFiles = [];
    const errors = [];

    for (const file of files) {
      // Check individual file size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`"${file.name}" (${formatFileSize(file.size)}) exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        continue;
      }
      validFiles.push(file);
    }

    // Check total size including existing new files
    const currentNewFilesSize = images
      .filter(img => !img.isExisting && img.file)
      .reduce((sum, img) => sum + (img.file?.size || 0), 0);
    const newFilesTotalSize = validFiles.reduce((sum, f) => sum + f.size, 0);
    
    if (currentNewFilesSize + newFilesTotalSize > MAX_TOTAL_SIZE_BYTES) {
      errors.push(`Total upload size would exceed ${MAX_TOTAL_SIZE_MB}MB. Current: ${formatFileSize(currentNewFilesSize)}, Adding: ${formatFileSize(newFilesTotalSize)}`);
      // Still add files that fit
      let remainingSize = MAX_TOTAL_SIZE_BYTES - currentNewFilesSize;
      const fittingFiles = [];
      for (const file of validFiles) {
        if (file.size <= remainingSize) {
          fittingFiles.push(file);
          remainingSize -= file.size;
        }
      }
      validFiles.length = 0;
      validFiles.push(...fittingFiles);
    }

    if (errors.length > 0) {
      setError(errors.join('. '));
    }

    if (validFiles.length > 0) {
      const newImages = validFiles.map((file, idx) => ({
        id: `new-${Date.now()}-${idx}`,
        file: file,
        preview: URL.createObjectURL(file),
        isExisting: false,
        fileSize: file.size
      }));
      setImages(prev => [...prev, ...newImages]);
    }
    
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
      setError("Title is required");
      return;
    }

    if (images.length === 0) {
      setError("Please add at least one photo");
      return;
    }

    // Validate total file size before upload
    const newFilesSize = images
      .filter(img => !img.isExisting && img.file)
      .reduce((sum, img) => sum + (img.file?.size || 0), 0);
    
    if (newFilesSize > MAX_TOTAL_SIZE_BYTES) {
      setError(`Total file size (${formatFileSize(newFilesSize)}) exceeds the ${MAX_TOTAL_SIZE_MB}MB limit. Please remove some images or use smaller files.`);
      return;
    }

    setError(null);
    setSaving(true);
    
    try {
      const activityData = {
        title: formData.title,
        subtitle: formData.subtitle,
        body: formData.body,
        groupName: "ACTIVITIES",
        slideshowMode: formData.slideshowMode,
      };

      if (activity?.id) {
        activityData.id = activity.id;
      }

      const formDataPayload = new FormData();
      formDataPayload.append("activitiesRequestDTO", JSON.stringify(activityData));
      
      // Separate existing and new images
      const existingDocIds = [];
      const newFiles = [];
      
      for (const img of images) {
        if (img.isExisting && img.documentId) {
          existingDocIds.push(img.documentId);
        } else if (img.file) {
          newFiles.push(img.file);
        }
      }
      
      // Add existing document IDs
      existingDocIds.forEach(docId => {
        formDataPayload.append("existingDocumentIds", docId);
      });
      
      // Add new files
      newFiles.forEach(file => {
        formDataPayload.append("documents", file);
      });
      
      // If no new files but we have existing, add empty to satisfy backend
      if (newFiles.length === 0) {
        // Create an empty blob as placeholder
        formDataPayload.append("documents", new Blob(), "");
      }

      const endpoint = activity?.id 
        ? "/activities/update-activities"
        : "/activities/create-activities";
      
      const method = activity?.id ? 'put' : 'post';
      
      await api[method](endpoint, formDataPayload, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      onSave();
    } catch (err) {
      console.error("Failed to save activity", err);
      
      // Parse error response
      let errorMessage = "Failed to save activity. Please try again.";
      
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 413 || (data?.message && data.message.toLowerCase().includes('size'))) {
          // File too large error
          const maxSize = data?.result?.maxFileSize || '10MB';
          errorMessage = `Upload failed: File size exceeds the maximum allowed limit of ${maxSize}. Please compress your images or upload smaller files.`;
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (err.message) {
        if (err.message.includes('Network Error')) {
          errorMessage = "Network error. The files may be too large or the server is unavailable.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
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
                  
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded font-medium z-10">
                      Main
                    </span>
                  )}
                  
                  {/* File size badge for new uploads */}
                  {!img.isExisting && img.file && (
                    <span className={`absolute bottom-2 left-2 text-white text-xs px-2 py-0.5 rounded font-medium z-10 ${
                      img.file.size > MAX_FILE_SIZE_BYTES * 0.8 ? 'bg-orange-500' : 'bg-black/50'
                    }`}>
                      {formatFileSize(img.file.size)}
                    </span>
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                    
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                      title="Remove"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                    
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
            
            {/* File size info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <p>
                Upload multiple photos. Use arrows to reorder. First photo will be the main display image.
              </p>
              {totalNewFilesSize > 0 && (
                <span className={`font-medium ${totalNewFilesSize > MAX_TOTAL_SIZE_BYTES * 0.8 ? 'text-orange-500' : 'text-gray-500'}`}>
                  {formatFileSize(totalNewFilesSize)} / {MAX_TOTAL_SIZE_MB}MB
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Max {MAX_FILE_SIZE_MB}MB per image, {MAX_TOTAL_SIZE_MB}MB total
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 text-red-500 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="flex-shrink-0 text-red-400 hover:text-red-600"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Slideshow Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slideshow Mode
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, slideshowMode: "SEQUENTIAL" })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  formData.slideshowMode === "SEQUENTIAL"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <FaSortNumericDown className="w-4 h-4" />
                <span className="font-medium">Sequential</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, slideshowMode: "RANDOM" })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  formData.slideshowMode === "RANDOM"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <FaRandom className="w-4 h-4" />
                <span className="font-medium">Random</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Choose how images rotate: in order or randomly
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
