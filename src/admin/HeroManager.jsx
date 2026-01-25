import { useEffect, useState } from "react";
import { fetchPageSection, updatePageSection } from "../components/api";

export default function HeroManager() {
  const [headerId, setHeaderId] = useState(null);
  const [headerTitle, setHeaderTitle] = useState("");
  const [motto, setMotto] = useState("");
  const [mission, setMission] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Load existing HERO (HEADERS)
  useEffect(() => {
    async function loadHero() {
      try {
        const res = await fetchPageSection("HEADERS");
        const item = res?.result?.[0]; // IMPORTANT: backend returns array

        if (item) {
          setHeaderId(item.id);
          setHeaderTitle(item.headerTitle || "");
          setMotto(item.motto || "");
          setMission(item.mission || "");
        }
      } catch (err) {
        console.error("Failed to load hero data", err);
      }
    }

    loadHero();
  }, []);

  // 🔹 Save updates
  const handleSave = async () => {
    if (!headerId) {
      alert("Hero record not found. Cannot update.");
      return;
    }

    setLoading(true);
    try {
      await updatePageSection("HEADERS", {
        id: headerId,
        headerTitle,
        motto,
        mission,
      });

      alert("Hero section updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update hero section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-secondary">
          Hero Section Settings
        </h2>

        <div className="space-y-4">
          <input
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Header Title"
            value={headerTitle}
            onChange={(e) => setHeaderTitle(e.target.value)}
          />

          <input
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Motto"
            value={motto}
            onChange={(e) => setMotto(e.target.value)}
          />

          <textarea
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Mission"
            rows={4}
            value={mission}
            onChange={(e) => setMission(e.target.value)}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
