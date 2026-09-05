import { useEffect, useState } from "react";
import apiPublic from "../api/axiosPublic";
import { API } from "../api/endpoints";
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
  FaArrowRight
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

export default function Footer() {
  const [contact, setContact] = useState(null);
  const [links, setLinks] = useState(null);
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
          setContact(contactRes.data?.result?.[0] || null);
          setLinks(linksRes.data?.result?.[0] || null);
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

  const socialEntries = links
    ? Object.entries(links).filter(([key, value]) => socialIcons[key] && value)
    : [];

  return (
    <footer id="contact" className="bg-gray-900 text-white">
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
