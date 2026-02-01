import { useEffect, useState } from "react";
import {
  fetchPageSection,
  updatePageSection,
  createPageSection,
} from "../api/pageApi";

export default function HeroManager() {
  const [headerId, setHeaderId] = useState(null);
  const [headerTitle, setHeaderTitle] = useState("");
  const [motto, setMotto] = useState("");
  const [mission, setMission] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Load existing HERO (HEADERS)
  useEffect(() => {
    async function loadHero() {
      try {
        const res = await fetchPageSection("HEADERS");
        const item = res?.result?.[0];

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

  // Create / Update handler
  const handleSave = async () => {
    if (!headerTitle || !mission) {
      alert("Header title and mission are required.");
      return;
    }

    setLoading(true);
    try {
      if (isCreatingNew) {
        // CREATE hero
        await createPageSection("HEADERS", {
          headerTitle,
          motto,
          mission,
        });

        alert("New hero section created successfully!");
        setIsCreatingNew(false);
      } else {
        // UPDATE hero
        if (!headerId) {
          alert("Hero record not found. Cannot update.");
          setLoading(false);
          return;
        }

        await updatePageSection("HEADERS", {
          id: headerId,
          headerTitle,
          motto,
          mission,
        });

        alert("Hero section updated successfully!");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save hero section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
        {/* Header + Add New button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-secondary">
            Hero Section Settings
          </h2>
          <button
            onClick={() => {
              setIsCreatingNew(true);
              setHeaderId(null);
              setHeaderTitle("");
              setMotto("");
              setMission("");
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Add New Hero
          </button>
        </div>

        {/* Form */}
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

        {/* Save / Create button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : isCreatingNew
            ? "Create Hero"
            : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
