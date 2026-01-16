// import { useState } from "react";

// export default function Hero() {
//   // Load hero from localStorage once during initial state setup
//   const savedHero = JSON.parse(localStorage.getItem("hero")) || {};

//   const [hero] = useState({
//     title: savedHero.title || "Brighter Together Foundation",
//     motto: savedHero.motto || "Touch a child's heart.",
//     mission: savedHero.mission || "Restoring hope.",
//   });

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
//       <h2 className="text-4xl md:text-6xl font-bold mb-4">{hero.title}</h2>
//       <h3 className="text-xl md:text-4xl mb-2">{hero.motto}</h3>
//       <h3 className="text-xl md:text-4xl">{hero.mission}</h3>
//     </div>
//   );
// }

import backgroundImage from "../assets/children8.jpg";
import img2 from "../assets/children1.jpg";

export default function Hero() {
  return (
    <div className="bg-white">
      <div >

        {/* HERO CONTAINER */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden shadow-lg">

          {/* IMAGE SLIDER */}
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

          {/* DARK OVERLAY */}
          {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}

          {/* TEXT ON TOP */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-white text-3xl md:text-5xl font-bold mb-4">
              Brighter Together Foundation
            </h2>
            <p className="text-white text-lg md:text-2xl mb-2">
              Motto: Touch a child's heart.
            </p>
            <p className="text-white text-lg md:text-2xl mb-6">
              Mission: Restoring hope.
            </p>

            <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition">
              Support a Child
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}


