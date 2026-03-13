// src/app/pulse-connect/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaUsers, FaTrophy, FaCalendarAlt } from "react-icons/fa";
import { FiPlus, FiX } from "react-icons/fi";
import Link from "next/link";
import { savePost, fetchPosts } from "@/lib/googleSheets";
import FormattedContent from "@/components/FormattedContent";

const ADMIN_EMAILS = ["fitbyckfitness@gmail.com", "therealmayankk@gmail.com", "01priyankk@gmail.com"];

export default function PulseConnectPage() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [instaLink, setInstaLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [instaPosts, setInstaPosts] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("admin_auth");
    if (saved) {
      const { email } = JSON.parse(saved);
      if (ADMIN_EMAILS.includes(email.toLowerCase())) {
        setIsAdmin(true);
      }
    }

    loadInstaPosts();
  }, []);

  const loadInstaPosts = async () => {
    const data = await fetchPosts();
    // Filter posts that are specifically tagged as 'Instagram'
    const igPosts = data.filter((p: any) => p.category === "Instagram");
    setInstaPosts(igPosts.reverse());
  };

  const handleManualAdd = async () => {
    if (!instaLink.includes("instagram.com")) return alert("Please enter a valid Instagram URL");
    
    setSaving(true);
    const saved = localStorage.getItem("admin_auth");
    if (!saved) return;
    const { pass } = JSON.parse(saved);

    const result = await savePost({
      title: "Instagram Highlight",
      slug: `ig-${Date.now()}`,
      category: "Instagram",
      content: instaLink, // Store the link as the content
      published: true
    }, pass);

    if (result.success) {
      setInstaLink("");
      setShowModal(false);
      loadInstaPosts();
    } else {
      alert("Error saving: " + result.error);
    }
    setSaving(false);
  };

  return (
    <main className="min-h-screen bg-[#050814] text-white pt-24 pb-16 px-6 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E6C8] opacity-5 blur-[120px] rounded-full -mr-48 -mt-48"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl font-extrabold mb-6 tracking-tight"
          >
            Pulse<span className="text-[#00E6C8]">Connect</span>
          </motion.h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our gym is more than just machines. Connect with fellow members, share your journey, and thrive together.
          </p>
        </div>

        {/* Dual Instagram Feed Section */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
             <div>
               <h2 className="text-3xl font-bold flex items-center gap-3"><FaInstagram className="text-[#E1306C]" /> The Gram</h2>
               <p className="text-gray-400 mt-2">Latest posts from @ck_fitness22 and community highlights.</p>
             </div>
             {isAdmin && (
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-[#00E6C8] text-black font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                >
                  <FiPlus /> Add Post
                </button>
             )}
          </div>

          {/* Option B: Manual VIP Grid */}
          {instaPosts.length > 0 && (
             <div>
                <h3 className="text-xl font-bold mb-6">Curated Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {instaPosts.map(post => (
                     <div key={post.id} className="bg-[#0B1220] rounded-2xl overflow-hidden border border-white/10 p-4">
                        <FormattedContent content={post.content} />
                     </div>
                  ))}
                </div>
             </div>
          )}
        </div>

        {/* Community Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CommunityCard
            icon={<FaWhatsapp className="text-[#25D366]" />}
            title="Member Support"
            description="Get instant support and connect with gym staff for any queries."
            cta="Join Group"
            link="https://api.whatsapp.com/send?phone=919472526457"
            color="border-[#25D366]/30"
          />
          <CommunityCard
            icon={<FaTrophy className="text-[#FFD700]" />}
            title="Hall of Fame"
            description="Celebrating consistency. New member highlights announced every month."
            cta="See Winners"
            link="#"
            color="border-[#FFD700]/30"
          />
          <CommunityCard
            icon={<FaCalendarAlt className="text-[#3b82f6]" />}
            title="Upcoming Events"
            description="Strength competitions, weekend cardio sessions, and nutrition workshops."
            cta="View Calendar"
            link="#"
            color="border-[#3b82f6]/30"
          />
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-[#0B1220] to-[#0D1726] border border-white/5 text-center shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-4">Want to start a discussion?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            We're building a dedicated member forum. For now, join our WhatsApp group to stay updated!
          </p>
          <a
            href="https://api.whatsapp.com/send?phone=919472526457"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#00E6C8] text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-all"
          >
            <FaWhatsapp className="text-xl" />
            Connect Now
          </a>
        </motion.div>
      </motion.div>

      {/* Editor Modal for Admins */}
      <AnimatePresence>
         {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full max-w-md bg-[#0B1220] border border-white/10 rounded-3xl p-8 shadow-2xl"
               >
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-2xl font-bold">Add Instagram Post</h2>
                     <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-full"><FiX size={24} /></button>
                  </div>
                  <p className="text-gray-400 text-sm mb-6">Paste the link to an Instagram post or reel. It will be embedded directly onto this page.</p>
                  
                  <div className="space-y-4">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Instagram URL</label>
                        <input 
                           type="text" 
                           value={instaLink}
                           onChange={e => setInstaLink(e.target.value)}
                           className="w-full bg-[#050814] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#E1306C] transition-all"
                           placeholder="https://www.instagram.com/p/..."
                        />
                     </div>
                     <button 
                        onClick={handleManualAdd}
                        disabled={saving}
                        className="w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold py-4 rounded-xl hover:scale-[1.02] shadow-xl transition-all"
                     >
                        {saving ? "Publishing..." : "Publish to Grid"}
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </main>
  );
}

function CommunityCard({ icon, title, description, cta, link, color }: any) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`p-8 rounded-2xl bg-[#0B1220] border ${color} shadow-xl flex flex-col items-start gap-4 transition-all`}
    >
      <div className="text-4xl p-3 bg-white/5 rounded-2xl">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      <Link 
        href={link} 
        target="_blank"
        className="mt-4 text-[#00E6C8] font-semibold text-sm flex items-center gap-2 group"
      >
        {cta} <span className="group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </motion.div>
  );
}
