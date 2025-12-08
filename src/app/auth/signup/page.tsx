"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password || !fullName || !phone) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password should be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message || "Something went wrong. Please try again.");
      return;
    }

    // Supabase may or may not require email confirmation depending on settings
    if (data.user && data.session) {
      setSuccessMsg("Account created successfully! Redirecting to Member Panel…");
      setTimeout(() => router.push("/member-panel"), 1200);
    } else {
      setSuccessMsg(
        "Signup successful! Please check your email inbox to confirm your account."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#050814] text-white flex items-center justify-center px-4 pt-24 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-lg bg-[#0B1220] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40"
      >
        <h1 className="text-3xl font-bold mb-2 text-center">Join CK Fitness</h1>
        <p className="text-gray-300 text-center mb-6">
          Create your account to access the{" "}
          <span className="font-semibold text-[#00E6C8]">
            CK Fitness Member Panel
          </span>
          .
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-md bg-[#020617] border border-white/15 px-3 py-2 text-sm focus:outline-none focus:border-[#00E6C8]"
              placeholder="Your full name"
            />
          </div>

          {/* Phone / WhatsApp */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Phone / WhatsApp <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md bg-[#020617] border border-white/15 px-3 py-2 text-sm focus:outline-none focus:border-[#00E6C8]"
              placeholder="+91 9XXXXXXXXX"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-[#020617] border border-white/15 px-3 py-2 text-sm focus:outline-none focus:border-[#00E6C8]"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md bg-[#020617] border border-white/15 px-3 py-2 text-sm focus:outline-none focus:border-[#00E6C8]"
                placeholder="Create a strong password"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md bg-[#020617] border border-white/15 px-3 py-2 text-sm focus:outline-none focus:border-[#00E6C8]"
                placeholder="Re-enter password"
              />
            </div>
          </div>

          {/* Error / Success Messages */}
          {errorMsg && (
            <p className="text-sm text-red-400 bg-red-900/20 border border-red-700/40 rounded-md px-3 py-2">
              {errorMsg}
            </p>
          )}
          {successMsg && (
            <p className="text-sm text-emerald-300 bg-emerald-900/20 border border-emerald-700/40 rounded-md px-3 py-2">
              {successMsg}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-md font-semibold text-black bg-gradient-to-r from-[#00C2A8] to-[#00E6C8] hover:shadow-lg hover:shadow-[#00E6C8aa] hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#00E6C8] hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
