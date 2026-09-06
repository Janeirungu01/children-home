import { useEffect, useState, useCallback } from "react";
import apiPublic from "../api/axiosPublic";
import { API } from "../api/endpoints";

export default function DocumentImage({ documentId, alt, className = "w-full h-full object-cover" }) {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchImage = useCallback(async (docId) => {
    if (!docId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    setSrc(null);

    try {
      const res = await apiPublic.get(
        `${API.VIEW_IMAGE}?documentId=${docId}`
      );
      
      if (res.data?.result) {
        const base64Data = res.data.result;
        
        if (typeof base64Data === 'string' && base64Data.length > 0) {
          setSrc(`data:image/jpeg;base64,${base64Data}`);
        } else {
          console.error("Invalid image data format");
          setError(true);
        }
      } else {
        console.error("No result in response");
        setError(true);
      }
    } catch (err) {
      console.error("Failed to load image:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImage(documentId);
  }, [documentId, fetchImage]);

  if (!documentId) return null;
  
  if (loading) {
    return <div className={`bg-gray-200 animate-pulse ${className}`} />;
  }
  
  if (error || !src) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Image"}
      className={className}
      onError={() => setError(true)}
    />
  );
}
