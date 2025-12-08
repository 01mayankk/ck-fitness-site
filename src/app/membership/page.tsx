"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MembershipPage() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // -------------------------------
  //  PAY NOW → Razorpay Checkout
  // -------------------------------
  const handleBuyPlan = async (planName: string, amount: number) => {
    setLoadingPlan(planName);

    // 1️⃣ Create order on server
    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });

    const order = await res.json();

    if (!order.id) {
      alert("Payment error. Try again.");
      setLoadingPlan(null);
      return;
    }

    // 2️⃣ Razorpay checkout options
    const options: any = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "CK FITNESS",
      description: `${planName} Plan`,
      order_id: order.id,

      handler: async function (response: any) {
        // 3️⃣ Payment successful → activate membership
        await fetch("/api/activate-membership", {
          method: "POST",
          body: JSON.stringify({
            plan: planName,
            payment_id: response.razorpay_payment_id,
          }),
        });

        router.push("/member-panel");
      },

      theme: { color: "#00E6C8" },
    };

    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();

    setLoadingPlan(null);
  };

  // -------------------------------
  //  PLANS DATA
  // -------------------------------
  const plans = [
    {
      name: "Standard Fitness",
      priceRegular: "₹649/-",
      priceEarly: "₹599/-",
      amount: 599, // ₹599 actual amount for Razorpay
      discount: "8% OFF",
      combo: "₹569 × 3/- (12% OFF)",
      features: [
        "Weight Training Access",
        "Strength Machines",
        "Free BMI Check",
        "Beginner Workout Chart (PDF)",
        "Basic Form Correction",
        "Fitness Goal Suggestion",
        "Access During All Working Hours",
      ],
      highlight: false,
    },
    {
      name: "Standard Plus (with Cardio)",
      priceRegular: "₹799/-",
      priceEarly: "₹699/-",
      amount: 699,
      discount: "12% OFF",
      combo: "₹679 × 3/- (15% OFF)",
      features: [
        "Everything in Standard Fitness",
        "Treadmill Access",
        "Stairmill Access",
        "Cross Trainer",
        "Spin Bike",
        "Calorie Burn Chart",
        "General Diet Tips",
        "Personalized Cardio Recommendation",
      ],
      highlight: false,
    },
    {
      name: "Premium Fitness",
      priceRegular: "₹999/-",
      priceEarly: "₹899/-",
      amount: 899,
      discount: "10% OFF",
      combo: "₹879 × 3/- (12% OFF)",
      features: [
        "Everything in Standard Plus",
        "Personalized Workout Guidance",
        "Monthly Transformation Tracking",
        "Body Fat Estimation (Manual)",
        "Detailed Diet Suggestion",
        "Goal-Based Workout Plan (PDF)",
        "1 Free PT Session per Month",
        "Weekly Posture & Form Correction",
      ],
      highlight: false,
    },
    {
      name: "Premium Plus (Cardio + Premium)",
      priceRegular: "₹1199/-",
      priceEarly: "₹999/-",
      amount: 999,
      discount: "18% OFF",
      combo: "₹1029 × 3/- (14% OFF)",
      features: [
        "Everything in Premium Fitness",
        "Unlimited Cardio Access",
        "Custom Weight Loss / Gain Program",
        "Full Body Transformation Roadmap",
        "Monthly Fitness Score Report",
        "WhatsApp Fitness Guidance (Included)",
      ],
      highlight: true,
    },
  ];

  return (
    <>
      {/* Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <main className="min-h-screen bg-[#0A0F1F] text-white pt-10 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold text-center mb-10"
        >
          Membership Plans
        </motion.h1>

        <div
          className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-4
          gap-8
          max-w-7xl mx-auto
        "
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`
              rounded-xl p-6 pt-10 
              shadow-lg border border-white/10 
              bg-[#111827] 
              transition-all duration-300 ease-out
              hover:scale-[1.05] hover:-translate-y-2 
              hover:shadow-2xl hover:shadow-[#00C2A855]
              relative
              ${plan.highlight ? "ring-2 ring-[#00C2A8] scale-[1.02]" : ""}
            `}
            >
              {/* Highlight Badge */}
              {plan.highlight && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute -top-3 right-4 bg-[#00C2A8] text-black text-xs font-bold px-3 py-1 rounded-full shadow-md"
                >
                  MOST POPULAR
                </motion.div>
              )}

              <h2 className="text-xl font-bold mb-4 leading-tight">{plan.name}</h2>

              <p className="text-gray-300 text-sm">
                Regular: <span className="line-through">{plan.priceRegular}</span>
              </p>

              <p className="text-[#28ffd3] font-extrabold text-3xl mt-1 flex items-center gap-2">
                <span className="text-lg font-semibold text-[#5fffe2]">
                  Early Bird:
                </span>
                {plan.priceEarly}
                <span className="text-[#00E6C8] text-sm font-bold">
                  ({plan.discount})
                </span>
              </p>

              <p className="text-[#9ddae0] text-sm mt-2">
                Combo: <span className="font-semibold">{plan.combo}</span>
              </p>

              <ul className="mt-4 space-y-2 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#00C2A8]">✔</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* BUY NOW BUTTON */}
              <button
                onClick={() => handleBuyPlan(plan.name, plan.amount)}
                className="
                block w-full mt-6
                bg-gradient-to-r from-[#00C2A8] to-[#00E6C8] 
                text-black font-bold py-2 rounded 
                hover:scale-[1.03]
                shadow-md shadow-[#00C2A855]
                hover:shadow-xl hover:shadow-[#00E6C8aa]
                transition-all text-center
              "
              >
                {loadingPlan === plan.name ? "Processing..." : "Buy Now"}
              </button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-10 pb-10">
          *Early bird prices valid for limited time only.
        </p>
      </main>
    </>
  );
}
