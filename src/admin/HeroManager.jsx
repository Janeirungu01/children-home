import { useState } from "react";
export default function HeroManager() {
  const savedHero = JSON.parse(localStorage.getItem("hero")) || {};

  const [title, setTitle] = useState(savedHero.title || "Brighter Together Foundation");
  const [motto, setMotto] = useState(savedHero.motto || "Touch a child's heart.");
  const [mission, setMission] = useState(savedHero.mission || "Restoring hope.");

  const handleSave = () => {
    const heroData = { title, motto, mission };
    localStorage.setItem("hero", JSON.stringify(heroData));
    alert("Hero section updated!");
  };

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
        className="bg-primary text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Save Changes
      </button>
    </div>
  );
}
