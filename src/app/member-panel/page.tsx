// src/app/member-panel/page.tsx
"use client";

import { motion } from "framer-motion";
import { FiSmartphone, FiCheckCircle, FiCalendar } from "react-icons/fi";
import Link from "next/link";

export default function MemberPanelPage() {
  return (
    <main className="min-h-screen bg-[#050814] text-white pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0B1220] border border-white/5 rounded-3xl p-8 md:p-12 text-center"
        >
          <div className="w-20 h-20 bg-[#00E6C810] text-[#00E6C8] rounded-full flex items-center justify-center mx-auto mb-8 border border-[#00E6C820]">
            <FiCheckCircle size={40} />
          </div>
          <h1 className="text-4xl font-black mb-4">Member <span className="text-[#00E6C8]">Hub</span></h1>
          <p className="text-gray-400 max-w-lg mx-auto mb-10">We've simplified our system! Your membership is now tracked directly in our verified spreadsheet registry.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
             <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <FiCalendar className="text-[#00E6C8] mb-4" size={24} />
                <h3 className="font-bold mb-2">Instant Activation</h3>
                <p className="text-xs text-gray-500">Payments are logged automatically. No manual activation needed.</p>
             </div>
             <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <FiSmartphone className="text-[#00E6C8] mb-4" size={24} />
                <h3 className="font-bold mb-2">WhatsApp Support</h3>
                <p className="text-xs text-gray-500">Need your expiry date or plan details? Connect with us anytime.</p>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://api.whatsapp.com/send?phone=919472526457" 
              className="px-8 py-4 bg-[#00E6C8] text-black font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#00E6C833]"
            >
              Contact Support
            </a>
            <Link 
              href="/" 
              className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
            >
              Home
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
