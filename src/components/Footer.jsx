import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiPublic from "../api/axiosPublic";
import { API } from "../api/endpoints";
import { fetchPageSection, updatePageSection, createPageSection } from "../api/pageApi";
import { useAdmin } from "../context/AdminContext";
import EditTag from "../admin/components/EditTag";
import InlineEditModal from "../admin/components/InlineEditModal";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
  FaArrowRight,
  FaCog
} from "react-icons/fa";

const quickLinks = [
  { name: "About Us", href: "#about" },
  { name: "Our Goals", href: "#goals" },
  { name: "Activities", href: "#program" },
  { name: "Our Story", href: "#story" },
  { name: "Donate", href: "#donate" },
];

const socialIcons = {
  facebook: FaFacebookF,
  twitter: FaTwitter,
  instagram: FaInstagram,
  youtube: FaYoutube,
  whatsApp: FaWhatsapp,
};

const linksEditFields = [
  { name: "youtube", label: "YouTube Video URL", type: "text", placeholder: "https://www.youtube.com/watch?v=...", help: "Main video embedded in the hero section" },
  { name: "youtubeChannel", label: "YouTube Channel URL", type: "text", placeholder: "https://www.youtube.com/@yourchannel", help: "Link to your YouTube channel page" },
  { name: "watchOurStory", label: "Watch Our Story URL", type: "text", placeholder: "https://www.youtube.com/watch?v=...", help: "Video link for 'Watch Our Story' button" },
  { name: "facebook", label: "Facebook URL", type: "text", placeholder: "https://facebook.com/..." },
  { name: "twitter", label: "Twitter/X URL", type: "text", placeholder: "https://twitter.com/..." },
  { name: "instagram", label: "Instagram URL", type: "text", placeholder: "https://instagram.com/..." },
  { name: "whatsApp", label: "WhatsApp Link", type: "text", placeholder: "https://wa.me/...", help: "Format: https://wa.me/254700000000" },
];

const contactEditFields = [
  { name: "email", label: "Email Address", type: "email", placeholder: "info@example.com" },
  { name: "phoneNumber", label: "Phone Number", type: "text", placeholder: "+254 700 000 000" },
  { name: "address", label: "Address", type: "text", placeholder: "Nairobi, Kenya" },
];

export default function Footer() {
  const { isAdminMode } = useAdmin();
  const [contact, setContact] = useState({ id: null, email: "", phoneNumber: "", address: "" });
  const [links, setLinks] = useState({ id: null, facebook: "", twitter: "", instagram: "", youtube: "", whatsApp: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchFooterData() {
      try {
        const [contactRes, linksRes] = await Promise.all([
          apiPublic.get(API.GET_PAGE_DATA, { params: { typeToCreate: "CONTACT" } }),
          apiPublic.get(API.GET_PAGE_DATA, { params: { typeToCreate: "LINKS" } }),
        ]);

        if (!cancelled) {
          const contactData = contactRes.data?.result?.[0];
          const linksData = linksRes.data?.result?.[0];
          if (contactData) setContact({ id: contactData.id, ...contactData });
          if (linksData) setLinks({ id: linksData.id, ...linksData });
        }
      } catch {
        if (!cancelled) console.warn("Failed to load footer data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchFooterData();
    return () => { cancelled = true; };
  }, []);

  const handleSaveLinks = async (data) => {
    if (links.id) {
      await updatePageSection("LINKS", { id: links.id, ...data });
    } else {
      await createPageSection("LINKS", data);
    }
    setLinks({ ...links, ...data });
  };

  const handleSaveContact = async (data) => {
    if (contact.id) {
      await updatePageSection("CONTACT", { id: contact.id, ...data });
    } else {
      await createPageSection("CONTACT", data);
    }
    setContact({ ...contact, ...data });
  };

  const socialEntries = links
    ? Object.entries(links).filter(([key, value]) => {
        // Use youtubeChannel for the social icon, not the video URL
        if (key === 'youtube' || key === 'watchOurStory') return false;
        if (key === 'youtubeChannel') return value; // Show YouTube icon if channel URL exists
        return socialIcons[key] && value;
      }).map(([key, value]) => {
        // Map youtubeChannel to youtube for the icon
        if (key === 'youtubeChannel') return ['youtube', value];
        return [key, value];
      })
    : [];

  return (
    <footer id="contact" className="bg-gray-900 text-white relative">
      {/* Edit Tags */}
      {isAdminMode && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <EditTag sectionId="links" label="Links" />
          <EditTag sectionId="contact" label="Contact" />
        </div>
      )}

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Brighter Together
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Restoring hope, one child at a time. Together, we can make a lasting difference 
              in the lives of children who need it most.
            </p>
            
            {/* Social Links */}
            {socialEntries.length > 0 && (
              <div className="flex gap-3">
                {socialEntries.map(([key, url]) => {
                  const Icon = socialIcons[key];
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 hover:bg-green-600 rounded-full flex items-center justify-center transition-all duration-300"
                      aria-label={key}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors group"
                  >
                    <FaArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              {contact?.email && (
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Email</div>
                    <a href={`mailto:${contact.email}`} className="text-gray-300 hover:text-white text-sm transition-colors">
                      {contact.email}
                    </a>
                  </div>
                </li>
              )}
              {contact?.phoneNumber && (
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaPhone className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Phone</div>
                    <a href={`tel:${contact.phoneNumber}`} className="text-gray-300 hover:text-white text-sm transition-colors">
                      {contact.phoneNumber}
                    </a>
                  </div>
                </li>
              )}
              {contact?.address && (
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Address</div>
                    <span className="text-gray-300 text-sm">{contact.address}</span>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Stay Connected</h4>
            <p className="text-gray-400 text-sm mb-4">
              Join our community and stay updated on our latest initiatives and impact stories.
            </p>
            <a
              href="#donate"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-green-600/30"
            >
              <FaHeart className="w-4 h-4" />
              Support Our Cause
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Brighter Together Foundation. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                Made with <FaHeart className="w-3 h-3 text-red-500" /> for children
              </span>
              {/* Subtle admin link */}
              <Link 
                to="/admin" 
                className="opacity-30 hover:opacity-100 transition-opacity duration-300"
                title="Admin"
              >
                <FaCog className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modals */}
      <InlineEditModal
        sectionId="links"
        title="Social Links & Video"
        fields={linksEditFields}
        initialData={links}
        onSave={handleSaveLinks}
      />
      <InlineEditModal
        sectionId="contact"
        title="Contact Info"
        fields={contactEditFields}
        initialData={contact}
        onSave={handleSaveContact}
      />
    </footer>
  );
}
