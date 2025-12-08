// src/app/fit-talks/new/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export default function NewPostPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    cover_image_url: "",
  });

  // Check auth
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/auth/login");
        return;
      }
      setUser(data.user);
      setLoadingUser(false);
    };
    checkUser();
  }, [router]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && prev.slug.trim() === "") {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setErrorMessage("");

    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setErrorMessage("Title, slug and content are required.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("posts").insert({
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim(),
      category: form.category.trim() || null,
      cover_image_url: form.cover_image_url.trim() || null,
      author_id: user.id,
      published: true, // directly published; you can change this later
    });

    if (error) {
      console.error("Error creating post:", error.message);
      setErrorMessage(error.message);
      setSaving(false);
      return;
    }

    router.push("/fit-talks");
  };

  if (loadingUser) {
    return (
      <main className="min-h-screen bg-[#050814] text-white pt-24 pb-16 px-6 flex items-center justify-center">
        <p className="text-gray-400">Checking permissions…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050814] text-white pt-24 pb-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          Write a new FitTalks post
        </h1>
        <p className="text-gray-300 text-sm mb-6">
          Keep it real, helpful and aligned with CK Fitness values.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full rounded-md bg-[#020617] border border-white/10 px-3 py-2 text-sm outline-none focus:border-[#00E6C8]"
              placeholder="Example: How to make your first month at the gym count"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              URL Slug * (auto-filled from title, but you can edit)
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              className="w-full rounded-md bg-[#020617] border border-white/10 px-3 py-2 text-sm outline-none focus:border-[#00E6C8]"
              placeholder="how-to-make-your-first-month-count"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Category (optional)
            </label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full rounded-md bg-[#020617] border border-white/10 px-3 py-2 text-sm outline-none focus:border-[#00E6C8]"
              placeholder="Training, Nutrition, Motivation, Update…"
            />
          </div>

          {/* Cover image URL */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Cover Image URL (optional)
            </label>
            <input
              type="text"
              value={form.cover_image_url}
              onChange={(e) => handleChange("cover_image_url", e.target.value)}
              className="w-full rounded-md bg-[#020617] border border-white/10 px-3 py-2 text-sm outline-none focus:border-[#00E6C8]"
              placeholder="https://..."
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Short Summary / Excerpt (optional)
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => handleChange("excerpt", e.target.value)}
              className="w-full rounded-md bg-[#020617] border border-white/10 px-3 py-2 text-sm outline-none focus:border-[#00E6C8] min-h-[60px]"
              placeholder="1–2 lines about what this article offers."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Content *
            </label>
            <textarea
              value={form.content}
              onChange={(e) => handleChange("content", e.target.value)}
              className="w-full rounded-md bg-[#020617] border border-white/10 px-3 py-2 text-sm outline-none focus:border-[#00E6C8] min-h-[220px]"
              placeholder="Write your full article here..."
            />
          </div>

          {/* Error */}
          {errorMessage && (
            <p className="text-sm text-red-400">{errorMessage}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => router.push("/fit-talks")}
              className="px-4 py-2 rounded-md border border-white/20 text-gray-200 hover:bg-white/5 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-[#00C2A8] to-[#00E6C8] text-black font-semibold text-sm hover:shadow-lg hover:shadow-[#00E6C860] disabled:opacity-60"
            >
              {saving ? "Publishing…" : "Publish Post"}
            </button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
