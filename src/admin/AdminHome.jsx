import { useState } from "react";
import Navbar from "../components/Navbar";
import AdminHero from "./sections/AdminHero";
import AdminGoals from "./sections/AdminGoals";
import AdminAbout from "./sections/AdminAbout";
import AdminActivities from "./sections/AdminActivities";
import AdminDonations from "./sections/AdminDonations";
import AdminOurStory from "./sections/AdminOurStory";
import Footer from "../components/Footer";
import AdminToolbar from "./components/AdminToolbar";

/**
 * Admin Home - Mirrors the main website but with inline editing capabilities
 */
export default function AdminHome() {
  const [editingSection, setEditingSection] = useState(null);

  return (
    <div className="relative">
      {/* Admin Toolbar - Fixed at top */}
      <AdminToolbar />

      {/* Website Preview with Edit Overlays */}
      <div className="pt-12"> {/* Space for toolbar */}
        <Navbar />
        
        <AdminHero 
          isEditing={editingSection === "hero"} 
          onEdit={() => setEditingSection("hero")}
          onClose={() => setEditingSection(null)}
        />

        <section id="goals">
          <AdminGoals 
            isEditing={editingSection === "goals"} 
            onEdit={() => setEditingSection("goals")}
            onClose={() => setEditingSection(null)}
          />
        </section>

        <section id="about">
          <AdminAbout 
            isEditing={editingSection === "about"} 
            onEdit={() => setEditingSection("about")}
            onClose={() => setEditingSection(null)}
          />
        </section>

        <section id="donations">
          <AdminDonations 
            isEditing={editingSection === "donations"} 
            onEdit={() => setEditingSection("donations")}
            onClose={() => setEditingSection(null)}
          />
        </section>

        <section id="activities">
          <AdminActivities 
            isEditing={editingSection === "activities"} 
            onEdit={() => setEditingSection("activities")}
            onClose={() => setEditingSection(null)}
          />
        </section>

        <section id="story">
          <AdminOurStory 
            isEditing={editingSection === "story"} 
            onEdit={() => setEditingSection("story")}
            onClose={() => setEditingSection(null)}
          />
        </section>

        <section id="contact">
          <Footer />
        </section>
      </div>
    </div>
  );
}
