export default function ContactManager() {
  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-4">Update Contact Info</h2>

      <form className="bg-white p-4 rounded shadow">
        <input type="text" placeholder="Phone" className="border p-2 w-full mb-2" />
        <input type="email" placeholder="Email" className="border p-2 w-full mb-2" />
        <input type="text" placeholder="Location" className="border p-2 w-full mb-2" />
        <button className="bg-primary text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
