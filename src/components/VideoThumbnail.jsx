import { useState } from "react";
import { FaPlay, FaExternalLinkAlt } from "react-icons/fa";

export default function VideoThumbnail({ videoId }) {
  const [play, setPlay] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  // If embed fails, show fallback with link to YouTube
  if (error) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900">
        <img
          src={fallbackThumbnail}
          alt="Video thumbnail"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
          <p className="mb-4 text-sm">Video embed unavailable. Click to watch on YouTube:</p>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-medium transition-colors"
          >
            <FaPlay className="w-4 h-4" />
            Watch on YouTube
            <FaExternalLinkAlt className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
      
      {/* Thumbnail (stays until iframe loads or when not playing) */}
      {!play && (
        <button
          onClick={() => setPlay(true)}
          className="absolute inset-0 w-full h-full focus:outline-none group"
        >
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = fallbackThumbnail;
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all duration-300">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300">
              <FaPlay className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" />
            </div>
          </div>
          
          {/* Fallback link */}
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 hover:bg-black/90 text-white text-xs px-3 py-1.5 rounded transition-colors"
          >
            <span>YouTube</span>
            <FaExternalLinkAlt className="w-2.5 h-2.5" />
          </a>
        </button>
      )}

      {/* Iframe */}
      {play && (
        <>
          {/* Loading state */}
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="animate-spin w-10 h-10 border-4 border-white/20 border-t-white rounded-full" />
            </div>
          )}
          <iframe
            className={`w-full h-full transition-opacity duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        </>
      )}
    </div>
  );
}
