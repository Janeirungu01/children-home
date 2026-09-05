import { useEffect, useState } from "react";
import apiPublic from "../api/axiosPublic";
import { API } from "../api/endpoints";
import { FaHeart, FaUsers, FaCalendarAlt, FaHandshake } from "react-icons/fa";

const milestones = [
  { year: "2022", event: "Foundation Conceived", icon: <FaHeart /> },
  { year: "Oct 2022", event: "Implementation Began", icon: <FaHandshake /> },
  { year: "Nov 2022", event: "First Committee Formed", icon: <FaUsers /> },
  { year: "2024", event: "Growing Strong", icon: <FaCalendarAlt /> },
];

export default function OurStory() {
  const [ourStory, setOurStory] = useState({
    ourStoryTitle: "Our Story",
    ourStorySubtitle: "How Brighter Together Foundation Began",
    ourStoryBody:
      "The idea of starting an Organisation for struggling children was conceived in early 2022. However, it was not until 2022 October when one our close friend, the Late Lameck (Daggi) began implementing the idea. On 11th November 2022, the first steering committee was formed. It's First and current C.E.O N.P Lunani. On November 12th, 2022, the first Chairman was added to the Organisation. He was soon followed by 9 members. On the 5th of December 2023 other members joined the organisation to go and pay a visit at a children's home in Machakos. They were well received and accommodated. After the visit, the organisation sat down and discussed on how to grow further and when to should the Next Meeting be held. The Next Meeting was held on 20th of April 2024, and at this time, it was bigger and a much organised event than the Past One. Later then, more members Joined us.",
  });

  useEffect(() => {
    async function fetchOurStory() {
      try {
        const { data } = await apiPublic.get(API.GET_PAGE_DATA, {
          params: { typeToCreate: "OURSTORY" },
        });
        const item = data?.result?.[0];
        if (item) {
          setOurStory((prev) => ({
            ourStoryTitle: item.ourStoryTitle || prev.ourStoryTitle,
            ourStorySubtitle: item.ourStorySubtitle || prev.ourStorySubtitle,
            ourStoryBody: item.ourStoryBody || prev.ourStoryBody,
          }));
        }
      } catch {
        console.warn("Our Story backend not available, using fallback content");
      }
    }
    fetchOurStory();
  }, []);

  return (
    <section id="story" className="py-20 bg-white">
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
            <div className="mt-10 bg-gray-50 rounded-2xl p-8 border-l-4 border-green-600">
              <blockquote className="text-gray-700 italic text-lg mb-4">
                "Every child deserves a chance to thrive. Together, we can make that possible."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaUsers className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">N.P Lunani</div>
                  <div className="text-sm text-gray-500">Founder & CEO</div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 mt-10">
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
                <div className="text-2xl md:text-3xl font-bold text-green-600">150+</div>
                <div className="text-sm text-gray-500">Children Helped</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
                <div className="text-2xl md:text-3xl font-bold text-green-600">50+</div>
                <div className="text-sm text-gray-500">Active Members</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
                <div className="text-2xl md:text-3xl font-bold text-green-600">10+</div>
                <div className="text-sm text-gray-500">Programs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
