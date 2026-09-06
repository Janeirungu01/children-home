import { useEffect, useRef, useState } from "react";
import { FaTimes, FaPlay, FaExternalLinkAlt, FaYoutube, FaSpinner } from "react-icons/fa";

export default function VideoModal({ isOpen, onClose, videoUrl }) {
  const overlayRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default YouTube video URL  
  const defaultVideoUrl = "https://www.youtube.com/watch?v=gIVEb_AoW58";
  const url = videoUrl || defaultVideoUrl;

  // Extract video ID
  const getVideoId = (url) => {
    if (!url) return null;
    let videoId = null;
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(url.split("?")[1]);
      videoId = urlParams.get("v");
    } else if (url.includes("/embed/")) {
      videoId = url.split("/embed/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/v/")) {
      videoId = url.split("youtube.com/v/")[1]?.split("?")[0];
    }
    return videoId;
  };

  const videoId = getVideoId(url);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1` : null;
  const youtubeDirectUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;

  // Reset loading state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [isOpen]);

  // Close on escape
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

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const openOnYouTube = () => {
    window.open(youtubeDirectUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
      style={{ animation: "vmFadeIn 0.3s ease-out" }}
    >
      {/* Backdrop - 50% opacity */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal - Centered, reasonable size */}
      <div className="relative w-full max-w-4xl z-10" style={{ animation: "vmScaleIn 0.3s ease-out" }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:-top-2 sm:-right-12 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:rotate-90 z-20"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Video Container */}
        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative pt-[56.25%]">
            
            {/* Loading Spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                <FaSpinner className="w-12 h-12 text-white animate-spin mb-4" />
                <p className="text-white/70">Loading video...</p>
              </div>
            )}

            {/* YouTube Iframe */}
            {embedUrl && (
              <iframe
                src={embedUrl}
                title="Video"
                className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                onLoad={handleIframeLoad}
              />
            )}
          </div>
          
          {/* Bottom bar with YouTube button */}
          <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent absolute bottom-0 left-0 right-0 p-4 pt-10">
            <div className="flex items-center justify-between">
              <p className="text-white/70 text-sm hidden sm:block">
                Video not playing? Open directly on YouTube
              </p>
              <button
                onClick={openOnYouTube}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-full font-medium text-sm shadow-lg transition-all duration-300 hover:scale-105 ml-auto"
              >
                <FaYoutube className="w-4 h-4" />
                Watch on YouTube
                <FaExternalLinkAlt className="w-3 h-3 opacity-70" />
              </button>
            </div>
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

      <style>{`
        @keyframes vmFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes vmScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
