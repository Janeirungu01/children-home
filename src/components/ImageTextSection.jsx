import { useEffect, useState } from "react";
// import children9 from "../assets/children12.jpg";
import VideoThumbnail from "./videoThumbnail";
import { fetchPageSection } from "../api/pageApi";

export default function ImageTextSection() {
  const [introData, setIntroData] = useState({
    introductionTitle: "Make a Difference Today",
    introductionSubtitle: "Support Orphans in Extreme Need",
    introductionBody:
      "Brighter Together Foundation has been a beacon of hope for many underprivileged orphans. Our commitment to providing a loving and supportive environment has transformed countless lives and made a huge difference in our community. We believe that every child deserves a chance to thrive, and we are dedicated to making that a reality through our ongoing programs and initiatives. Donate today and help us continue our mission of restoring hope and building brighter futures for these deserving children.",
  });

 useEffect(() => {
  async function loadIntroduction() {
    try {
      const res = await fetchPageSection("INTRODUCTION");
      const item = res?.result?.[0];

      if (item) {
        setIntroData((prev) => ({
          introductionTitle: item.introductionTitle || prev.introductionTitle,
          introductionSubtitle:
            item.introductionSubtitle || prev.introductionSubtitle,
          introductionBody: item.introductionBody || prev.introductionBody,
        }));
      }
    } catch {
      console.warn(
        "Introduction backend not available, using fallback content"
      );
    }
  }

  loadIntroduction();
}, []);


  return (
    <section className="py-10">
      <div className="max-w-7xl px-4 mx-auto bg-white rounded-tr-3xl flex flex-col md:flex-row overflow-hidden">
        {/* Image */}
        {/* <div
          className="md:w-1/2 h-64 md:h-auto bg-cover bg-center"
          style={{ backgroundImage: `url(${children9})` }}
        /> */}
          <div className="md:w-1/2">
        <VideoThumbnail
        videoId="gIVEb_AoW58"

        />
      </div>

        {/* Text */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center items-center text-center">
          <span className="text-primary uppercase font-semibold">
            {introData.introductionTitle}
          </span>

          <h2 className="text-secondary text-2xl md:text-3xl my-3">
            {introData.introductionSubtitle}
          </h2>

          <p className="text-text text-sm md:text-base">
            {introData.introductionBody}
          </p>
        </div>
      </div>
    </section>
  );
}
