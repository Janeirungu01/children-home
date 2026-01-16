export default function Footer() {
  return (
    <footer id="contact" className="bg-primary text-white">
      <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h4 className="text-white text-xl mb-2">Contact Us</h4>
          <p>Email: info@brightertogetherfoundation.org</p>
          <p>
            Phone: +254 743 219 200
          </p>
          <p>Address: 123 Hope Street, Cityville</p>
        </div>

        <div>
          <h4 className="text-white text-xl mb-2">Quick Links</h4>
          <p>About Us</p>
          <p>Programs</p>
          <p>Contact</p>
          <p>Donate</p>
          <p>Goal</p>
        </div>

        <div>
          <h4 className="text-white text-xl mb-2">Connect With Us</h4>
          <p>Facebook | Twitter | Instagram | LinkedIn</p>
        </div>
      </div>

      <div className="bg-black text-primary text-center py-3 text-sm">
        &copy; 2026 Brighter Together Foundation. All rights reserved.
      </div>
    </footer>
  );
}
