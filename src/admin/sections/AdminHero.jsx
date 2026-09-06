import { useEffect, useState, useRef } from "react";
import { fetchPageSection, updatePageSection } from "../../api/pageApi";
import EditableSection from "../components/EditableSection";
import { FaHeart, FaHandHoldingHeart, FaUsers, FaGraduationCap, FaPlay, FaEdit } from "react-icons/fa";
import { useStats } from "../../context/StatsContext";
import backgroundImage from "../../assets/children15.jpeg";
import img2 from "../../assets/children14.jpeg";
import img3 from "../../assets/children12.jpg";

const heroImages = [backgroundImage, img2, img3];

export default function AdminHero({ isEditing, onEdit, onClose }) {
  const { heroStats } = useStats();
  const [heroData, setHeroData] = useState({
    id: null,
    headerTitle: "Brighter Together Foundation",
    motto: "Touch a child's heart",
    mission: "Restoring hope, one child at a time",
  });
  const [editData, setEditData] = useState({ ...heroData });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [saving, setSaving] = useState(false);
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY * 0.4);
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadHero() {
      try {
        const res = await fetchPageSection("HEADERS");
        const item = res?.result?.[0];
        if (item) {
          const data = {
            id: item.id,
            headerTitle: item.headerTitle || heroData.headerTitle,
            motto: item.motto || heroData.motto,
            mission: item.mission || heroData.mission,
          };
          setHeroData(data);
          setEditData(data);
        }
      } catch (err) {
        console.error("Failed to load hero data", err);
      }
    }
    loadHero();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePageSection("HEADERS", {
        ...editData,
        typeToCreate: "HEADERS",
      });
      setHeroData(editData);
      onClose();
    } catch (err) {
      console.error("Failed to save hero data", err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(heroData);
    onClose();
  };

  const displayData = isEditing ? editData : heroData;

  return (
    <EditableSection
      isEditing={isEditing}
      onEdit={onEdit}
      onClose={handleCancel}
      onSave={handleSave}
      title="Hero Section"
      saving={saving}
    >
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        {/* Background Images with Parallax */}
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${img})`,
                  transform: `translateY(${scrollY}px) scale(1.1)`,
                }}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="h-20" />

          <div className="flex-1 flex items-center justify-center px-6 pb-32">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/90 text-sm font-medium tracking-wide">
                  Transforming Lives Since 2022
                </span>
              </div>

              {/* Editable Title */}
              {isEditing ? (
                <input
                  type="text"
                  value={editData.headerTitle}
                  onChange={(e) => setEditData({ ...editData, headerTitle: e.target.value })}
                  className="w-full text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 bg-white/10 border-2 border-white/50 rounded-lg px-4 py-3 text-center"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                />
              ) : (
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] drop-shadow-lg"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "2px 2px 8px rgba(0,0,0,0.6)" }}
                >
                  {displayData.headerTitle}
                </h1>
              )}

              {/* Editable Motto */}
              {isEditing ? (
                <input
                  type="text"
                  value={editData.motto}
                  onChange={(e) => setEditData({ ...editData, motto: e.target.value })}
                  className="w-full text-xl sm:text-2xl md:text-3xl text-green-400 font-medium mb-4 bg-white/10 border-2 border-green-400/50 rounded-lg px-4 py-2 text-center"
                />
              ) : (
                <p className="text-xl sm:text-2xl md:text-3xl text-green-400 font-medium mb-4">
                  {displayData.motto}
                </p>
              )}

              {/* Editable Mission */}
              {isEditing ? (
                <textarea
                  value={editData.mission}
                  onChange={(e) => setEditData({ ...editData, mission: e.target.value })}
                  rows={2}
                  className="w-full text-base md:text-lg text-white/70 mb-10 max-w-2xl mx-auto bg-white/10 border-2 border-white/30 rounded-lg px-4 py-2 text-center"
                />
              ) : (
                <p className="text-base md:text-lg text-white/70 mb-10 max-w-2xl mx-auto">
                  {displayData.mission}
                </p>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="group flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-semibold text-base shadow-lg">
                  <FaHeart className="group-hover:scale-110 transition-transform duration-300" />
                  <span>Support a Child</span>
                </button>
                <button className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-base">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <FaPlay className="w-3 h-3 ml-0.5" />
                  </div>
                  <span>Watch Our Story</span>
                </button>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-44 flex gap-2 z-20">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          {/* Impact Statistics - from shared context */}
          <div className="absolute bottom-0 left-0 right-0 z-20 pb-8">
            <div className="max-w-5xl mx-auto px-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2">
                <div className="grid grid-cols-2 md:grid-cols-4">
                  {heroStats.map((stat, index) => (
                    <div
                      key={stat.key}
                      className={`flex items-center justify-center gap-3 py-4 px-4 ${
                        index !== heroStats.length - 1 ? "md:border-r md:border-white/10" : ""
                      }`}
                    >
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                        {index === 0 && <FaUsers className="w-5 h-5" />}
                        {index === 1 && <FaGraduationCap className="w-5 h-5" />}
                        {index === 2 && <FaHandHoldingHeart className="w-5 h-5" />}
                        {index === 3 && <FaHeart className="w-5 h-5" />}
                      </div>
                      <div className="text-left">
                        <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-white/60">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
