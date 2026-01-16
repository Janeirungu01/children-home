import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-primary text-white px-4 py-6 flex justify-between items-center">
      <h3 className="font-bold text-xl">Brighter Together Foundation</h3>

      <div className="space-x-6 hidden md:flex items-center">
        <Link to="/" className="hover:underline">
          Home
        </Link>

        <Link to="/#activities" className="hover:underline">
          Activities
        </Link>

        <Link to="/#past-activities" className="hover:underline">
          Past
        </Link>

        <Link to="/#contact" className="hover:underline">
          Contact
        </Link>

        <Link
          to="/#donate"
          className="bg-white text-primary px-3 py-1 rounded font-semibold hover:bg-gray-100 transition"
        >
          Donate
        </Link>
      </div>
    </nav>
  );
}
