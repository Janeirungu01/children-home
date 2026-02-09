import { useEffect, useState } from "react";
import { fetchPageSection } from "../api/pageApi";
import backgroundImage from "../assets/children8.jpg";
import img2 from "../assets/children12.jpg";
import { HashLink } from "react-router-hash-link";

export default function Hero() {
  const [heroData, setHeroData] = useState({
    headerTitle: "Brighter Together Foundation",
    motto: "Touch a child's heart.",
    mission: "Restoring hope.",
  });

  useEffect(() => {
  async function loadHero() {
    try {
      const res = await fetchPageSection("HEADERS");
      const item = res?.result?.[0];

      if (item) {
        setHeroData(prev => ({
          headerTitle: item.headerTitle || prev.headerTitle,
          motto: item.motto || prev.motto,
          mission: item.mission || prev.mission,
        }));
      }
    } catch (err) {
      console.error("Failed to load hero data", err);
    }
  }

  loadHero();
}, []);


  return (
    <div className="bg-white">
      <div className="relative h-100 md:h-125 overflow-hidden shadow-lg">
        <div className="absolute inset-0">
          <div className="slider-wrapper">
            <div className="slider-track">
              <div
                className="slide"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              />
              <div
                className="slide"
                style={{ backgroundImage: `url(${img2})` }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-white text-3xl md:text-5xl font-bold mb-4">
            {heroData.headerTitle}
          </h2>
          <p className="text-white text-lg md:text-2xl mb-2">
            Motto: {heroData.motto}
          </p>
          <p className="text-white text-lg md:text-2xl mb-6">
            Mission: {heroData.mission}
          </p>
                  <HashLink to="/#donate"
                    className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition"
                  >
                    Support a Child
                  </HashLink>
        </div>
      </div>
    </div>
  );
}
