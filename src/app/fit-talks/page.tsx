// src/app/fit-talks/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  created_at: string;
};

export default function FitTalksPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, slug, title, excerpt, cover_image_url, category, created_at"
        )
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading posts:", error.message);
      } else {
        setPosts(data || []);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-[#050814] text-white pt-24 pb-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <header className="mb-10">
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
        </header>

        {/* Loading state */}
        {loading && (
          <p className="text-gray-400">Loading latest posts for you…</p>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <p className="text-gray-400">
            No posts published yet. Check back soon!
          </p>
        )}

        {/* Feed list */}
        <div className="space-y-6 mt-4">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </motion.div>
    </main>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const created = new Date(post.created_at).toLocaleDateString();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="group rounded-2xl border border-white/10 bg-[#0B1220] overflow-hidden hover:border-[#00E6C8]/60 hover:shadow-[0_24px_60px_rgba(0,0,0,0.8)] transition-all cursor-pointer"
    >
      <Link href={`/fit-talks/${post.slug}`} className="flex flex-col sm:flex-row">
        {/* Cover image */}
        <div className="sm:w-48 sm:h-40 h-48 relative overflow-hidden">
          <Image
            src={post.cover_image_url || "/gallery1.jpg"}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {post.category && (
            <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full bg-black/60 text-[#00E6C8] border border-[#00E6C8]/40">
              {post.category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col gap-2">
          <h2 className="text-lg sm:text-xl font-semibold group-hover:text-[#00E6C8] transition-colors">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-sm text-gray-300 line-clamp-3">
              {post.excerpt}
            </p>
          )}
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>{created}</span>
            <span className="group-hover:text-[#00E6C8]">
              Read article →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
