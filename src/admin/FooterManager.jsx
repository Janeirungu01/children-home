import { useEffect, useState } from "react";
import { fetchPageSection, updatePageSection } from "../components/api";

export default function FooterManager() {
  const [contactId, setContactId] = useState(null);
  const [linksId, setLinksId] = useState(null);

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [whatsApp, setWhatsApp] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFooterData() {
      try {
        const [contactRes, linksRes] = await Promise.all([
          fetchPageSection("CONTACT"),
          fetchPageSection("LINKS"),
        ]);

        const contactItem = contactRes?.result?.[0];
        if (contactItem) {
          setContactId(contactItem.id);
          setEmail(contactItem.contactRequest?.email || "");
          setPhoneNumber(contactItem.contactRequest?.phoneNumber || "");
          setAddress(contactItem.contactRequest?.address || "");
        }

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

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await updatePageSection("CONTACT", {
        id: contactId,
        email: email.trim(),
        phoneNumber,
        address,
      });

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
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-secondary">
          Contact Settings
        </h2>

        {/* Contact Information */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-700">Contact Information</h3>

          <input
            type="email"
            placeholder="Email address"
            className="w-full border px-3 py-1.5 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone number"
            className="w-full border px-3 py-1.5 rounded-lg"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <input
            type="text"
            placeholder="Physical address"
            className="w-full border px-3 py-1.5 rounded-lg"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Social Media Links */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-700">Social Media Links</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            <SocialInput
              label="Facebook"
              placeholder="https://facebook.com/..."
              value={facebook}
              onChange={setFacebook}
            />
            <SocialInput
              label="Twitter (X)"
              placeholder="https://x.com/..."
              value={twitter}
              onChange={setTwitter}
            />
            <SocialInput
              label="Instagram"
              placeholder="https://instagram.com/..."
              value={instagram}
              onChange={setInstagram}
            />
            <SocialInput
              label="YouTube"
              placeholder="https://youtube.com/..."
              value={youtube}
              onChange={setYoutube}
            />
            <SocialInput
              label="WhatsApp"
              placeholder="https://wa.me/..."
              value={whatsApp}
              onChange={setWhatsApp}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Footer Changes"}
        </button>
      </div>
    </div>
  );
}

/* 🔹 Reusable Social Input */
function SocialInput({ label, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col space-y-1 text-sm">
      <label className="text-gray-600">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full border px-3 py-1.5 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
