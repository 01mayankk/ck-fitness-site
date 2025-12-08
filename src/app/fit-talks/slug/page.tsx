// src/app/fit-talks/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiCalendar } from "react-icons/fi";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  created_at: string;
};

export default function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const { slug } = params;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, slug, title, excerpt, content, cover_image_url, category, created_at"
        )
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) {
        console.error("Error loading post:", error.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setPost(null);
      } else {
        setPost(data as Post);
      }

      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050814] text-white pt-24 pb-16 px-6 flex items-center justify-center">
        <p className="text-gray-400">Loading article…</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-[#050814] text-white pt-24 pb-16 px-6 flex flex-col items-center justify-center">
        <p className="text-gray-300 mb-4">This article could not be found.</p>
        <Link
          href="/fit-talks"
          className="px-4 py-2 rounded-md border border-[#00E6C8] text-[#00E6C8] hover:bg-[#00E6C810] transition-all text-sm"
        >
          Back to FitTalks
        </Link>
      </main>
    );
  }

  const created = new Date(post.created_at).toLocaleDateString();

  return (
    <main className="min-h-screen bg-[#050814] text-white pt-24 pb-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-3xl mx-auto"
      >
        {/* Back link */}
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-sm text-gray-300 hover:text-[#00E6C8] transition-colors"
        >
          <FiArrowLeft />
          Back
        </button>

        {/* Category + date */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
          {post.category && (
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#00E6C8]">
              {post.category}
            </span>
          )}
          <span className="flex items-center gap-1">
            <FiCalendar className="text-[#00E6C8]" />
            {created}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-300 text-base mb-5">{post.excerpt}</p>
        )}

        {/* Cover image */}
        {post.cover_image_url && (
          <div className="relative w-full h-64 sm:h-80 mb-8 rounded-2xl overflow-hidden border border-white/10">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content – simple text (line breaks respected) */}
        <article className="prose prose-invert max-w-none prose-p:mb-4 prose-p:text-gray-100 prose-strong:text-white prose-h2:text-white prose-h3:text-white">
          <p className="whitespace-pre-line text-base leading-relaxed text-gray-100">
            {post.content}
          </p>
        </article>
      </motion.div>
    </main>
  );
}
