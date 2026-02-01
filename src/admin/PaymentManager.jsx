import { useEffect, useState } from "react";
import { fetchPageSection, updatePageSection, createPageSection } from "../api/pageApi";

export default function PaymentManager() {
  const [paymentId, setPaymentId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [paymentAccount, setPaymentAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

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

  // Create / Update handler
  const handleSave = async () => {
    if (!paymentMethod || !businessNumber) {
      alert("Payment method and business number are required.");
      return;
    }

    setLoading(true);
    try {
      if (isCreatingNew) {
        // CREATE payment
        await createPageSection("PAYMENT", {
          paymentMethod,
          businessNumber,
          paymentAccount,
        });

        alert("New payment method created successfully!");
        setIsCreatingNew(false);
      } else {
        // UPDATE payment
        if (!paymentId) {
          alert("Payment record not found. Cannot update.");
          setLoading(false);
          return;
        }

        await updatePageSection("PAYMENT", {
          id: paymentId,
          paymentMethod,
          businessNumber,
          paymentAccount,
        });

        alert("Payment details updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save payment details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
        {/* Header + Add New button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-secondary">
            Payment Settings
          </h2>
          <button
            onClick={() => {
              setIsCreatingNew(true);
              setPaymentId(null);
              setPaymentMethod("");
              setBusinessNumber("");
              setPaymentAccount("");
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Add New Payment
          </button>
        </div>

        {/* Form */}
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

        {/* Save / Create button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : isCreatingNew
            ? "Create Payment"
            : "Save Payment Details"}
        </button>
      </div>
    </div>
  );
}
