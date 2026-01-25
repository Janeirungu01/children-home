import { useEffect, useState } from "react";
import { API } from "../Config";

export default function OurStory() {
  const [ourStory, setOurStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOurStory();
  }, []);

 async function fetchOurStory() {
  try {
    const res = await fetch(
      `${API.BASE_URL}/page/data/get-all-page-data?typeToCreate=OURSTORY`
    );
    const data = await res.json();
    
    // Backend returns array inside `result`
    if (data.result && data.result.length > 0) {
      setOurStory(data.result[0]);
    } else {
      setOurStory(null);
    }
  } catch (error) {
    console.error("Failed to fetch Our Story", error);
  } finally {
    setLoading(false);
  }
}

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!ourStory) return null;

  return (
    <>
    <section id="story" className="flex justify-center">
      <div className="flex flex-col items-center  mt-10 mb-10 px-4">
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
    </>
  );
}

