import { useEffect, useState } from "react";
import apiPublic from "../api/axiosPublic";
import { API } from "../api/endpoints";

export default function DocumentImage({ documentId, alt }) {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!documentId) return;

    const fetchImage = async () => {
      try {
        const res = await apiPublic.get(
          `${API.VIEW_IMAGE}?documentId=${documentId}`
        );
        setSrc(`data:image/jpeg;base64,${res.data.result}`);
      } catch (err) {
        console.error("Failed to load image", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [documentId]);

  if (!documentId) return null;
  if (loading) return <div className="w-full h-full bg-gray-200 animate-pulse" />;
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
    />
  );
}
