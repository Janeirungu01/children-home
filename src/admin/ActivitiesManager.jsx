import { useState } from "react";
import { API } from "../Config";
import axios from "axios";

export default function ActivitiesManager() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [desc, setDesc] = useState("");
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDocumentUpload = (e) => {
    setDocument(e.target.files[0]);
  };
  
  const handleAdd = async () => {
    if (!title || !desc || !document) {
      alert("Please add title, description and document");
      return;
    }

    const activitiesRequestDTO = {
      id: "",
      title,
      subtitle: location,
      body: desc,
      groupName: "headers",
      documentTitle: document.name,
    };

    const encodedDTO = encodeURIComponent(JSON.stringify(activitiesRequestDTO));

    const formData = new FormData();
    formData.append("document", document);

    try {
      setLoading(true);

      await axios.post(
        `${API.BASE_URL}/activities/create-activities?activitiesRequestDTO=${encodedDTO}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert("Activity created successfully");

      setTitle("");
      setLocation("");
      setDesc("");
      setDocument(null);
    } catch (err) {
      console.error(err.response || err);
      alert("Failed to create activity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <h2 className="text-2xl font-bold">Manage Activities</h2>

      {/* Form */}
      <div className="space-y-3 p-4 rounded shadow">
        {/* Upload Document (ADDED – TOP) */}
        <input
          type="file"
          accept="image/*,.pdf"
          className="w-full border px-3 py-2 rounded"
          onChange={handleDocumentUpload}
        />

        <input
          type="text"
          placeholder="Title"
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location / Subtitle"
          className="w-full border px-3 py-2 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-primary text-white px-6 py-2 rounded  w-full disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Add Activity"}
        </button>
      </div>
    </div>
  );
}
