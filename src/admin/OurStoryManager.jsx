import { useEffect, useState } from "react";
import { fetchPageSection, updatePageSection, createPageSection } from "../api/pageApi";

export default function OurStoryManager() {
  const [storyId, setStoryId] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Load existing story
  useEffect(() => {
    async function loadStory() {
      try {
        const res = await fetchPageSection("OURSTORY");
        const story = res?.result?.[0];

        if (story) {
          setStoryId(story.id);
          setTitle(story.ourStoryTitle || "");
          setSubtitle(story.ourStorySubtitle || "");
          setBody(story.ourStoryBody || "");
        }
      } catch (err) {
        console.error("Failed to fetch Our Story", err);
      } finally {
        setFetching(false);
      }
    }

    loadStory();
  }, []);

  // Create / Update handler
  const handleSave = async () => {
    if (!title || !body) {
      alert("Story title and body are required.");
      return;
    }

    setLoading(true);
    try {
      if (isCreatingNew) {
        // CREATE Our Story
        await createPageSection("OURSTORY", {
          ourStoryTitle: title,
          ourStorySubtitle: subtitle,
          ourStoryBody: body,
        });

        alert("New Our Story created successfully!");
        setIsCreatingNew(false);
      } else {
        // UPDATE Our Story
        if (!storyId) {
          alert("Story record not found. Cannot update.");
          setLoading(false);
          return;
        }

        await updatePageSection("OURSTORY", {
          id: storyId,
          ourStoryTitle: title,
          ourStorySubtitle: subtitle,
          ourStoryBody: body,
        });

        alert("Our Story updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save Our Story");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading story...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
        {/* Header + Add New button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-secondary">
            Our Story Settings
          </h2>
          <button
            onClick={() => {
              setIsCreatingNew(true);
              setStoryId(null);
              setTitle("");
              setSubtitle("");
              setBody("");
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Add New Story
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <input
            placeholder="Story Title"
            className="w-full border px-4 py-2 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Story Subtitle"
            className="w-full border px-4 py-2 rounded-lg"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

          <textarea
            placeholder="Story Body"
            className="w-full border px-4 py-2 rounded-lg h-40 resize-none"
            value={body}
            onChange={(e) => setBody(e.target.value)}
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
            ? "Create Our Story"
            : "Save Our Story"}
        </button>
      </div>
    </div>
  );
}
