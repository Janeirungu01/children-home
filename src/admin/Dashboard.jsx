import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaUserPlus, FaSignOutAlt } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Manage your website from here.</p>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Edit Website */}
        <Link
          to="/?admin=true"
          className="group bg-green-600 hover:bg-green-700 text-white rounded-2xl p-8 flex flex-col items-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <FaEdit className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold">Edit Website</h3>
            <p className="text-white/80 text-sm mt-1">Modify content inline</p>
          </div>
        </Link>

        {/* View Website */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-8 flex flex-col items-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <FaEye className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold">View Website</h3>
            <p className="text-white/80 text-sm mt-1">Preview live site</p>
          </div>
        </a>

        {/* Create User */}
        <Link
          to="/admin/create-user"
          className="group bg-purple-600 hover:bg-purple-700 text-white rounded-2xl p-8 flex flex-col items-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <FaUserPlus className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold">Create User</h3>
            <p className="text-white/80 text-sm mt-1">Add new admin</p>
          </div>
        </Link>
      </div>

      {/* Help Text */}
      <div className="mt-12 text-center max-w-xl">
        <p className="text-gray-500 text-sm">
          Click <span className="text-green-600 font-medium">"Edit Website"</span> to modify all content directly on the live site. 
          Hover over sections to see edit buttons.
        </p>
      </div>
    </div>
  );
}
