import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./website/Home";
import PastActivities from "./website/PastActivities";
import HeroManager from "./admin/HeroManager";
import GoalsManager from "./admin/GoalsManager";
import AboutManager from "./admin/AboutManager";
import DonationsManager from "./admin/DonationsManager";

import Footer from "./components/Footer";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import ActivitiesManager from "./admin/ActivitiesManager";
import ActivitiesSection from "./components/ActivitiesSection";
import ContactManager from "./admin/ContactManager";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<ActivitiesSection />} />
          <Route path="/past-activities" element={<PastActivities />} />
          <Route path="/contact" element={<Footer />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="hero" element={<HeroManager />} />
            <Route path="goals" element={<GoalsManager />} />
            <Route path="about" element={<AboutManager />} />
            <Route path="activities" element={<ActivitiesManager />} />
            <Route path="donations" element={<DonationsManager />} />
            <Route path="contact" element={<ContactManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
