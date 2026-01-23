import Navbar from "../components/Navbar";
import Hero from "./Hero";
import Goals from "./Goals";
import ImageTextSection from "../components/ImageTextSection";
import ActivitiesSection from "../components/ActivitiesSection";
import Donations from "./Donate";
import OurStory from "./OurStory";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />

      <section id="story">
        <OurStory />
      </section>

      <section id="goals">
        <Goals />
      </section>

      <section id="about">
        <ImageTextSection />
      </section>

      <section id="activities">
        <ActivitiesSection />
      </section>

      <section id="donations">
        <Donations />
      </section>

      <section id="contact">
        <Footer />
      </section>
    </>
  );
}
