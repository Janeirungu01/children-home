export default function Donations() {
  return (
    <section id="donate" className="bg-gray-50 ">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary uppercase font-semibold tracking-wide">
            We Need Your Help
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
            Support Our Cause
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto">
            Your generous donations help us provide essential services and support
            to the children in our care. Every contribution, big or small, makes a
            significant impact on their lives.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 grid md:grid-cols-2 gap-8 items-center">

          {/* Left: Text */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              How to Donate
            </h3>

            <p className="text-gray-700 mb-4">
              <span className="font-semibold text-primary">Mpesa Transfer:</span>{" "}
              Use the following details to transfer your donation directly to our
              Mpesa account.
            </p>

            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Name:</span> Brighter Together Foundation
              </p>
              <p>
                <span className="font-semibold">Account Number:</span> 123456789
              </p>
              <p>
                <span className="font-semibold">Business Number:</span> 247247
              </p>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="text-center md:text-left">
            <p className="text-gray-600 mb-6">
              Your support goes directly to food, education, healthcare and shelter
              for the children. Thank you for making a difference.
            </p>

            <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition">
              Donate Now
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
