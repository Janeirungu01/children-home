import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "./Hero";
import Goals from "./Goals";
import ImageTextSection from "../components/ImageTextSection";
import ActivitiesSection from "../components/ActivitiesSection";
import Donations from "./Donations";
import OurStory from "./OurStory";
import Footer from "../components/Footer";
import VideoModal from "../components/VideoModal";

export default function Home() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  // Replace with your actual YouTube video URL
  const storyVideoUrl = "https://www.youtube.com/embed/YOUR_VIDEO_ID";

  return (
    <>
      <Navbar />
      <Hero onWatchStory={() => setIsVideoModalOpen(true)} />
      
      {/* Video Modal for Watch Our Story */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={storyVideoUrl}
      />

      <section id="goals">
        <Goals />
      </section>

      <section id="about">
        <ImageTextSection />
      </section>

      <section id="donations">
        <Donations />
      </section>

      <section id="activities">
        <ActivitiesSection />
      </section>

      <section id="story">
        <OurStory />
      </section>

      <section id="contact">
        <Footer />
      </section>
    </>
  );
}
