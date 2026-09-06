import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./website/Home";
import ActivitiesSection from "./components/ActivitiesSection";
import OurStory from "./website/OurStory";
import GoalSection from "./website/Goals";
import Footer from "./components/Footer";

import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminAuthGuard from "./admin/AdminAuthGuard";
import CreateUser from "./admin/CreateUser";
import LoginPage from "./components/Login";
import Dashboard from "./admin/Dashboard";

import { AppProvider } from "./context/AppContext";
import { AdminProvider } from "./context/AdminContext";
import Notifications from "./components/Notifications";
import DonationTracker from "./components/DonationTracker";
import { DonationPersistence } from "./hooks/usePersistDonations";

function App() {
  return (
    <AppProvider>
      <Notifications />
      <DonationTracker />
      <DonationPersistence />
      <BrowserRouter>
        <AdminProvider>
          <Routes>
            {/* Public Website - with admin editing capabilities when logged in */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/activities" element={<ActivitiesSection />} />
            <Route path="/goals" element={<GoalSection />} />
            <Route path="/story" element={<OurStory />} />
            <Route path="/contact" element={<Footer />} />

            {/* Admin Login (public) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes - Dashboard */}
            <Route path="/admin" element={
              <AdminAuthGuard>
                <AdminLayout />
              </AdminAuthGuard>
            }>
              <Route index element={<Dashboard />} />
              <Route path="create-user" element={<CreateUser />} />
            </Route>
          </Routes>
        </AdminProvider>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
