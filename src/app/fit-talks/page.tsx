// src/app/fit-talks/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiPlus, FiX } from "react-icons/fi";
import { fetchPosts, savePost } from "@/lib/googleSheets";

const ADMIN_EMAILS = ["fitbyckfitness@gmail.com", "therealmayankk@gmail.com", "01priyankk@gmail.com"];

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  category: string | null;
  created_at: string;
  published: boolean | string;
};

export default function FitTalksPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Admin State
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminPass, setAdminPass] = useState("");
  
  // Post Editor State
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Strength",
    excerpt: "",
    content: "",
    imageURL: "",
    published: true,
  });

  const loadPosts = async () => {
    setLoading(true);
    const data = await fetchPosts();
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem("admin_auth");
    if (saved) {
      const { email, pass } = JSON.parse(saved);
      if (ADMIN_EMAILS.includes(email.toLowerCase())) {
        setIsAdmin(true);
        setAdminPass(pass);
      }
    }
    loadPosts();
  }, []);

  const handleSave = async () => {
    if (!formData.title || !formData.slug) return alert("Title and Slug are required");
    setSaving(true);
    
    const result = await savePost(formData, adminPass);

    if (result.success) {
      setShowModal(false);
      setFormData({
        title: "",
        slug: "",
        category: "Strength",
        excerpt: "",
        content: "",
        imageURL: "",
        published: true,
      });
      loadPosts();
    } else {
      alert("Error saving: " + (result.error || "Unknown error"));
    }
    setSaving(false);
  };

  const categories = ["All", "Strength", "Nutrition", "Transformation", "Gym News"];
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <main className="min-h-screen bg-[#050814] text-white pt-24 pb-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-5xl mx-auto"
      >
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.3em] text-[#00E6C8]/80">
              FitTalks
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2">
              Stories, tips & journeys from CK Fitness.
            </h1>
            <p className="text-gray-300 mt-2 text-sm sm:text-base">
              Read transformations, training insights, nutrition basics and gym
              updates — all in one place.
            </p>
          </div>
          
          {isAdmin && (
            <div className="flex items-center gap-3 self-start md:self-auto">
               <button 
                 onClick={() => setShowModal(true)}
                 className="px-6 py-3 rounded-xl bg-[#00E6C8] text-black font-bold hover:scale-105 transition-all text-sm flex items-center gap-2 shadow-lg shadow-[#00E6C833]"
               >
                 <FiPlus size={18} /> Create Post
               </button>
            </div>
          )}
        </header>

        {isAdmin && (
             <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between text-sm">
                 <div>
                    <span className="text-[#00E6C8] font-bold">Admin Mode Active</span>
                    <p className="text-gray-400 mt-1 hidden sm:block">You can create stories directly from this page. Changes sync to Sheets.</p>
                 </div>
                 <Link href="/admin" className="text-white hover:text-[#00E6C8] underline">Go to Dashboard</Link>
             </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-[#00E6C8] text-black"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>
            ))}
          </div>
        )}

        {/* Empty state / Content */}
        {!loading && posts.length === 0 ? (
          <div className="p-16 rounded-3xl bg-white/5 border border-dashed border-white/10 text-center">
             <p className="text-gray-400 italic mb-4">
                Our writers are hitting the gym! Real stories are being prepared in our spreadsheet.
             </p>
             <Link href="/" className="text-[#00E6C8] text-sm hover:underline">Back to Homepage</Link>
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {posts
              .filter(p => activeCategory === "All" || p.category === activeCategory)
              .filter(p => isAdmin || (p.published === true || p.published === "TRUE"))
              .map((post, index) => (
                <PostCard key={post.id || index} post={post} index={index} isAdmin={isAdmin} />
              ))}
          </div>
        )}
      </motion.div>

      {/* ADMIN POST EDITOR MODAL */}
      <AnimatePresence>
          {isAdmin && showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-4xl bg-[#0B1220] border border-white/10 rounded-3xl p-8 overflow-y-auto max-h-[90vh] shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold">Craft New Story</h2>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Changes sync to Sheets instantly</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-full"><FiX size={24} /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Headline</label>
                      <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-[#050814] border border-white/10 rounded-xl px-4 py-4 focus:border-[#00E6C8] outline-none transition-all text-lg font-medium"
                        placeholder="The Secret to Perfect Form..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">URL Slug</label>
                        <input 
                            type="text" 
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full bg-[#050814] border border-white/10 rounded-xl px-4 py-3 focus:border-[#00E6C8] outline-none transition-all"
                            placeholder="perfect-form"
                        />
                        </div>
                        <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Category</label>
                        <select 
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-[#050814] border border-white/10 rounded-xl px-4 py-3 focus:border-[#00E6C8] outline-none transition-all"
                        >
                            <option>Strength</option>
                            <option>Nutrition</option>
                            <option>Transformation</option>
                            <option>Gym News</option>
                        </select>
                        </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Cover Image URL</label>
                      <input 
                        type="text" 
                        value={formData.imageURL}
                        onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })}
                        className="w-full bg-[#050814] border border-white/10 rounded-xl px-4 py-3 focus:border-[#00E6C8] outline-none transition-all"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Short Hook (Excerpt)</label>
                      <textarea 
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="w-full bg-[#050814] border border-white/10 rounded-xl px-4 py-3 focus:border-[#00E6C8] outline-none transition-all resize-none"
                        placeholder="Brief summary to catch attention..."
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Story Content (Rich Text/Embedded Links)</label>
                      <textarea 
                        rows={16}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full bg-[#050814] border border-white/10 rounded-xl px-4 py-4 focus:border-[#00E6C8] outline-none transition-all resize-none font-mono text-sm leading-relaxed"
                        placeholder="Write your story here. Paste Instagram links to embed them automatically."
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-8">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-6 h-6 accent-[#00E6C8] rounded-lg"
                    />
                    <label htmlFor="published" className="text-sm font-bold cursor-pointer select-none">Make Public instantly</label>
                  </div>
                  <div className="flex items-center gap-6">
                    <button onClick={() => setShowModal(false)} className="text-gray-500 font-bold hover:text-white transition-colors">Discard</button>
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-[#00E6C8] text-black font-extrabold px-10 py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#00E6C833] disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? "Syncing..." : "Publish to Feed"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
      </AnimatePresence>
    </main>
  );
}

function PostCard({ post, index, isAdmin }: { post: Post; index: number; isAdmin: boolean }) {
  const date = post.created_at ? new Date(post.created_at).toLocaleDateString() : "New Story";
  const isDraft = post.published === false || post.published === "FALSE";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className={`group rounded-2xl border ${isDraft ? "border-yellow-500/30 border-dashed" : "border-white/10"} bg-[#0B1220] overflow-hidden hover:border-[#00E6C8]/60 hover:shadow-[0_24px_60px_rgba(0,0,0,0.8)] transition-all cursor-pointer relative`}
    >
      <Link href={`/fit-talks/${post.slug}`} className="flex flex-col sm:flex-row">
        {/* Cover image */}
        <div className="sm:w-48 sm:h-40 h-48 relative overflow-hidden">
          <Image
            src={post.image_url || "/gallery1.jpg"}
            alt={post.title}
            width={400}
            height={300}
            className={`object-cover h-full w-full group-hover:scale-105 transition-transform duration-300 ${isDraft ? "opacity-50 grayscale" : ""}`}
          />
          {post.category && (
            <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full bg-black/60 text-[#00E6C8] border border-[#00E6C8]/40">
              {post.category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <h2 className="text-lg sm:text-xl font-semibold group-hover:text-[#00E6C8] transition-colors">
                {post.title}
            </h2>
            {isAdmin && isDraft && (
                <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-2 py-1 rounded border border-yellow-500/20 whitespace-nowrap">DRAFT</span>
            )}
          </div>
          {post.excerpt && (
            <p className="text-sm text-gray-300 line-clamp-3">
              {post.excerpt}
            </p>
          )}
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>{date}</span>
            <span className="group-hover:text-[#00E6C8] font-bold">
              Read article →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
