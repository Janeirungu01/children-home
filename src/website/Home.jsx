import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "./Hero";
import Goals from "./Goals";
import ImageTextSection from "../components/ImageTextSection";
import ActivitiesSection from "../components/ActivitiesSection";
import Donations from "./Donations";
import OurStory from "./OurStory";
import Footer from "../components/Footer";
import VideoModal from "../components/VideoModal";
import AdminBar, { AdminModeToggle } from "../admin/components/AdminBar";
import { useAdmin } from "../context/AdminContext";
import { fetchPageSection } from "../api/pageApi";

export default function Home() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { isAdminMode } = useAdmin();
  const [storyVideoUrl, setStoryVideoUrl] = useState("");

  // Fetch video URL from Links
  useEffect(() => {
    async function loadLinks() {
      try {
        const res = await fetchPageSection("LINKS");
        const item = res?.result?.[0];
        if (item) {
          // Use watchOurStory URL if set, otherwise fall back to youtube
          setStoryVideoUrl(item.watchOurStory || item.youtube || "");
        }
      } catch {
        console.warn("Links not available");
      }
    }
    loadLinks();
  }, []);

  return (
    <>
      {/* Admin Bar - shows when in admin mode */}
      <AdminBar />
      
      {/* Add padding when admin bar is visible */}
      <div className={isAdminMode ? "pt-10" : ""}>
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
      </div>

      {/* Floating button to enable admin mode when logged in */}
      <AdminModeToggle />
    </>
  );
}
