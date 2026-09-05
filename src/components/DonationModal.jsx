import { useState } from "react";
import { 
  FaTimes, 
  FaMobileAlt, 
  FaSpinner, 
  FaCheckCircle, 
  FaTimesCircle,
  FaCreditCard,
  FaUniversity,
  FaArrowLeft,
  FaHeart,
  FaShieldAlt
} from "react-icons/fa";
import { useDonation } from "../hooks/useDonation";
import { isValidKenyanPhone, formatCurrency } from "../services/paymentService";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

// Payment methods - user-friendly names
// M-PESA goes direct, everything else routes to Pesapal
const PAYMENT_METHODS = [
  { 
    id: "mpesa", 
    name: "M-PESA", 
    icon: <FaMobileAlt className="w-6 h-6" />,
    description: "Pay with M-PESA",
    color: "bg-green-600",
    bgLight: "bg-green-50",
    borderColor: "border-green-600",
    textColor: "text-green-600",
    provider: "mpesa" // Direct STK Push
  },
  { 
    id: "card", 
    name: "Visa / Mastercard", 
    icon: <FaCreditCard className="w-6 h-6" />,
    description: "Debit or Credit Card",
    color: "bg-blue-600",
    bgLight: "bg-blue-50",
    borderColor: "border-blue-600",
    textColor: "text-blue-600",
    provider: "pesapal" // Routes to Pesapal
  },
  { 
    id: "airtel", 
    name: "Airtel Money", 
    icon: <FaMobileAlt className="w-6 h-6" />,
    description: "Pay with Airtel Money",
    color: "bg-red-600",
    bgLight: "bg-red-50",
    borderColor: "border-red-600",
    textColor: "text-red-600",
    provider: "pesapal" // Routes to Pesapal
  },
  { 
    id: "bank", 
    name: "Bank Transfer", 
    icon: <FaUniversity className="w-6 h-6" />,
    description: "Direct bank transfer",
    color: "bg-gray-700",
    bgLight: "bg-gray-50",
    borderColor: "border-gray-700",
    textColor: "text-gray-700",
    provider: "pesapal" // Routes to Pesapal
  },
];

