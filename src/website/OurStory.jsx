import { useEffect, useState } from "react";
import apiPublic from "../api/axiosPublic";
import { API } from "../api/endpoints";
import { fetchPageSection, updatePageSection, createPageSection } from "../api/pageApi";
import { FaHeart, FaUsers, FaCalendarAlt, FaHandshake } from "react-icons/fa";
import { useAdmin } from "../context/AdminContext";
import EditTag from "../admin/components/EditTag";
import InlineEditModal from "../admin/components/InlineEditModal";

const milestones = [
  { year: "2022", event: "Foundation Conceived", icon: <FaHeart /> },
  { year: "Oct 2022", event: "Implementation Began", icon: <FaHandshake /> },
  { year: "Nov 2022", event: "First Committee Formed", icon: <FaUsers /> },
  { year: "2024", event: "Growing Strong", icon: <FaCalendarAlt /> },
];

const storyEditFields = [
  { name: "ourStoryTitle", label: "Section Label", type: "text" },
  { name: "ourStorySubtitle", label: "Main Title", type: "text" },
  { name: "ourStoryBody", label: "Story Content", type: "textarea", rows: 10 },
];

const ceoEditFields = [
  { name: "ceoQuote", label: "CEO Quote", type: "textarea", rows: 3, placeholder: "Enter the CEO's inspirational quote" },
  { name: "ceoName", label: "CEO Name", type: "text", placeholder: "N.P Lunani" },
  { name: "ceoTitle", label: "CEO Title", type: "text", placeholder: "Founder & CEO" },
];

const storyStatsEditFields = [
  { name: "statChildrenHelped", label: "Children Helped Value", type: "text", placeholder: "150+" },
  { name: "statChildrenHelpedLabel", label: "Children Helped Label", type: "text", placeholder: "Children Helped" },
  { name: "statActiveMembers", label: "Active Members Value", type: "text", placeholder: "50+" },
  { name: "statActiveMembersLabel", label: "Active Members Label", type: "text", placeholder: "Active Members" },
  { name: "statPrograms", label: "Programs Value", type: "text", placeholder: "10+" },
  { name: "statProgramsLabel", label: "Programs Label", type: "text", placeholder: "Programs" },
];

