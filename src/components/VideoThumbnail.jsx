import { useState } from "react";

export default function VideoThumbnail({ videoId }) {
  const [play, setPlay] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
      
      {/* Thumbnail (stays until iframe loads) */}
      {!play && (
        <button
          onClick={() => setPlay(true)}
          className="absolute inset-0 w-full h-full focus:outline-none group"
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center
                          bg-black/0 group-hover:bg-black/40
                          transition">
            <div className="flex items-center gap-3
                            opacity-0 group-hover:opacity-100
                            transition">
              <div className="bg-white/90 text-black rounded-full w-12 h-12
                              flex items-center justify-center text-lg font-bold">
                ▶
              </div>
              <span className="text-white text-lg font-medium">
                Play
              </span>
            </div>
          </div>
        </button>
      )}

      {/* Iframe */}
      {play && (
        <iframe
          className={`w-full h-full transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video"
          allow="autoplay; encrypted-media"
          allowFullScreen
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}
