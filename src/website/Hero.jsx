import { useEffect, useState } from "react";
import backgroundImage from "../assets/children8.jpg";
import img2 from "../assets/children1.jpg";
import { fetchPageSection } from "../components/api";

export default function Hero() {
  const [heroData, setHeroData] = useState({
    headerTitle: "Brighter Together Foundation",
    motto: "Touch a child's heart.",
    mission: "Restoring hope."
  });

  useEffect(() => {
    fetchPageSection("HEADERS")
      .then((data) => {
        if (data.headers) {
          setHeroData({
            headerTitle: data.headers.headerTitle,
            motto: data.headers.motto,
            mission: data.headers.mission
          });
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-white">
      <div className="relative h-[400px] md:h-[500px] overflow-hidden shadow-lg">
        <div className="absolute inset-0">
          <div className="slider-wrapper">
            <div className="slider-track">
              <div
                className="slide"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              ></div>
              <div
                className="slide"
                style={{ backgroundImage: `url(${img2})` }}
              ></div>
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

          <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition">
            Support a Child
          </button>
        </div>
      </div>
    </div>
  );
}

