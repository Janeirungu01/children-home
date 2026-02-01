import { useEffect, useState } from "react";
import { fetchPageSection, updatePageSection, createPageSection } from "../api/pageApi";

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
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Load existing footer data
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
          setEmail(contactItem.email || "");
          setPhoneNumber(contactItem.phoneNumber || "");
          setAddress(contactItem.address || "");
        }

        const linksItem = linksRes?.result?.[0];
        if (linksItem) {
          setLinksId(linksItem.id);
          setFacebook(linksItem.facebook || "");
          setTwitter(linksItem.twitter || "");
          setInstagram(linksItem.instagram || "");
          setYoutube(linksItem.youtube || "");
          setWhatsApp(linksItem.whatsApp || "");
        }
      } catch (err) {
        console.error("Failed to load footer data", err);
      }
    }

    loadFooterData();
  }, []);

  // Create / Update handler
  const handleSave = async () => {
    if (!email && !phoneNumber) {
      alert("At least email or phone number is required.");
      return;
    }

    setLoading(true);
    try {
      if (isCreatingNew) {
        // CREATE footer (CONTACT + LINKS)
        await Promise.all([
          createPageSection("CONTACT", {
            email: email.trim(),
            phoneNumber,
            address,
          }),
          createPageSection("LINKS", {
            facebook,
            twitter,
            instagram,
            youtube,
            whatsApp,
          }),
        ]);

        alert("New footer created successfully!");
        setIsCreatingNew(false);
      } else {
        // UPDATE footer
        if (contactId) {
          await updatePageSection("CONTACT", {
            id: contactId,
            email: email.trim(),
            phoneNumber,
            address,
          });
        }

        if (linksId) {
          await updatePageSection("LINKS", {
            id: linksId,
            facebook,
            twitter,
            instagram,
            youtube,
            whatsApp,
          });
        }

        alert("Footer updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save footer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
        {/* Header + Add New button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-secondary">
            Footer Settings
          </h2>
          <button
            onClick={() => {
              setIsCreatingNew(true);
              setContactId(null);
              setLinksId(null);

              setEmail("");
              setPhoneNumber("");
              setAddress("");

              setFacebook("");
              setTwitter("");
              setInstagram("");
              setYoutube("");
              setWhatsApp("");
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Add New Footer
          </button>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-700">
            Contact Information
          </h3>

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

        {/* Social Links */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-700">
            Social Media Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            <SocialInput label="Facebook" placeholder="https://facebook.com/..." value={facebook} onChange={setFacebook} />
            <SocialInput label="Twitter (X)" placeholder="https://x.com/..." value={twitter} onChange={setTwitter} />
            <SocialInput label="Instagram" placeholder="https://instagram.com/..." value={instagram} onChange={setInstagram} />
            <SocialInput label="YouTube" placeholder="https://youtube.com/..." value={youtube} onChange={setYoutube} />
            <SocialInput label="WhatsApp" placeholder="https://wa.me/..." value={whatsApp} onChange={setWhatsApp} />
          </div>
        </div>

        {/* Save / Create button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : isCreatingNew
            ? "Create Footer"
            : "Save Footer Changes"}
        </button>
      </div>
    </div>
  );
}

/* Social input helper */
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
