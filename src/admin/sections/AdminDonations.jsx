import { useEffect, useState } from "react";
import { fetchPageSection, updatePageSection } from "../../api/pageApi";
import EditableSection from "../components/EditableSection";
import { FaHeart, FaMobileAlt, FaCreditCard, FaShieldAlt, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import donateImage from "../../assets/children14.jpeg";

const impactItems = [
  { amount: "KES 500", impact: "Provides meals for a child for a week" },
  { amount: "KES 2,000", impact: "Covers school supplies for a term" },
  { amount: "KES 5,000", impact: "Funds healthcare checkup and medicine" },
  { amount: "KES 10,000", impact: "Supports a child's education for a month" },
];

const paymentOptions = [
  { icon: <FaMobileAlt className="w-4 h-4" />, name: "M-PESA" },
  { icon: <FaCreditCard className="w-4 h-4" />, name: "Visa/Mastercard" },
  { icon: <FaMobileAlt className="w-4 h-4" />, name: "Airtel Money" },
];

export default function AdminDonations({ isEditing, onEdit, onClose }) {
  const [payment, setPayment] = useState({
    id: null,
    businessNumber: "",
    paymentAccount: "",
  });
  const [editData, setEditData] = useState({ ...payment });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadPayment() {
      try {
        const res = await fetchPageSection("PAYMENT");
        const item = res?.result?.[0] || null;
        if (item) {
          const data = {
            id: item.id,
            businessNumber: item.businessNumber || "",
            paymentAccount: item.paymentAccount || "",
          };
          setPayment(data);
          setEditData(data);
        }
      } catch (err) {
        console.error("Failed to load payment info", err);
      } finally {
        setLoading(false);
      }
    }
    loadPayment();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePageSection("PAYMENT", {
        ...editData,
        typeToCreate: "PAYMENT",
      });
      setPayment(editData);
      onClose();
    } catch (err) {
      console.error("Failed to save", err);
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(payment);
    onClose();
  };

  const displayData = isEditing ? editData : payment;

  return (
    <EditableSection
      isEditing={isEditing}
      onEdit={onEdit}
      onClose={handleCancel}
      onSave={handleSave}
      title="Donations Section"
      saving={saving}
    >
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FaHeart className="w-3 h-3" />
              Make a Difference
            </div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Your Donation Changes Lives
            </h2>
            <p className="text-gray-600 text-lg">
              Every contribution helps provide essential services and support to the children in our care.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Image & Impact */}
            <div className="space-y-8">
              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={donateImage}
                  alt="Children we support"
                  className="w-full h-[300px] md:h-[350px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white/90 text-sm mb-2">Together we've helped</p>
                  <div className="text-3xl font-bold text-white">150+ Children</div>
                </div>
              </div>

              {/* Impact Cards */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Your Impact</h3>
                <div className="space-y-3">
                  {impactItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-20 text-green-600 font-bold text-sm">{item.amount}</div>
                      <div className="flex-1 text-gray-600 text-sm">{item.impact}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Donation CTA */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-gray-100">
              {/* Heading */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHeart className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Donate Today</h3>
                <p className="text-gray-600">
                  Choose your preferred payment method and make a secure donation
                </p>
              </div>

              {/* Payment Options Preview */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {paymentOptions.map((option, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full text-sm text-gray-600"
                  >
                    {option.icon}
                    <span>{option.name}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button className="w-full group flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300">
                <FaHeart className="group-hover:scale-110 transition-transform" />
                <span>Donate Now</span>
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-green-500" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    <span>100% to Children</span>
                  </div>
                </div>
              </div>

              {/* Editable Manual Payment Info */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 text-center mb-3">Or pay directly via M-PESA Paybill:</p>
                
                {isEditing ? (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Paybill Number</label>
                      <input
                        type="text"
                        value={editData.businessNumber}
                        onChange={(e) => setEditData({ ...editData, businessNumber: e.target.value })}
                        className="w-full border-2 border-green-500 rounded-lg px-3 py-2"
                        placeholder="e.g., 247247"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={editData.paymentAccount}
                        onChange={(e) => setEditData({ ...editData, paymentAccount: e.target.value })}
                        className="w-full border-2 border-green-500 rounded-lg px-3 py-2"
                        placeholder="e.g., 123456"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Paybill:</span>
                      <span className="font-bold text-gray-900">{displayData.businessNumber || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Account:</span>
                      <span className="font-bold text-gray-900">{displayData.paymentAccount || "—"}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
