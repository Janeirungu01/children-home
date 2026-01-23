import { useEffect, useState } from "react";
import { fetchPageSection, updatePageSection } from "../components/api";

export default function FooterManager() {
  // IDs (required for updates)
  const [contactId, setContactId] = useState(null);
  const [linksId, setLinksId] = useState(null);

  // Contact
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // Links
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [whatsApp, setWhatsApp] = useState("");

  const [loading, setLoading] = useState(false);

  // 🔹 Load existing footer data
  useEffect(() => {
    async function loadFooterData() {
      try {
        const [contactRes, linksRes] = await Promise.all([
          fetchPageSection("CONTACT"),
          fetchPageSection("LINKS"),
        ]);

        // CONTACT
        const contactItem = contactRes?.result?.[0];
        if (contactItem) {
          setContactId(contactItem.id);
          setEmail(contactItem.contactRequest?.email || "");
          setPhoneNumber(contactItem.contactRequest?.phoneNumber || "");
          setAddress(contactItem.contactRequest?.address || "");
        }

        // LINKS
        const linksItem = linksRes?.result?.[0];
        if (linksItem) {
          setLinksId(linksItem.id);
          setFacebook(linksItem.links?.facebook || "");
          setTwitter(linksItem.links?.twitter || "");
          setInstagram(linksItem.links?.instagram || "");
          setYoutube(linksItem.links?.youtube || "");
          setWhatsApp(linksItem.links?.whatsApp || "");
        }
      } catch (err) {
        console.error("Failed to load footer data", err);
      }
    }

    loadFooterData();
  }, []);

  // 🔹 Save footer changes
 const handleSubmit = async () => {
  if (loading) return;
  setLoading(true);

  try {
    // 1️⃣ Update CONTACT first
    await updatePageSection("CONTACT", {
      id: contactId,
      email: email.trim(),
      phoneNumber,
      address,
    });

    // 2️⃣ Then update LINKS
    await updatePageSection("LINKS", {
      id: linksId,
      facebook,
      twitter,
      instagram,
      youtube,
      whatsApp,
    });

    alert("Footer updated successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to update footer");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-8">
        <h2 className="text-2xl font-bold text-secondary">
          Footer Settings
        </h2>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Contact Information
          </h3>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-lg border px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="text"
              placeholder="Phone number"
              className="w-full rounded-lg border px-4 py-2"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <input
              type="text"
              placeholder="Physical address"
              className="w-full rounded-lg border px-4 py-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* Social Links Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Social Media Links
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Facebook"
              className="input-field"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
            <input
              placeholder="Twitter (X)"
              className="input-field"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
            />
            <input
              placeholder="Instagram"
              className="input-field"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
            <input
              placeholder="YouTube"
              className="input-field"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
            />
            <input
              placeholder="WhatsApp"
              className="input-field"
              value={whatsApp}
              onChange={(e) => setWhatsApp(e.target.value)}
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold
                     hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Footer Changes"}
        </button>
      </div>
    </div>
  );
}
