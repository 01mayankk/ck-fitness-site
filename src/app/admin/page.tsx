// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiLogOut, FiCheck, FiX, FiInfo, FiActivity, FiEye, FiMousePointer } from "react-icons/fi";
import { fetchPosts, savePost, getAnalytics } from "@/lib/googleSheets";

const ADMIN_EMAILS = ["fitbyckfitness@gmail.com", "therealmayankk@gmail.com", "01priyankk@gmail.com"];
const ADMIN_PASSWORD = "PrinceThakur1208@";

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  
  const [activeTab, setActiveTab] = useState<"stories" | "analytics">("stories");

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [analytics, setAnalytics] = useState({ totalViews: 0, totalClicks: 0, recentViews: 0 });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    if (ADMIN_EMAILS.includes(cleanEmail) && cleanPass === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      localStorage.setItem("admin_auth", JSON.stringify({ email: cleanEmail, pass: cleanPass }));
      loadData(cleanPass);
    } else {
      alert("Invalid Email or Password");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("admin_auth");
    if (saved) {
      const { email: e, pass: p } = JSON.parse(saved);
      if (ADMIN_EMAILS.includes(e.toLowerCase()) && p === ADMIN_PASSWORD) {
        setEmail(e);
        setPass(p);
        setIsAuthorized(true);
        loadData(p);
      }
    }
  }, []);

  const loadData = async (password: string = ADMIN_PASSWORD) => {
    setLoading(true);
    setAnalyticsLoading(true);
    
    // Load Posts
    const data = await fetchPosts();
    setPosts(data || []);
    setLoading(false);

    // Load Analytics
    const stats = await getAnalytics(password);
    setAnalytics(stats);
    setAnalyticsLoading(false);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#050814] flex items-center justify-center p-6 text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#0B1220] p-8 rounded-3xl border border-white/5 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Admin Portal</h2>
            <p className="text-gray-400 mt-2">Sign in to manage CK Fitness content</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Admin Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#050814] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00E6C8] transition-all"
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Security Password</label>
              <input 
                type="password" 
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full bg-[#050814] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00E6C8] transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-[#00E6C8] text-black font-bold py-4 rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-[#00E6C833]"
            >
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050814] text-white pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <h1 className="text-4xl font-bold">Admin Board</h1>
               <span className="bg-[#00E6C810] text-[#00E6C8] text-[10px] font-bold px-2 py-1 rounded border border-[#00E6C820]">SHEETS SYNC</span>
            </div>
            <p className="text-gray-400">Content and analytics managed via Google Sheets backend.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
                onClick={() => { localStorage.removeItem("admin_auth"); setIsAuthorized(false); }}
                className="p-3 bg-white/5 rounded-xl hover:bg-red-500 hover:text-white transition-all text-gray-400"
            >
                <FiLogOut />
            </button>
          </div>
        </header>

        {/* TABS */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab("stories")}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "stories" ? "bg-[#00E6C8] text-black" : "bg-white/5 text-gray-400 hover:text-white"}`}
          >
            Manage Stories
          </button>
          <button 
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === "analytics" ? "bg-[#00E6C8] text-black" : "bg-white/5 text-gray-400 hover:text-white"}`}
          >
            <FiActivity /> Live Analytics
          </button>
        </div>

        {/* CONTENT */}
        {activeTab === "stories" && (
           <div className="grid gap-4">
              <div className="bg-[#0B1220] border border-[#00E6C8]/30 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                 <div>
                    <h3 className="font-bold text-lg text-[#00E6C8]">On-Page Creation Active 🚀</h3>
                    <p className="text-sm text-gray-400 mt-1">To make posting easier, you can now create and edit stories directly on the <a href="/fit-talks" className="text-white underline">FitTalks</a> page just like a normal user. No need to use the admin board!</p>
                 </div>
                 <a href="/fit-talks" className="bg-[#00E6C8] text-black px-6 py-2 rounded-xl font-bold whitespace-nowrap hover:scale-105 transition-all">Go post on FitTalks</a>
              </div>

             {loading ? (
                <div className="py-20 text-center">
                    <div className="w-10 h-10 border-2 border-[#00E6C8] border-t-transparent animate-spin rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Syncing with Google Sheets...</p>
                </div>
             ) : (
               posts.map((post) => (
                 <div key={post.id} className="bg-[#0B1220] border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:border-white/20 transition-all group">
                   <div className="flex items-center gap-4">
                     <div className="hidden sm:block w-16 h-16 rounded-lg overflow-hidden bg-white/5">
                       {post.image_url && <img src={post.image_url} alt="" className="w-full h-full object-cover" />}
                     </div>
                     <div>
                       <h3 className="font-bold text-lg group-hover:text-[#00E6C8] transition-colors">{post.title}</h3>
                       <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                         <span className="bg-white/5 px-2 py-0.5 rounded text-[#00E6C8]">{post.category}</span>
                         <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : "Draft"}</span>
                         {post.published === true || post.published === "TRUE" ? (
                           <span className="flex items-center gap-1 text-[#00E6C8]"><FiCheck /> Public</span>
                         ) : (
                           <span className="flex items-center gap-1 text-yellow-500"><FiX /> Private</span>
                         )}
                       </div>
                     </div>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-xs text-gray-500 italic hidden sm:block">Edit on FitTalks page</span>
                   </div>
                 </div>
               ))
             )}
             {!loading && posts.length === 0 && (
               <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
                   <FiInfo className="mx-auto text-3xl text-gray-700 mb-4" />
                   <p className="text-gray-500">No stories found.</p>
               </div>
             )}
           </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
             {analyticsLoading ? (
                 <div className="py-20 text-center">
                    <div className="w-10 h-10 border-2 border-[#00E6C8] border-t-transparent animate-spin rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading live data from Sheets...</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0B1220] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                       <FiEye className="absolute right-[-20px] bottom-[-20px] text-[120px] text-white/5" />
                       <p className="text-gray-400 font-bold tracking-widest text-xs uppercase mb-2">Total Site Views</p>
                       <h2 className="text-5xl font-black text-white">{analytics.totalViews}</h2>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0B1220] p-8 rounded-3xl border border-[#00E6C8]/30 relative overflow-hidden shadow-[0_0_30px_rgba(0,230,200,0.1)]">
                       <FiMousePointer className="absolute right-[-20px] bottom-[-20px] text-[120px] text-[#00E6C8]/10" />
                       <p className="text-[#00E6C8] font-bold tracking-widest text-xs uppercase mb-2">Buy Button Clicks</p>
                       <h2 className="text-5xl font-black text-white">{analytics.totalClicks}</h2>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0B1220] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                       <FiActivity className="absolute right-[-20px] bottom-[-20px] text-[120px] text-white/5" />
                       <p className="text-gray-400 font-bold tracking-widest text-xs uppercase mb-2">Views (Last 7 Days)</p>
                       <h2 className="text-5xl font-black text-white">{analytics.recentViews}</h2>
                    </motion.div>
                </div>
             )}
             <div className="p-6 bg-white/5 rounded-2xl border border-white/10 mt-8 text-center sm:text-left">
                <div>
                   <h4 className="font-bold mb-1">Live Dashboard Trackers</h4>
                   <p className="text-sm text-gray-400">These numbers update in real time as users interact with the site, giving you quick insights without checking logs.</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </main>
  );
}
