import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./website/Home";
import PastActivities from "./website/PastActivities";
import HeroManager from "./admin/HeroManager";
import ActivitiesSection from "./components/ActivitiesSection";
import UploadDocument from "./admin/UploadDocument";
import OurStory from "./website/OurStory";
import Footer from "./components/Footer";

import AdminLayout from "./admin/AdminLayout";
import SignUpPage from "./components/Signup";
import LoginPage from "./components/Login";
import Dashboard from "./admin/Dashboard";
import ActivitiesManager from "./admin/ActivitiesManager";
import OurStoryManager from "./admin/OurStoryManager";
import PaymentManager from "./admin/PaymentManager";
import FooterManager from "./admin/FooterManager";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/signup" element={<SignUpPage />} /> */}
          <Route path="/activities" element={<ActivitiesSection />} />
          <Route path="/past-activities" element={<PastActivities />} />
          <Route path="/story" element={<OurStory />} />
          <Route path="/contact" element={<Footer />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="hero" element={<HeroManager />} />
            <Route path="documents" element={<UploadDocument />} />
            <Route path="ourstory" element={<OurStoryManager />} />
            <Route path="activities" element={<ActivitiesManager />} />
            <Route path="payment" element={<PaymentManager />} />
            <Route path="contact" element={<FooterManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
