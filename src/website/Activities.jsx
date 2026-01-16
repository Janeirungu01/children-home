import Navbar from "../components/Navbar";

export default function Activities() {
  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-4">Current Activities</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded p-4 shadow">
            <h3 className="font-semibold">School Outreach</h3>
            <p>Visiting local schools to donate books.</p>
          </div>
        </div>
      </div>
    </>
  );
}