export default function OurStory() {
  const { isAdminMode } = useAdmin();
  const [ourStory, setOurStory] = useState({
    id: null,
    ourStoryTitle: "Our Story",
    ourStorySubtitle: "How Brighter Together Foundation Began",
    ourStoryBody:
      "The idea of starting an Organisation for struggling children was conceived in early 2022. However, it was not until 2022 October when one our close friend, the Late Lameck (Daggi) began implementing the idea. On 11th November 2022, the first steering committee was formed. It's First and current C.E.O N.P Lunani. On November 12th, 2022, the first Chairman was added to the Organisation. He was soon followed by 9 members. On the 5th of December 2023 other members joined the organisation to go and pay a visit at a children's home in Machakos. They were well received and accommodated. After the visit, the organisation sat down and discussed on how to grow further and when to should the Next Meeting be held. The Next Meeting was held on 20th of April 2024, and at this time, it was bigger and a much organised event than the Past One. Later then, more members Joined us.",
  });

  const [ceoData, setCeoData] = useState({
    id: null,
    ceoQuote: "Every child deserves a chance to thrive. Together, we can make that possible.",
    ceoName: "N.P Lunani",
    ceoTitle: "Founder & CEO",
  });

  const [storyStats, setStoryStats] = useState({
    id: null,
    statChildrenHelped: "150+",
    statChildrenHelpedLabel: "Children Helped",
    statActiveMembers: "50+",
    statActiveMembersLabel: "Active Members",
    statPrograms: "10+",
    statProgramsLabel: "Programs",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Our Story
        const storyRes = await apiPublic.get(API.GET_PAGE_DATA, {
          params: { typeToCreate: "OURSTORY" },
        });
        const storyItem = storyRes.data?.result?.[0];
        if (storyItem) {
          setOurStory({
            id: storyItem.id,
            ourStoryTitle: storyItem.ourStoryTitle || ourStory.ourStoryTitle,
            ourStorySubtitle: storyItem.ourStorySubtitle || ourStory.ourStorySubtitle,
            ourStoryBody: storyItem.ourStoryBody || ourStory.ourStoryBody,
          });
        }

        // Fetch CEO Statement
        const ceoRes = await fetchPageSection("CEO");
        const ceoItem = ceoRes?.result?.[0];
        if (ceoItem) {
          setCeoData({
            id: ceoItem.id,
            ceoQuote: ceoItem.ceoQuote || ceoData.ceoQuote,
            ceoName: ceoItem.ceoName || ceoData.ceoName,
            ceoTitle: ceoItem.ceoTitle || ceoData.ceoTitle,
          });
        }

        // Fetch Stats (reuse from STATS but use the story-specific ones)
        const statsRes = await fetchPageSection("STATS");
        const statsItem = statsRes?.result?.[0];
        if (statsItem) {
          setStoryStats({
            id: statsItem.id,
            statChildrenHelped: statsItem.statChildrenHelped || storyStats.statChildrenHelped,
            statChildrenHelpedLabel: statsItem.statChildrenHelpedLabel || storyStats.statChildrenHelpedLabel,
            statActiveMembers: statsItem.statActiveMembers || storyStats.statActiveMembers,
            statActiveMembersLabel: statsItem.statActiveMembersLabel || storyStats.statActiveMembersLabel,
            statPrograms: statsItem.statPrograms || storyStats.statPrograms,
            statProgramsLabel: statsItem.statProgramsLabel || storyStats.statProgramsLabel,
          });
        }
      } catch {
        console.warn("Our Story backend not available, using fallback content");
      }
    }
    fetchData();
  }, []);

  const handleSaveStory = async (data) => {
    if (ourStory.id) {
      await updatePageSection("OURSTORY", { id: ourStory.id, ...data });
    } else {
      await createPageSection("OURSTORY", data);
    }
    setOurStory({ ...ourStory, ...data });
  };

  const handleSaveCeo = async (data) => {
    if (ceoData.id) {
      await updatePageSection("CEO", { id: ceoData.id, ...data });
    } else {
      await createPageSection("CEO", data);
    }
    setCeoData({ ...ceoData, ...data });
  };

  const handleSaveStoryStats = async (data) => {
    // Story stats are part of the main STATS entity
    if (storyStats.id) {
      await updatePageSection("STATS", { id: storyStats.id, ...data });
    } else {
      await createPageSection("STATS", data);
    }
    setStoryStats({ ...storyStats, ...data });
  };

  return (
    <section id="story" className="py-20 bg-white relative">
      {/* Edit Tag */}
      {isAdminMode && (
        <div className="absolute top-4 right-4 z-10">
          <EditTag sectionId="story" label="Story" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FaHeart className="w-3 h-3" />
            {ourStory.ourStoryTitle}
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {ourStory.ourStorySubtitle}
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Timeline - Left Side */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Our Journey</h3>
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white">{milestone.icon}</span>
                    </div>
                    <div>
                      <div className="text-green-200 text-sm font-medium">{milestone.year}</div>
                      <div className="text-white font-semibold">{milestone.event}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Decorative Element */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="text-4xl font-bold">4+</div>
                <div className="text-green-200 text-sm">Years of Impact</div>
              </div>
            </div>
          </div>

          {/* Story Content - Right Side */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed text-base md:text-lg first-letter:text-5xl first-letter:font-bold first-letter:text-green-600 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                {ourStory.ourStoryBody}
              </p>
            </div>

            {/* Founder Quote */}
            <div className="relative mt-10 bg-gray-50 rounded-2xl p-8 border-l-4 border-green-600">
              {/* CEO Edit Tag */}
              {isAdminMode && (
                <div className="absolute -top-2 -right-2 z-10">
                  <EditTag sectionId="ceo" label="CEO" />
                </div>
              )}
              <blockquote className="text-gray-700 italic text-lg mb-4">
                "{ceoData.ceoQuote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaUsers className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{ceoData.ceoName}</div>
                  <div className="text-sm text-gray-500">{ceoData.ceoTitle}</div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="relative grid grid-cols-3 gap-6 mt-10">
              {/* Story Stats Edit Tag */}
              {isAdminMode && (
                <div className="absolute -top-2 -right-2 z-10">
                  <EditTag sectionId="storyStats" label="Stats" />
                </div>
              )}
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
                <div className="text-2xl md:text-3xl font-bold text-green-600">{storyStats.statChildrenHelped}</div>
                <div className="text-sm text-gray-500">{storyStats.statChildrenHelpedLabel}</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
                <div className="text-2xl md:text-3xl font-bold text-green-600">{storyStats.statActiveMembers}</div>
                <div className="text-sm text-gray-500">{storyStats.statActiveMembersLabel}</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
                <div className="text-2xl md:text-3xl font-bold text-green-600">{storyStats.statPrograms}</div>
                <div className="text-sm text-gray-500">{storyStats.statProgramsLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Edit Modal for Story */}
      <InlineEditModal
        sectionId="story"
        title="Our Story"
        fields={storyEditFields}
        initialData={ourStory}
        onSave={handleSaveStory}
      />

      {/* Inline Edit Modal for CEO */}
      <InlineEditModal
        sectionId="ceo"
        title="CEO Statement"
        fields={ceoEditFields}
        initialData={ceoData}
        onSave={handleSaveCeo}
      />

      {/* Inline Edit Modal for Story Stats */}
      <InlineEditModal
        sectionId="storyStats"
        title="Story Statistics"
        fields={storyStatsEditFields}
        initialData={storyStats}
        onSave={handleSaveStoryStats}
      />
    </section>
  );
}
