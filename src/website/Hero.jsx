import { useEffect, useState, useRef } from "react";
import { fetchPageSection } from "../api/pageApi";
import { FaHeart, FaHandHoldingHeart, FaUsers, FaGraduationCap, FaPlay } from "react-icons/fa";
import { useDonation } from "../hooks/useDonation";
import backgroundImage from "../assets/children15.jpeg";
import img2 from "../assets/children14.jpeg";
import img3 from "../assets/children12.jpg";

const impactStats = [
  { icon: <FaUsers className="w-5 h-5" />, value: "150+", label: "Children Supported" },
  { icon: <FaGraduationCap className="w-5 h-5" />, value: "95%", label: "School Enrollment" },
  { icon: <FaHandHoldingHeart className="w-5 h-5" />, value: "500+", label: "Donors Worldwide" },
  { icon: <FaHeart className="w-5 h-5" />, value: "4+", label: "Years of Impact" },
];

const heroImages = [backgroundImage, img2, img3];

export default function Hero({ onWatchStory }) {
  const { openDonationModal } = useDonation();
  const [heroData, setHeroData] = useState({
    headerTitle: "Brighter Together Foundation",
    motto: "Touch a child's heart",
    mission: "Restoring hope, one child at a time",
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll effect
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

  // Image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Fetch hero data
  useEffect(() => {
    async function loadHero() {
      try {
        const res = await fetchPageSection("HEADERS");
        const item = res?.result?.[0];
        if (item) {
          setHeroData((prev) => ({
            headerTitle: item.headerTitle || prev.headerTitle,
            motto: item.motto || prev.motto,
            mission: item.mission || prev.mission,
          }));
        }
      } catch (err) {
        console.error("Failed to load hero data", err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadHero();
  }, []);

  return (
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
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navbar Space */}
        <div className="h-20" />

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8 transition-all duration-700 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium tracking-wide">
                Transforming Lives Since 2022
              </span>
            </div>

            {/* Main Title */}
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] transition-all duration-700 delay-100 drop-shadow-lg ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ 
                fontFamily: "'Playfair Display', Georgia, serif",
                textShadow: "2px 2px 8px rgba(0,0,0,0.6)"
              }}
            >
              {heroData.headerTitle}
            </h1>

            {/* Motto */}
            <p
              className={`text-xl sm:text-2xl md:text-3xl text-green-400 font-medium mb-4 transition-all duration-700 delay-200 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {heroData.motto}
            </p>

            {/* Mission */}
            <p
              className={`text-base md:text-lg text-white/70 mb-10 max-w-2xl mx-auto transition-all duration-700 delay-300 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {heroData.mission}
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-400 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {/* Support a Child - Opens Donation Modal */}
              <button
                onClick={openDonationModal}
                className="group flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-semibold text-base shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                <FaHeart className="group-hover:scale-110 transition-transform duration-300" />
                <span>Support a Child</span>
              </button>

              {/* Watch Our Story - Opens Video Modal */}
              <button
                onClick={onWatchStory}
                className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
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

        {/* Impact Statistics Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-8">
          <div className="max-w-5xl mx-auto px-6">
            <div
              className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 transition-all duration-700 delay-500 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="grid grid-cols-2 md:grid-cols-4">
                {impactStats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`flex items-center justify-center gap-3 py-4 px-4 ${
                      index !== impactStats.length - 1 ? "md:border-r md:border-white/10" : ""
                    }`}
                  >
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                      {stat.icon}
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest hidden md:block">
          Scroll to explore
        </div>
      </div>
    </section>
  );
}
