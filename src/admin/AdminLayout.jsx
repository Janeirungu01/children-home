import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col">
        <div className="p-6 text-center font-bold text-xl border-b border-white">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="block py-2 px-4 hover:bg-green-700 rounded">
            Dashboard
          </Link>
           <Link to="/admin/signup" className="block py-2 px-4 hover:bg-green-700 rounded">
            Create User
          </Link>
          <Link to="/admin/hero" className="block py-2 px-4 hover:bg-green-700 rounded">
            Hero
          </Link>
          <Link to="/admin/documents" className="block py-2 px-4 hover:bg-green-700 rounded">
            Documents
          </Link>
          <Link to="/admin/activities" className="block py-2 px-4 hover:bg-green-700 rounded">
            Activities
          </Link>
          <Link to="/admin/ourstory" className="block py-2 px-4 hover:bg-green-700 rounded">
            Our Story
          </Link>
          <Link to="/admin/payment" className="block py-2 px-4 hover:bg-green-700 rounded">
            Payment
          </Link>
          <Link to="/admin/contact" className="block py-2 px-4 hover:bg-green-700 rounded">
            Contact
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
