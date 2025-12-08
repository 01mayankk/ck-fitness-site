"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import {
  FiMail,
  FiPhone,
  FiCalendar,
  FiShield,
  FiEdit2,
  FiUpload,
} from "react-icons/fi";

import AvatarCropper from "@/components/AvatarCropper";

type Membership = {
  id: string;
  plan: string | null;
  start_date: string | null;
  expiry_date: string | null;
  is_active: boolean;
};

export default function MemberPanelPage() {
  const router = useRouter();

  // ========= STATE =========
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // UI avatar (may have ?t=)
  const [membership, setMembership] = useState<Membership | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
  });

  // Cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // ========= FETCH USER + MEMBERSHIP =========
  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/auth/login");
        return;
      }

      const currentUser = data.user;
      setUser(currentUser);

      // Prefill profile form
      setProfileForm({
        full_name: (currentUser.user_metadata?.full_name as string) || "",
        phone: (currentUser.user_metadata?.phone as string) || "",
      });

      // Avatar (from metadata, no cache-busting yet)
      const metaAvatar =
        (currentUser.user_metadata?.avatar_url as string | undefined) || null;
      setAvatarUrl(metaAvatar);

      // Membership
      const { data: membershipRow } = await supabase
        .from("memberships")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (membershipRow) setMembership(membershipRow);

      setLoading(false);
    };

    loadData();
  }, [router]);

  // ========= SELECT FILE → OPEN CROPPER =========
  const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    setRawImage(imgURL);
    setShowCropper(true);
  };

  // ========= CROPPED AVATAR HANDLER =========
  const handleCroppedImage = useCallback(
    async (croppedFile: File) => {
      if (!user) return;

      setShowCropper(false);
      setUploadingAvatar(true);

      try {
        // 1) Delete previous file using metadata URL (no ?t)
        const metaAvatarUrl = user.user_metadata
          ?.avatar_url as string | undefined;

        if (metaAvatarUrl) {
          const cleanUrl = metaAvatarUrl.split("?")[0]; // remove any query
          const parts = cleanUrl.split("/avatars/");
          const oldPath = parts[1]; // e.g. "userId/userId.png"
          if (oldPath) {
            await supabase.storage.from("avatars").remove([oldPath]);
          }
        }

        // 2) Upload new cropped file
        const ext = "png";
        const fileName = `${user.id}.${ext}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, croppedFile, { upsert: true });

        if (uploadError) {
          console.error("Avatar upload error:", uploadError.message);
          return;
        }

        // 3) Get public URL (base, no cache param)
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        const publicUrl = data.publicUrl; // clean URL (no ?t)

        // 4) Save into user metadata (store clean URL)
        await supabase.auth.updateUser({
          data: { avatar_url: publicUrl },
        });

        // 5) UI: set avatar with cache-busting query
        const bust = `${publicUrl}?t=${Date.now()}`;
        setAvatarUrl(bust);

        // (Optional) refresh user in state
        const { data: refreshed } = await supabase.auth.getUser();
        if (refreshed.user) {
          setUser(refreshed.user);
        }

        // Cleanup temp
        setRawImage(null);
      } catch (err) {
        console.error("Unexpected avatar upload error:", err);
      } finally {
        setUploadingAvatar(false);
      }
    },
    [user]
  );

  // ========= SAVE PROFILE (NAME + PHONE) =========
  const handleProfileSave = async () => {
    if (!user) return;

    setSavingProfile(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: profileForm.full_name,
        phone: profileForm.phone,
      },
    });

    if (!error) {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUser(data.user);
      setShowEditModal(false);
    } else {
      console.error("Profile update error:", error.message);
    }

    setSavingProfile(false);
  };

  // ========= HELPERS =========
  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString() : "—";

  const daysLeft = (expiry: string | null) => {
    if (!expiry) return null;
    const diff = new Date(expiry).getTime() - Date.now();
    return diff <= 0 ? 0 : Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = daysLeft(membership?.expiry_date ?? null);

  // ========= LOADING =========
  if (loading) {
    return (
      <main className="min-h-screen bg-[#050814] flex items-center justify-center text-white">
        <p className="text-gray-400">Loading your member panel…</p>
      </main>
    );
  }

  // ========= RENDER VARS =========
  const fullName =
    (user?.user_metadata?.full_name as string | undefined) || "Member";
  const phone =
    (user?.user_metadata?.phone as string | undefined) || "Not set";
  const avatarToShow = avatarUrl || "/default-avatar.png";

  // ========= UI =========
  return (
    <main className="min-h-screen bg-[#050814] text-white pt-24 pb-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto"
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">CK Fitness Member Panel</h1>
            <p className="text-gray-300">
              Welcome, {fullName}! Manage your fitness journey.
            </p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* PROFILE CARD */}
          <motion.div
            className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-[#00E6C8] shadow-lg">
                  <Image
                    src={avatarToShow}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="object-cover h-full w-full"
                    unoptimized
                  />
                </div>

                {/* Upload Button */}
                <label className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-[#00E6C8] flex items-center justify-center cursor-pointer hover:scale-105 transition">
                  <FiUpload className="text-black text-sm" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSelectImage}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{fullName}</h2>

                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/5 hover:bg.white/10 border border-white/10"
                  >
                    <FiEdit2 className="text-[#00E6C8]" /> Edit
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Member since:{" "}
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-2 space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <FiMail className="text-[#00E6C8]" />
                <span className="font-semibold text.white">Email:</span>{" "}
                {user?.email}
              </div>

              <div className="flex items-center gap-2">
                <FiPhone className="text-[#00E6C8]" />
                <span className="font-semibold text-white">Phone:</span>{" "}
                {phone}
              </div>
            </div>
          </motion.div>

          {/* MEMBERSHIP CARD */}
          <motion.div
            className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FiShield className="text-[#00E6C8]" />
              <h2 className="text-xl font-semibold">Membership Status</h2>
            </div>

            {membership ? (
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <span className="font-semibold text-white">Plan:</span>{" "}
                  {membership.plan}
                </p>

                <p>
                  <FiCalendar className="inline text-[#00E6C8]" />{" "}
                  <span className="font-semibold text-white">Start:</span>{" "}
                  {formatDate(membership.start_date)}
                </p>

                <p>
                  <FiCalendar className="inline text-red-400" />{" "}
                  <span className="font-semibold text-white">Expiry:</span>{" "}
                  {formatDate(membership.expiry_date)}
                </p>

                <p>
                  <span className="font-semibold text-white">Status:</span>{" "}
                  {membership.is_active ? (
                    <span className="text-[#00E6C8]">Active</span>
                  ) : (
                    <span className="text-red-400">Inactive</span>
                  )}
                </p>

                {daysRemaining !== null && (
                  <p className="text-xs text-gray-400">
                    {daysRemaining} day
                    {daysRemaining === 1 ? "" : "s"} remaining
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-300 text-sm">
                No active membership found.
              </p>
            )}

            <Link
              href="/membership"
              className="inline-block mt-4 px-4 py-2 rounded-md font-semibold text-black bg-gradient-to-r from-[#00C2A8] to-[#00E6C8]"
            >
              View Plans
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md bg-[#0B1220] border border-white/10 rounded-2xl p-6 shadow-2xl"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiEdit2 className="text-[#00E6C8]" /> Edit Profile
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.full_name}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        full_name: e.target.value,
                      }))
                    }
                    className="w-full rounded-md bg-[#020617] border border-white/10 px-3 py-2 text-sm focus:border-[#00E6C8]"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300">Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full rounded-md bg-[#020617] border border-white/10 px-3 py-2 text-sm focus:border-[#00E6C8]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-md border border-white/15 text-gray-200 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  onClick={handleProfileSave}
                  disabled={savingProfile}
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-[#00C2A8] to-[#00E6C8] text-black font-semibold hover:shadow-lg hover:shadow-[#00E6C860]"
                >
                  {savingProfile ? "Saving…" : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CROPPER MODAL */}
      <AnimatePresence>
        {showCropper && rawImage && (
          <AvatarCropper
            imageSrc={rawImage}
            onCancel={() => setShowCropper(false)}
            onCropDone={handleCroppedImage}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
