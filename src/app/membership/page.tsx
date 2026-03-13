// src/app/membership/page.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import { useState } from "react";
import { FiX, FiCheckCircle, FiArrowRight, FiSmartphone, FiMail, FiUser, FiCalendar, FiCreditCard } from "react-icons/fi";
import { logMember, logAnalytics } from "@/lib/googleSheets";

export default function MembershipPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const plans = [
    {
      name: "Fitness Base",
      priceRegular: "₹600/-",
      priceEarly: "₹500/-",
      amount: 500,
      discount: "16% OFF",
      combo: "3-Month Combo Available",
      features: [
        "Weight Training Access",
        "Strength Machines",
        "Free BMI Check",
        "Beginner Workout Chart (PDF)",
        "Basic Form Correction",
        "Access During All Working Hours",
      ],
      highlight: false,
      comboNote: "Special Discount on Visit",
    },
    {
      name: "Fitness Plus (with Cardio)",
      priceRegular: "₹1200/-",
      priceEarly: "₹1000/-",
      amount: 1000,
      discount: "16% OFF",
      combo: "3-Month Combo Available",
      features: [
        "Everything in Fitness Base",
        "Unlimited Cardio Access",
        "Treadmill & Spin Bike",
        "Stairmill & Cross Trainer",
        "Personalized Cardio Recommendation",
        "General Diet Tips",
      ],
      highlight: true,
      comboNote: "Special Discount on Visit",
    },
  ];

  const faqs = [
    {
      q: "Are the combo offers available online?",
      a: "No, to grab our special 3-month combos at discounted prices, please visit the gym in person."
    },
    {
      q: "What facilities are included?",
      a: "We provide a fully air-conditioned (cooling) environment, free high-speed WiFi for your workout playlists, and access to all standard equipment based on your plan."
    },
    {
      q: "Is there a refund policy?",
      a: "No. Once a membership is purchased, there are absolutely no refunds and no extensions provided for missed days."
    },
    {
      q: "Can I upgrade my plan later?",
      a: "Yes, you can upgrade from Base to Plus anytime by paying the differential amount at our front desk."
    }
  ];

  const calculateExpiry = (planName: string) => {
    const isCombo = planName.toLowerCase().includes("combo");
    const days = isCombo ? 90 : 30;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleOpenForm = (plan: any) => {
    setSelectedPlan(plan);
    setShowForm(true);
    // Track click
    logAnalytics("click", `Opened Checkout: ${plan.name}`);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return alert("Please fill all fields");
    
    setLoadingPlan(selectedPlan.name);
    logAnalytics("click", `Initiated Payment: ${selectedPlan.name}`);

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        body: JSON.stringify({ amount: selectedPlan.amount }),
      });
      const order = await res.json();

      if (!order.id) {
        throw new Error("Order creation failed");
      }

      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "CK FITNESS",
        description: `${selectedPlan.name} Plan`,
        order_id: order.id,
        handler: async function (response: any) {
          
          const isCombo = selectedPlan.name.toLowerCase().includes("combo");
          const days = isCombo ? 90 : 30;
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + days);

          await logMember({
             ...formData,
             plan: selectedPlan.name,
             amount: selectedPlan.amount,
             expiryDate: expiryDate.toISOString(),
             paymentId: response.razorpay_payment_id
          });
          
          logAnalytics("click", `Successful Purchase: ${selectedPlan.name}`);
          setPurchaseSuccess(true);
          setShowForm(false);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: "#00E6C8" },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment initiation failed. Contact support on WhatsApp.");
      console.error(err);
    } finally {
      setLoadingPlan(null);
    }
  };

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <main className="min-h-screen bg-[#050814] text-white pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-extrabold mb-4">Choose Your <span className="text-[#00E6C8]">Plan</span></h1>
            <p className="text-gray-400 max-w-2xl mx-auto">No complex registration. Just pick your plan, fill your basic details, and start your transformation journey today.</p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className={`p-8 rounded-3xl bg-[#0B1220] border ${plan.highlight ? "border-[#00E6C8] shadow-[0_0_40px_rgba(0,230,200,0.1)]" : "border-white/5"} relative flex flex-col`}
              >
                {plan.highlight && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00E6C8] text-black text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl">MOST POPULAR</span>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-black text-[#00E6C8]">{plan.priceEarly}</span>
                  <span className="text-gray-500 line-through text-sm">{plan.priceRegular}</span>
                  <span className="text-[#00E6C8] text-xs font-bold bg-[#00E6C810] px-2 py-1 rounded">{plan.discount}</span>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-3 text-sm text-gray-300">
                      <FiCheckCircle className="text-[#00E6C8] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleOpenForm(plan)}
                  className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${plan.highlight ? "bg-[#00E6C8] text-black hover:scale-[1.02]" : "bg-white/5 hover:bg-white/10"}`}
                >
                  Join Now <FiArrowRight />
                </button>
                <p className="text-[10px] text-gray-500 mt-4 text-center uppercase tracking-widest">{plan.combo}</p>
              </motion.div>
            ))}
          </div>

          {/* FAQs Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mt-32"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400">Everything you need to know about CK Fitness memberships.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-[#0B1220] border border-white/5 p-6 rounded-2xl">
                  <h3 className="font-bold text-lg mb-2 text-white">{faq.q}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* MODAL FORM */}
        <AnimatePresence>
          {showForm && selectedPlan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-lg bg-[#0B1220] border border-white/5 rounded-3xl p-8 shadow-2xl my-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Checkout Details</h2>
                  <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><FiX size={24} /></button>
                </div>

                {/* Purchase Summary */}
                <div className="bg-[#050814] p-5 rounded-2xl mb-8 border border-white/5">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                    <span className="text-gray-400 text-sm">Selected Plan</span>
                    <span className="font-bold text-[#00E6C8]">{selectedPlan.name}</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400 flex items-center gap-2"><FiCalendar /> Start Date</span>
                      <span className="font-medium text-white">{today}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 flex items-center gap-2"><FiCalendar /> Expiry Date</span>
                      <span className="font-medium text-white">{calculateExpiry(selectedPlan.name)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-white/5 mt-3">
                      <span className="text-gray-400 flex items-center gap-2"><FiCreditCard /> Total Amount</span>
                      <span className="font-bold text-xl text-white">{selectedPlan.priceEarly}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCheckout} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Your Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="text" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#050814] border border-white/10 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#00E6C8] transition-all" 
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="email" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-[#050814] border border-white/10 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#00E6C8] transition-all" 
                        placeholder="johndoe@gmail.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">WhatsApp / Phone Number</label>
                    <div className="relative">
                      <FiSmartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="tel" 
                        required 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-[#050814] border border-white/10 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#00E6C8] transition-all" 
                        placeholder="+91 91234 56789"
                      />
                    </div>
                  </div>

                  {/* Strict Policy Notice */}
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs text-red-200 leading-relaxed">
                    <strong>Strict Policy:</strong> There will be absolutely <span className="text-red-400 font-bold">no refunds</span> and <span className="text-red-400 font-bold">no extensions</span> provided for days you do not attend the gym. By proceeding, you agree to these terms.
                  </div>

                  <button 
                    type="submit" 
                    disabled={!!loadingPlan}
                    className="w-full bg-[#00E6C8] text-black font-black py-4 rounded-xl hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#00E6C833] transition-all flex items-center justify-center gap-2"
                  >
                    {loadingPlan ? "Initiating Secure Payment..." : `Proceed to Pay ${selectedPlan?.priceEarly}`}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* SUCCESS MESSAGE */}
        <AnimatePresence>
          {purchaseSuccess && (
             <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/95">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center max-w-sm"
                >
                  <div className="w-24 h-24 bg-[#00E6C810] text-[#00E6C8] rounded-full flex items-center justify-center mx-auto mb-8 border border-[#00E6C820]">
                    <FiCheckCircle size={48} />
                  </div>
                  <h2 className="text-4xl font-black mb-4">Welcome to the <span className="text-[#00E6C8]">Pulse!</span></h2>
                  <p className="text-gray-400 leading-relaxed mb-8">Your membership is secured. A team member will reach out on WhatsApp within 24 hours to guide you further. Let's build your legacy!</p>
                  <button onClick={() => setPurchaseSuccess(false)} className="w-full border border-white/10 py-4 rounded-xl font-bold hover:bg-white/5 transition-all">Close</button>
                </motion.div>
             </div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
