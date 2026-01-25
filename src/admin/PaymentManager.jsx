import { useEffect, useState } from "react";
import { fetchPageSection, updatePageSection } from "../components/api";

export default function PaymentManager() {
  const [paymentId, setPaymentId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [paymentAccount, setPaymentAccount] = useState("");
  const [loading, setLoading] = useState(false);

  // Load existing payment data
  useEffect(() => {
    async function loadPaymentData() {
      try {
        const res = await fetchPageSection("PAYMENT");
        const item = res?.result?.[0];
        if (item) {
          setPaymentId(item.id);
          setPaymentMethod(item.paymentMethod || "");
          setBusinessNumber(item.businessNumber || "");
          setPaymentAccount(item.paymentAccount || "");
        }
      } catch (err) {
        console.error("Failed to load payment data", err);
      }
    }

    loadPaymentData();
  }, []);

  // Save updates
  const handleSubmit = async () => {
    if (!paymentId) return alert("Payment ID missing!");
    setLoading(true);

    try {
      await updatePageSection("PAYMENT", {
        id: paymentId,
        paymentMethod,
        businessNumber,
        paymentAccount,
      });

      alert("Payment details updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update payment details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-secondary">Payment Settings</h2>

        <div className="space-y-3">
          <input
            placeholder="Payment Method (e.g., PAYBILL)"
            className="w-full border px-4 py-2 rounded-lg"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <input
            placeholder="Business Number"
            className="w-full border px-4 py-2 rounded-lg"
            value={businessNumber}
            onChange={(e) => setBusinessNumber(e.target.value)}
          />
          <input
            placeholder="Account Number"
            className="w-full border px-4 py-2 rounded-lg"
            value={paymentAccount}
            onChange={(e) => setPaymentAccount(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Payment Details"}
        </button>
      </div>
    </div>
  );
}
