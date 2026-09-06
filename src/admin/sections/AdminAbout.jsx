import { useEffect, useState } from "react";
import { fetchPageSection, updatePageSection } from "../../api/pageApi";
import EditableSection from "../components/EditableSection";
import { FaHeart, FaHandHoldingHeart, FaHome, FaGraduationCap } from "react-icons/fa";
import aboutImage from "../../assets/children12.jpg";

const features = [
  { icon: <FaHome className="w-5 h-5" />, title: "Safe Home", desc: "Providing shelter and care" },
  { icon: <FaGraduationCap className="w-5 h-5" />, title: "Education", desc: "Access to quality learning" },
  { icon: <FaHeart className="w-5 h-5" />, title: "Healthcare", desc: "Medical support services" },
  { icon: <FaHandHoldingHeart className="w-5 h-5" />, title: "Love & Care", desc: "Nurturing environment" },
];

export default function AdminAbout({ isEditing, onEdit, onClose }) {
  const [introData, setIntroData] = useState({
    id: null,
    introductionTitle: "Make a Difference Today",
    introductionSubtitle: "Support Orphans in Extreme Need",
    introductionBody:
      "Brighter Together Foundation has been a beacon of hope for many underprivileged orphans. Our commitment to providing a loving and supportive environment has transformed countless lives and made a huge difference in our community.",
  });
  const [editData, setEditData] = useState({ ...introData });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadIntroduction() {
      try {
        const res = await fetchPageSection("INTRODUCTION");
        const item = res?.result?.[0];
        if (item) {
          const data = {
            id: item.id,
            introductionTitle: item.introductionTitle || introData.introductionTitle,
            introductionSubtitle: item.introductionSubtitle || introData.introductionSubtitle,
            introductionBody: item.introductionBody || introData.introductionBody,
          };
          setIntroData(data);
          setEditData(data);
        }
      } catch {
        console.warn("Introduction backend not available");
      }
    }
    loadIntroduction();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePageSection("INTRODUCTION", {
        ...editData,
        typeToCreate: "INTRODUCTION",
      });
      setIntroData(editData);
      onClose();
    } catch (err) {
      console.error("Failed to save", err);
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(introData);
    onClose();
  };

  const displayData = isEditing ? editData : introData;

  return (
    <EditableSection
      isEditing={isEditing}
      onEdit={onEdit}
      onClose={handleCancel}
      onSave={handleSave}
      title="About Section"
      saving={saving}
    >
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Side */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={aboutImage}
                  alt="Children at Brighter Together Foundation"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -right-4 lg:-right-8 bg-white rounded-xl shadow-lg p-5 max-w-[200px]">
                <div className="text-3xl font-bold text-green-600 mb-1">4+</div>
                <div className="text-sm text-gray-600">Years of changing lives</div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-100 rounded-full -z-10" />
              <div className="absolute -bottom-4 -left-8 w-16 h-16 bg-green-200 rounded-full -z-10" />
            </div>

            {/* Content Side */}
            <div className="lg:pl-8">
              {/* Section Label */}
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <FaHeart className="w-3 h-3" />
                About Our Foundation
              </div>

              {/* Editable Subtitle */}
              {isEditing ? (
                <input
                  type="text"
                  value={editData.introductionSubtitle}
                  onChange={(e) => setEditData({ ...editData, introductionSubtitle: e.target.value })}
                  className="w-full text-3xl md:text-4xl font-bold text-gray-900 mb-4 bg-white border-2 border-green-500 rounded-lg px-3 py-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                />
              ) : (
                <h2
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {displayData.introductionSubtitle}
                </h2>
              )}

              {/* Editable Title */}
              {isEditing ? (
                <input
                  type="text"
                  value={editData.introductionTitle}
                  onChange={(e) => setEditData({ ...editData, introductionTitle: e.target.value })}
                  className="w-full text-green-600 font-semibold text-lg mb-4 bg-white border-2 border-green-500 rounded-lg px-3 py-2"
                />
              ) : (
                <p className="text-green-600 font-semibold text-lg mb-4">
                  {displayData.introductionTitle}
                </p>
              )}

              {/* Editable Body */}
              {isEditing ? (
                <textarea
                  value={editData.introductionBody}
                  onChange={(e) => setEditData({ ...editData, introductionBody: e.target.value })}
                  rows={6}
                  className="w-full text-gray-600 leading-relaxed mb-8 bg-white border-2 border-green-500 rounded-lg px-3 py-2"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed mb-8">
                  {displayData.introductionBody}
                </p>
              )}

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                      <p className="text-gray-500 text-xs">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href="#donations"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-600/30"
              >
                <FaHandHoldingHeart />
                Support Our Cause
              </a>
            </div>
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
