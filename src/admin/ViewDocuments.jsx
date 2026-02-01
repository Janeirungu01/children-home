import { useEffect, useState } from "react";
import api from "../api/axios";
import { API } from "../api/endpoints";

export default function ViewDocuments() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

const fetchImages = async () => {
  try {
    const response = await api.get(API.VIEW_ALL_IMAGES);
    setImages(response.data);
  } catch (error) {
    console.error("Failed to fetch images", error);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return <p className="text-center mt-10">Loading images...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Uploaded Images</h2>

      {images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {images.map((item) => (
            <div
              key={item.documentId}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={`data:${item.contentType};base64,${item.file}`}
                alt={item.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="font-semibold text-lg">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {item.contentType}
                </p>
                <p className="text-xs text-gray-500">
                  Group: {item.documentId}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
