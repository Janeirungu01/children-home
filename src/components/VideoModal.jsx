import { useEffect, useRef } from "react";
import { FaTimes, FaPlay } from "react-icons/fa";

export default function VideoModal({ isOpen, onClose, videoUrl }) {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  // Default YouTube video URL (can be overridden via props)
  const defaultVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
  const embedUrl = videoUrl || defaultVideoUrl;

  // Convert regular YouTube URL to embed URL if needed
  const getEmbedUrl = (url) => {
    if (!url) return defaultVideoUrl;
    
    // Already an embed URL
    if (url.includes("/embed/")) return url;
    
    // Extract video ID from various YouTube URL formats
    let videoId = null;
    
    // youtu.be/VIDEO_ID
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }
    // youtube.com/watch?v=VIDEO_ID
    else if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(url.split("?")[1]);
      videoId = urlParams.get("v");
    }
    // youtube.com/v/VIDEO_ID
    else if (url.includes("youtube.com/v/")) {
      videoId = url.split("youtube.com/v/")[1]?.split("?")[0];
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    
    return url;
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Close when clicking overlay
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
      style={{
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl z-10"
        style={{
          animation: "scaleIn 0.3s ease-out",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:-right-12 sm:top-0 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:rotate-90 group"
          aria-label="Close video"
        >
          <FaTimes className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Video Container */}
        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
          {/* Aspect Ratio Container */}
          <div className="relative pt-[56.25%]">
            <iframe
              src={getEmbedUrl(embedUrl)}
              title="Our Story Video"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* Caption */}
        <div className="text-center mt-6">
          <h3 className="text-white text-xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Our Story
          </h3>
          <p className="text-white/60 text-sm">
            Discover how Brighter Together Foundation is transforming lives
          </p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
