export default function ActivitiesManager() {
  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-4">Manage Activities</h2>

      <form className="bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Activity Title"
          className="border p-2 w-full mb-2"
        />
        <textarea
          placeholder="Description"
          className="border p-2 w-full mb-2"
        ></textarea>
        <input type="date" className="border p-2 w-full mb-2" />
        <button className="bg-primary text-white px-4 py-2 rounded">
          Add Activity
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Existing Activities</h3>
        <p>No activities yet.</p>
      </div>
    </div>
  );
}
