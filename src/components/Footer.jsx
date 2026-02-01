import { useEffect, useState } from "react";
import api from "../api/axios"; 
import { API } from "../api/endpoints";

export default function Footer() {
  const [contact, setContact] = useState(null);
  const [links, setLinks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchFooterData() {
      try {
        const [contactRes, linksRes] = await Promise.all([
          api.get(API.GET_PAGE_DATA, { params: { typeToCreate: "CONTACT" } }),
          api.get(API.GET_PAGE_DATA, { params: { typeToCreate: "LINKS" } }),
        ]);

        if (!cancelled) {
          // Use flat structure
          const contactItem = contactRes.data?.result?.[0] || null;
          const linksItem = linksRes.data?.result?.[0] || null;

          setContact(contactItem);
          setLinks(linksItem);
        }
      } catch {
        if (!cancelled) {
          console.warn("Failed to load footer data, using fallback");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchFooterData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <footer className="bg-primary text-white py-10 text-center">
        Loading footer...
      </footer>
    );
  }

  return (
    <footer id="contact" className="bg-primary text-white">
      <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Contact */}
        <div>
          <h4 className="text-xl font-semibold mb-3">Contact Us</h4>
          <p>Email: {contact?.email || "-"}</p>
          <p>Phone: {contact?.phoneNumber || "-"}</p>
          <p>Address: {contact?.address || "-"}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-1">
            <li>About Us</li>
            <li>Programs</li>
            <li>Contact</li>
            <li>Donate</li>
            <li>Goals</li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-xl font-semibold mb-3">Connect With Us</h4>
          <ul className="space-y-1">
            {links?.facebook && <li><a href={links.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a></li>}
            {links?.twitter && <li><a href={links.twitter} target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter (X)</a></li>}
            {links?.instagram && <li><a href={links.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a></li>}
            {links?.youtube && <li><a href={links.youtube} target="_blank" rel="noopener noreferrer" className="hover:underline">YouTube</a></li>}
            {links?.whatsApp && <li><a href={links.whatsApp} target="_blank" rel="noopener noreferrer" className="hover:underline">WhatsApp</a></li>}
          </ul>
        </div>
      </div>

      <div className="text-center py-3 text-sm border-t border-white/20">
        &copy; {new Date().getFullYear()} Brighter Together Foundation. All rights reserved.
      </div>
    </footer>
  );
}
