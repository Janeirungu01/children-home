import { useEffect, useState } from "react";
import api from "../api/axios";
import { API } from "../api/endpoints";

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
        const { data } = await api.get(API.GET_PAGE_DATA, {
          params: { typeToCreate: "OURSTORY" },
        });

        const item = data?.result?.[0];

        if (item) {
          setOurStory({
            ourStoryTitle:
              item.ourStoryTitle || ourStory.ourStoryTitle,
            ourStorySubtitle:
              item.ourStorySubtitle || ourStory.ourStorySubtitle,
            ourStoryBody:
              item.ourStoryBody || ourStory.ourStoryBody,
          });
        }
      } catch {
        console.warn(
          "Our Story backend not available, using fallback content"
        );
      }
    }

    fetchOurStory();
  }, []);

  return (
    <section id="story" className="flex justify-center">
      <div className="flex flex-col items-center mt-10 mb-10 px-4">
        <span className="text-sm uppercase font-semibold text-primary">
          {ourStory.ourStoryTitle}
        </span>

        <h2 className="text-[40px] font-medium text-secondary mt-1 text-center">
          {ourStory.ourStorySubtitle}
        </h2>

        <p className="w-[90%] text-base text-center leading-6 text-text mt-2">
          {ourStory.ourStoryBody}
        </p>
      </div>
    </section>
  );
}
