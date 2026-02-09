import { useEffect, useState } from "react";
import api from "../api/axios";
import { API } from "../api/endpoints";
import DocumentImage from "./DocumentImage";

export default function ViewActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const res = await api.get(API.SEARCH_ACTIVITIES, {
        params: { groupname: "ACTIVITIES", pageSize: 50 },
      });
      setActivities(res.data?.result?.content || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?"))
      return;

    try {
      setDeletingId(id);
      await api.delete(API.DELETE_ACTIVITY, { params: { id } });
      setActivities((prev) => prev.filter((a) => a.id !== id));
      alert("Activity deleted successfully");
    } catch (error) {
      console.error("Failed to delete activity:", error);
      alert("Failed to delete activity");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading activities...
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        No activities found.
      </div>
    );
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-secondary mb-8 text-center">
          Recent Activities
        </h2>

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden relative"
            >
              <div className="h-40 w-full bg-gray-200 flex overflow-hidden">
                <DocumentImage
                  documentId={activity.document?.documentId}
                  alt={activity.title}
                />
              </div>

              <div className="p-4 text-left">
                <h3 className="text-secondary text-lg mb-1 font-medium capitalize">
                  {activity.title}
                </h3>

                <p className="text-text mb-1 capitalize text-sm">
                  <span className="text-primary font-bold">Location:</span>{" "}
                  {activity.subtitle}
                </p>

                <p className="text-sm text-text">{activity.body}</p>
              </div>

              {/* <div className="p-4">
                  <h3 className="text-lg font-semibold text-secondary mb-1">
                    {activity.title}
                  </h3>

                  <p className="text-sm text-primary font-medium mb-2">
                    {activity.subtitle}
                  </p>

                  <p className="text-sm text-text line-clamp-3">
                    {activity.body}
                  </p>
                </div> */}

              <button
                onClick={() => handleDelete(activity.id)}
                disabled={deletingId === activity.id}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600 transition disabled:opacity-50"
              >
                {deletingId === activity.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
