import { useEffect, useState } from "react";
import {
  fetchPageSection,
  updatePageSection,
  createPageSection,
} from "../api/pageApi";

export default function IntroductionManager() {
  const [introId, setIntroId] = useState(null);
  const [introductionTitle, setIntroductionTitle] = useState("");
  const [introductionSubtitle, setIntroductionSubtitle] = useState("");
  const [introductionBody, setIntroductionBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Load existing INTRODUCTION
  useEffect(() => {
    async function loadIntroduction() {
      try {
        const res = await fetchPageSection("INTRODUCTION");
        const item = res?.result?.[0];

        if (item) {
          setIntroId(item.id);
          setIntroductionTitle(item.introductionTitle || "");
          setIntroductionSubtitle(item.introductionSubtitle || "");
          setIntroductionBody(item.introductionBody || "");
        }
      } catch {
        console.warn("Failed to load introduction data");
      }
    }

    loadIntroduction();
  }, []);

  // Save handler for create or update
  const handleSave = async () => {
    if (!introductionTitle && !introductionBody) {
      alert("Please fill in the title and body.");
      return;
    }

    setLoading(true);
    try {
      if (isCreatingNew) {
        // CREATE new introduction
        await createPageSection("INTRODUCTION", {
          introductionTitle,
          introductionSubtitle,
          introductionBody,
        });
        alert("New introduction created successfully!");
        setIsCreatingNew(false);
      } else {
        // UPDATE existing introduction
        if (!introId) {
          alert("Introduction record not found. Cannot update.");
          setLoading(false);
          return;
        }

        await updatePageSection("INTRODUCTION", {
          id: introId,
          introductionTitle,
          introductionSubtitle,
          introductionBody,
        });

        alert("Introduction updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save introduction section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
        {/* Header with Add New button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-secondary">
            Introduction Section Settings
          </h2>
          <button
            onClick={() => {
              setIsCreatingNew(true);
              setIntroId(null);
              setIntroductionTitle("");
              setIntroductionSubtitle("");
              setIntroductionBody("");
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Add New Introduction
          </button>
        </div>

        {/* Form inputs */}
        <div className="space-y-4">
          <input
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Introduction Title"
            value={introductionTitle}
            onChange={(e) => setIntroductionTitle(e.target.value)}
          />

          <input
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Introduction Subtitle"
            value={introductionSubtitle}
            onChange={(e) => setIntroductionSubtitle(e.target.value)}
          />

          <textarea
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Introduction Body"
            rows={5}
            value={introductionBody}
            onChange={(e) => setIntroductionBody(e.target.value)}
          />
        </div>

        {/* Save/Create button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : isCreatingNew
            ? "Create Introduction"
            : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
