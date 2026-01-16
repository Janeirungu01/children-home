import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./website/Home"
import PastActivities from "./website/PastActivities";
import Contact from "./website/Contact";
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
          <Route path="activities" element={<ActivitiesManager />} />
          <Route path="contact" element={<ContactManager />} />
        </Route>
        
      </Routes>
    </BrowserRouter>

    {/* <Hero />
      <Goals />
      <ImageTextSection />
      <ActivitiesSection />
      <Footer /> */}
    </>

  )
}

export default App
