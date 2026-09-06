import { useEffect, useState } from "react";
import { fetchPageSection, updatePageSection, createPageSection } from "../api/pageApi";
import { useDonation } from "../hooks/useDonation";
import { useAdmin } from "../context/AdminContext";
import EditTag from "../admin/components/EditTag";
import InlineEditModal from "../admin/components/InlineEditModal";
import DonationModal from "../components/DonationModal";
import { FaHeart, FaMobileAlt, FaCreditCard, FaShieldAlt, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import donateImage from "../assets/children14.jpeg";

const defaultImpactItems = [
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

const donationImpactEditFields = [
  { name: "donationTier1Amount", label: "Tier 1 Amount", type: "text", placeholder: "KES 500" },
  { name: "donationTier1Description", label: "Tier 1 Description", type: "text", placeholder: "Provides meals for a child for a week" },
  { name: "donationTier2Amount", label: "Tier 2 Amount", type: "text", placeholder: "KES 2,000" },
  { name: "donationTier2Description", label: "Tier 2 Description", type: "text", placeholder: "Covers school supplies for a term" },
  { name: "donationTier3Amount", label: "Tier 3 Amount", type: "text", placeholder: "KES 5,000" },
  { name: "donationTier3Description", label: "Tier 3 Description", type: "text", placeholder: "Funds healthcare checkup and medicine" },
  { name: "donationTier4Amount", label: "Tier 4 Amount", type: "text", placeholder: "KES 10,000" },
  { name: "donationTier4Description", label: "Tier 4 Description", type: "text", placeholder: "Supports a child's education for a month" },
];

export default function Donations() {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const { openDonationModal } = useDonation();
  const { isAdminMode } = useAdmin();

  const [donationImpact, setDonationImpact] = useState({
    id: null,
    donationTier1Amount: "KES 500",
    donationTier1Description: "Provides meals for a child for a week",
    donationTier2Amount: "KES 2,000",
    donationTier2Description: "Covers school supplies for a term",
    donationTier3Amount: "KES 5,000",
    donationTier3Description: "Funds healthcare checkup and medicine",
    donationTier4Amount: "KES 10,000",
    donationTier4Description: "Supports a child's education for a month",
  });

  // Build impact items from data
  const impactItems = [
    { amount: donationImpact.donationTier1Amount, impact: donationImpact.donationTier1Description },
    { amount: donationImpact.donationTier2Amount, impact: donationImpact.donationTier2Description },
    { amount: donationImpact.donationTier3Amount, impact: donationImpact.donationTier3Description },
    { amount: donationImpact.donationTier4Amount, impact: donationImpact.donationTier4Description },
  ];

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        // Load payment info
        const paymentRes = await fetchPageSection("PAYMENT");
        const paymentItem = paymentRes?.result?.[0] || null;
        if (!cancelled) setPayment(paymentItem);

        // Load donation impact tiers
        const impactRes = await fetchPageSection("DONATION_IMPACT");
        const impactItem = impactRes?.result?.[0];
        if (!cancelled && impactItem) {
          setDonationImpact({
            id: impactItem.id,
            donationTier1Amount: impactItem.donationTier1Amount || donationImpact.donationTier1Amount,
            donationTier1Description: impactItem.donationTier1Description || donationImpact.donationTier1Description,
            donationTier2Amount: impactItem.donationTier2Amount || donationImpact.donationTier2Amount,
            donationTier2Description: impactItem.donationTier2Description || donationImpact.donationTier2Description,
            donationTier3Amount: impactItem.donationTier3Amount || donationImpact.donationTier3Amount,
            donationTier3Description: impactItem.donationTier3Description || donationImpact.donationTier3Description,
            donationTier4Amount: impactItem.donationTier4Amount || donationImpact.donationTier4Amount,
            donationTier4Description: impactItem.donationTier4Description || donationImpact.donationTier4Description,
          });
        }
      } catch (err) {
        if (!cancelled) console.error("Failed to load data", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, []);

  const handleSaveDonationImpact = async (data) => {
    if (donationImpact.id) {
      await updatePageSection("DONATION_IMPACT", { id: donationImpact.id, ...data });
    } else {
      await createPageSection("DONATION_IMPACT", data);
    }
    setDonationImpact({ ...donationImpact, ...data });
  };

  return (
    <section id="donate" className="py-20 bg-gradient-to-b from-white to-gray-50">
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
              
              {/* Overlay Text */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white/90 text-sm mb-2">Together we've helped</p>
                <div className="text-3xl font-bold text-white">150+ Children</div>
              </div>
            </div>

            {/* Impact Cards */}
            <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              {/* Donation Impact Edit Tag */}
              {isAdminMode && (
                <div className="absolute -top-2 -right-2 z-10">
                  <EditTag sectionId="donationImpact" label="Impact" />
                </div>
              )}
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
            <button
              onClick={openDonationModal}
              className="w-full group flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300"
            >
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

            {/* Manual Payment Info */}
            {!loading && payment && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 text-center mb-3">Or pay directly via M-PESA Paybill:</p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Paybill:</span>
                    <span className="font-bold text-gray-900">{payment?.businessNumber || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account:</span>
                    <span className="font-bold text-gray-900">{payment?.paymentAccount || "—"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal />

      {/* Inline Edit Modal for Donation Impact */}
      <InlineEditModal
        sectionId="donationImpact"
        title="Donation Impact Tiers"
        fields={donationImpactEditFields}
        initialData={donationImpact}
        onSave={handleSaveDonationImpact}
      />
    </section>
  );
}
