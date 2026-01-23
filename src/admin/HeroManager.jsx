import { useState, useEffect } from "react";
import { updatePageSection, fetchPageSection } from "../components/api";

export default function HeroManager() {
  const [title, setTitle] = useState("");
  const [motto, setMotto] = useState("");
  const [mission, setMission] = useState("");
  const [loading, setLoading] = useState(true);

  // Load current hero data from backend
  useEffect(() => {
    fetchPageSection("HEADERS")
      .then((data) => {
        if (data.headers) {
          setTitle(data.headers.headerTitle || "");
          setMotto(data.headers.motto || "");
          setMission(data.headers.mission || "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await updatePageSection("HEADERS", {
        id: "hero-1",
        headerTitle: title,
        motto,
        mission,
      });
      alert("Hero section updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update hero section");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto"> 
      <h2 className="text-2xl font-bold">Edit Hero Section</h2>

      <div>
        <label className="block mb-1 font-semibold">Title</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Motto</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={motto}
          onChange={(e) => setMotto(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Mission</label>
        <textarea
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={mission}
          onChange={(e) => setMission(e.target.value)}
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold
            hover:bg-primary/90 transition"
      >
        Save Changes
      </button>
    </div>
  );
}
