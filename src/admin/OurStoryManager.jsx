import { useEffect, useState } from "react";
import { fetchPageSection, updatePageSection } from "../components/api";

export default function OurStoryManager() {
  const [storyId, setStoryId] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function loadStory() {
      try {
        const data = await fetchPageSection("OURSTORY");
        if (data.result && data.result.length > 0) {
          const story = data.result[0]; // first story
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

  // Update only OurStory
  const handleUpdate = async () => {
    if (!storyId) {
      alert("Cannot update: story ID missing");
      return;
    }

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
      console.error("Update error:", err);
      alert("Failed to update story");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="text-center mt-10">Loading story...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Our Story</h2>

      <input
        className="w-full border p-2 mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <input
        className="w-full border p-2 mb-3"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        placeholder="Subtitle"
      />

      <textarea
        className="w-full border p-2 mb-3 h-40"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Story body"
      />

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full bg-primary text-white px-6 py-2 rounded"
      >
        {loading ? "Saving..." : "Update"}
      </button>
    </div>
  );
}
