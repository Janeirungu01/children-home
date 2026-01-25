import { useEffect, useState } from "react";
import { fetchPageSection, updatePageSection } from "../components/api";

export default function OurStoryManager() {
  const [storyId, setStoryId] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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
        alert("Failed to load story");
      } finally {
        setFetching(false);
      }
    }

    loadStory();
  }, []);

  // Update story
  const handleSubmit = async () => {
    if (!storyId) return alert("Story ID missing!");
    setLoading(true);

    try {
      await updatePageSection("OURSTORY", {
        id: storyId,
        ourStoryTitle: title,
        ourStorySubtitle: subtitle,
        ourStoryBody: body,
      });

      alert("Our Story updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update story");
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
        <h2 className="text-2xl font-bold text-secondary">
          Our Story Settings
        </h2>

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

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Our Story"}
        </button>
      </div>
    </div>
  );
}
