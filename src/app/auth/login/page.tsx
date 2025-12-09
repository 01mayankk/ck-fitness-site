"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // if you ever redirect with ?from=signup, we can show a message
  const fromSignup = params?.get("from") === "signup";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message || "Invalid credentials. Please try again.");
      return;
    }

    router.push("/member-panel");
  };

  return (
    <main className="min-h-screen bg-[#050814] text-white flex items-center justify-center px-4 pt-24 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-lg bg-[#0B1220] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40"
      >
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
        <p className="text-gray-300 text-center mb-6">
          Log in to access your{" "}
          <span className="font-semibold text-[#00E6C8]">
            CK Fitness Member Panel
          </span>
          .
        </p>

        {fromSignup && (
          <p className="text-sm text-emerald-300 bg-emerald-900/20 border border-emerald-700/40 rounded-md px-3 py-2 mb-4 text-center">
            Account created successfully. Please log in to continue.
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-[#020617] border border-white/15 px-3 py-2 text-sm focus:outline-none focus:border-[#00E6C8]"
              placeholder="Your password"
            />
          </div>

          {/* Errors */}
          {errorMsg && (
            <p className="text-sm text-red-400 bg-red-900/20 border border-red-700/40 rounded-md px-3 py-2">
              {errorMsg}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-md font-semibold text-black bg-gradient-to-r from-[#00C2A8] to-[#00E6C8] hover:shadow-lg hover:shadow-[#00E6C8aa] hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-4">
          Don&apos;t have an account yet?{" "}
          <Link href="/auth/signup" className="text-[#00E6C8] hover:underline">
            Join now
          </Link>
        </p>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#050814] text-white flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-lg bg-[#0B1220] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
          <p className="text-gray-400 text-center">Loading...</p>
        </div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
