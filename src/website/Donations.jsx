import { useEffect, useState } from "react";
import { fetchPageSection } from "../api/pageApi";

export default function Donations() {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadPayment() {
      try {
        const res = await fetchPageSection("PAYMENT");
        const item = res?.result?.[0] || null;

        if (!cancelled) {
          setPayment(item);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load payment info", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPayment();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-50 py-10 text-center">
        Loading donation details...
      </section>
    );
  }

  return (
    <section id="donate" className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center pt-4 mb-4 mt-4">
          <span className="text-primary uppercase font-semibold ">
            We Need Your Help
          </span>
          <h2 className="text-secondary text-2xl md:text-3xl mt-2 mb-4 ">
            Support Our Cause
          </h2>
          <p className="text-secondary max-w-3xl mx-auto">
            Your generous donations help us provide essential services and support
            to the children in our care. Every contribution, big or small, makes a
            significant impact on their lives.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 grid md:grid-cols-2 gap-8 items-center">

          {/* Left */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              How to Donate
            </h3>

            <p className="text-gray-700 mb-4">
              <span className="font-semibold text-primary">
                {payment?.paymentMethod || "Mpesa"} Transfer:
              </span>{" "}
              Use the following details to transfer your donation directly.
            </p>

            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Account Name:</span>{" "}
                <span>Brighter Together Foundation</span>
              </p>

              <p>
                <span className="font-semibold">Business Number:</span>{" "}
                <span className="font-semibold text-primary">
                  {payment?.businessNumber || "-"}
                </span>
              </p>

              <p>
                <span className="font-semibold">Account Number:</span>{" "}
                <span className="font-semibold text-primary">
                  {payment?.paymentAccount || "-"}
                </span>
              </p>
            </div>
          </div>

          {/* Right */}
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
