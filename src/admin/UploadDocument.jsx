import { useState } from "react";
import { API } from "../Config";
import ViewDocuments from "./ViewDocuments";

export default function UploadDocument() {
  const [file, setFile] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("groupName", groupName);
    formData.append("documentTitle", documentTitle);

    try {
      setLoading(true);

      const response = await fetch(`${API.BASE_URL}${API.UPLOAD_IMAGE}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      alert("Upload successful!");
      setFile(null);
      setGroupName("");
      setDocumentTitle("");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Upload Document
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:bg-primary file:text-gray-600
              hover:file:bg-primary/90
              cursor-pointer"
            />
            {file && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Group Name */}
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>

            <select
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2
      bg-white
      focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="" disabled>
                Select section
              </option>
              <option value="HEADERS">Headers</option>
              <option value="INTRODUCTION">Introduction</option>
              <option value="OUR_STORY">Our Story</option>
              <option value="LINKS">Links</option>
            </select>
          </div>

          {/* Document Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Title
            </label>
            <input
              type="text"
              placeholder="e.g. January Activities"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold
            hover:bg-primary/90 transition
            disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>
      <ViewDocuments />
    </>
  );
}