export default function DonationModal() {
  const {
    isModalOpen,
    closeDonationModal,
    processDonation,
    isProcessing,
    currentDonation,
    clearCurrentDonation,
  } = useDonation();

  // Steps: select-amount → select-method → mpesa-form OR pesapal-redirect → processing → success/error
  const [step, setStep] = useState("select-amount");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [formData, setFormData] = useState({
    donorName: "",
    phoneNumber: "",
    email: "",
    amount: 1000,
    customAmount: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    closeDonationModal();
    setTimeout(() => {
      setStep("select-amount");
      setSelectedMethod(null);
      setFormData({
        donorName: "",
        phoneNumber: "",
        email: "",
        amount: 1000,
        customAmount: "",
        message: "",
      });
      setErrors({});
      clearCurrentDonation();
    }, 300);
  };

  const getAmount = () => Number(formData.customAmount || formData.amount);

  const handleAmountSelect = (amount) => {
    setFormData({ ...formData, amount, customAmount: "" });
    setErrors({ ...errors, amount: null });
  };

  const handleCustomAmount = (value) => {
    setFormData({ ...formData, customAmount: value, amount: 0 });
    setErrors({ ...errors, amount: null });
  };

  const validateAmount = () => {
    const amount = getAmount();
    if (!amount || amount < 10) {
      setErrors({ ...errors, amount: "Minimum donation is KES 10" });
      return false;
    }
    if (amount > 150000) {
      setErrors({ ...errors, amount: "Maximum single donation is KES 150,000" });
      return false;
    }
    return true;
  };

  const handleContinueToMethod = () => {
    if (validateAmount()) {
      setStep("select-method");
    }
  };

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    if (method.provider === "mpesa") {
      setStep("mpesa-form");
    } else {
      // For Pesapal methods, we can either show a simple form or redirect directly
      setStep("pesapal-form");
    }
  };

  const validateMpesaForm = () => {
    const newErrors = {};
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!isValidKenyanPhone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid Kenyan phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMpesaSubmit = async (e) => {
    e.preventDefault();
    if (!validateMpesaForm()) return;

    setStep("processing");

    const result = await processDonation({
      donorName: formData.donorName || "Anonymous",
      phoneNumber: formData.phoneNumber,
      amount: getAmount(),
      message: formData.message,
    });

    if (result.success) {
      setStep("success");
    } else {
      setStep("error");
    }
  };

  const handlePesapalSubmit = async (e) => {
    e.preventDefault();
    setStep("processing");
    
    try {
      const amount = getAmount();
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9094";
      
      // Call backend to create PesaPal order
      const response = await fetch(`${API_URL}/payments/pesapal/submit-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          description: `Donation to Brighter Together Foundation`,
          email: formData.email || '',
          firstName: formData.donorName ? formData.donorName.split(' ')[0] : 'Anonymous',
          lastName: formData.donorName ? formData.donorName.split(' ').slice(1).join(' ') || 'Donor' : 'Donor',
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.redirectUrl) {
        // Redirect to PesaPal payment page
        window.location.href = data.redirectUrl;
      } else {
        throw new Error(data.message || 'Failed to create payment');
      }
    } catch (error) {
      console.error('PesaPal error:', error);
      setStep("error");
    }
  };

  const goBack = () => {
    if (step === "select-method") setStep("select-amount");
    else if (step === "mpesa-form" || step === "pesapal-form") setStep("select-method");
    else if (step === "error") setStep("mpesa-form");
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
        style={{ animation: "scaleIn 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {(step !== "select-amount" && step !== "success" && step !== "pesapal-success") && (
                <button
                  onClick={goBack}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <h2 className="text-lg font-bold">
                  {step === "select-amount" && "Support Our Children"}
                  {step === "select-method" && "Choose Payment Method"}
                  {step === "mpesa-form" && "M-PESA Payment"}
                  {step === "pesapal-form" && `Pay with ${selectedMethod?.name}`}
                  {step === "processing" && "Processing..."}
                  {step === "success" && "Thank You!"}
                  {step === "pesapal-success" && "Almost Done!"}
                  {step === "error" && "Payment Issue"}
                </h2>
                {step === "select-amount" && (
                  <p className="text-green-100 text-sm">Every donation makes a difference</p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          
          {/* Step 1: Select Amount */}
          {step === "select-amount" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  How much would you like to donate?
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleAmountSelect(amt)}
                      className={`py-3 px-3 rounded-xl font-bold text-sm transition-all ${
                        formData.amount === amt && !formData.customAmount
                          ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      KES {amt.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">KES</span>
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={formData.customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    className="w-full pl-14 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none transition-all"
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-2">{errors.amount}</p>
                )}
              </div>

              {/* Impact Preview */}
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Your impact:</span> KES {getAmount().toLocaleString()} can help provide 
                  {getAmount() >= 5000 ? " education and healthcare" : getAmount() >= 2000 ? " school supplies" : " meals"} for children in need.
                </p>
              </div>

              <button
                onClick={handleContinueToMethod}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30"
              >
                <FaHeart className="w-4 h-4" />
                Continue - {formatCurrency(getAmount())}
              </button>
            </div>
          )}

          {/* Step 2: Select Payment Method */}
          {step === "select-method" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Donating <span className="font-bold text-green-600">{formatCurrency(getAmount())}</span>
              </p>
              
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleSelectMethod(method)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-left`}
                  >
                    <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center text-white`}>
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{method.name}</div>
                      <div className="text-sm text-gray-500">{method.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mt-4">
                <FaShieldAlt className="w-4 h-4" />
                <span>All payments are secure and encrypted</span>
              </div>
            </div>
          )}

          {/* Step 3a: M-PESA Form */}
          {step === "mpesa-form" && (
            <form onSubmit={handleMpesaSubmit} className="space-y-5">
              <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                  <FaMobileAlt className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">M-PESA Payment</div>
                  <div className="text-sm text-gray-600">{formatCurrency(getAmount())}</div>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-PESA Phone Number *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium">
                    +254
                  </span>
                  <input
                    type="tel"
                    placeholder="712345678"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 9);
                      setFormData({ ...formData, phoneNumber: value });
                      setErrors({ ...errors, phoneNumber: null });
                    }}
                    className="flex-1 px-4 py-3 rounded-r-xl border-2 border-gray-200 focus:border-green-500 outline-none transition-all"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Donor Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.donorName}
                  onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaMobileAlt className="w-4 h-4" />
                Pay {formatCurrency(getAmount())} via M-PESA
              </button>

              <p className="text-center text-gray-500 text-xs">
                You will receive an M-PESA prompt on your phone
              </p>
            </form>
          )}

          {/* Step 3b: Pesapal Form (Card, Airtel, Bank) */}
          {step === "pesapal-form" && selectedMethod && (
            <form onSubmit={handlePesapalSubmit} className="space-y-5">
              <div className={`${selectedMethod.bgLight} rounded-xl p-4 flex items-center gap-3`}>
                <div className={`w-10 h-10 ${selectedMethod.color} rounded-full flex items-center justify-center text-white`}>
                  {selectedMethod.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{selectedMethod.name}</div>
                  <div className="text-sm text-gray-600">{formatCurrency(getAmount())}</div>
                </div>
              </div>

              {/* Donor Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.donorName}
                  onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional - for receipt)
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className={`w-full ${selectedMethod.color} text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all`}
              >
                {selectedMethod.icon}
                Continue to Payment
              </button>

              <p className="text-center text-gray-500 text-xs">
                You'll be redirected to complete your payment securely
              </p>
            </form>
          )}

          {/* Step: Processing (M-PESA) */}
          {step === "processing" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSpinner className="w-10 h-10 text-green-600 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Check Your Phone
              </h3>
              <p className="text-gray-600 mb-6">
                An M-PESA payment prompt has been sent.
                <br />
                <span className="font-medium">Enter your PIN to complete.</span>
              </p>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(currentDonation?.amount || getAmount())}
                </p>
              </div>
            </div>
          )}

          {/* Step: Success (M-PESA) */}
          {step === "success" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Payment Initiated!
              </h3>
              <p className="text-gray-600 mb-6">
                Please complete the payment on your phone.
                <br />
                <span className="text-green-600 font-medium">Thank you for your kindness!</span>
              </p>
              {currentDonation?.id && (
                <div className="bg-green-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-green-700">
                    Reference: <span className="font-mono font-bold">{currentDonation.id}</span>
                  </p>
                </div>
              )}
              <button
                onClick={handleClose}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* Step: Pesapal Success */}
          {step === "pesapal-success" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Complete Your Payment
              </h3>
              <p className="text-gray-600 mb-6">
                A new window has opened to complete your payment.
                <br />
                <span className="font-medium">Follow the instructions there.</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                If the window didn't open, 
                <button 
                  onClick={() => handlePesapalSubmit({ preventDefault: () => {} })}
                  className="text-blue-600 font-medium hover:underline ml-1"
                >
                  click here
                </button>
              </p>
              <button
                onClick={handleClose}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* Step: Error */}
          {step === "error" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTimesCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Payment Failed
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't process your payment.
                <br />
                Please try again or choose a different method.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setStep("mpesa-form")}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setStep("select-method")}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Other Method
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
