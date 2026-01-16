import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-primary text-white p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <Link to="/admin">Dashboard</Link><br />
          <Link to="/admin/activities">Manage Activities</Link><br />
          <Link to="/admin/contact">Contact Info</Link>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
