import { HashLink } from "react-router-hash-link";

export default function Navbar() {
  return (
    <nav className="bg-primary text-white px-4 py-6 flex justify-between items-center">
      <h3 className="font-bold text-xl">Brighter Together Foundation</h3>
      <div className="space-x-6 hidden md:flex items-center">
        <HashLink to="/" className="hover:underline">
          Home
        </HashLink>

        <HashLink href="/#goals" className="hover:underline">
          Goals
        </HashLink>

        <HashLink to="/#activities" className="hover:underline">
          Programs
        </HashLink>

        <HashLink to="/#story" className="hover:underline">
          About Us
        </HashLink>

        <HashLink to="/#contact" className="hover:underline">
          Contact
        </HashLink>

        <HashLink to="/#donate"
          className="bg-white text-primary px-3 py-1 rounded font-semibold hover:bg-gray-100 transition"
        >
          Donate
        </HashLink>
      </div>
    </nav>
  );
}
