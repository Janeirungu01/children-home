import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../Config";

export default function ActivitiesSection() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await axios.get(
        `${API.BASE_URL}/activities/search-activities?groupname=headers&pageSize=50`
      );

      setActivities(res.data.result?.content || []);
    } catch (err) {
      console.error("Failed to load activities", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-6 text-center text-gray-500">
        Loading activities...
      </section>
    );
  }

  return (
    <section id="program" className="py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center px-4">
        <span className="text-primary uppercase font-semibold">
          Our Latest News
        </span>
        <h2 className="text-secondary text-3xl md:text-4xl font-medium my-2">
          Recent Activities and Projects
        </h2>

        {activities.length === 0 ? (
          <p className="mt-8 text-gray-500">No activities available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            {activities.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-tr-3xl rounded-bl-3xl shadow overflow-hidden"
              >
                {/* Document placeholder */}
                <div className="h-40 w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm text-gray-500">
                    {a.document?.documentTitle || "Document"}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-secondary text-lg mb-1 font-medium capitalize">
                    {a.title}
                  </h3>

                  <p className="text-text mb-1 capitalize text-sm">
                    <span className="text-primary font-bold">Location:</span>{" "}
                    {a.subtitle}
                  </p>

                  <p className="text-sm text-text">{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
