"use client";
import { FaInstagram, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Bebas_Neue } from "next/font/google";

// Special font for CK FITNESS heading
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

// Countdown type
type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

// Opening date
const OPENING_DATE = new Date("2025-12-15T00:00:00");

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown logic
  useEffect(() => {
    const updateTime = () => {
      const now = new Date().getTime();
      const diff = OPENING_DATE.getTime() - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#050814] text-white">
      {/* Page fade-in */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-6 pt-24 pb-16 space-y-24"
      >
        {/* ===================================================== */}
        {/* 1️⃣ HERO SECTION */}
        {/* ===================================================== */}
        <motion.section
          className="grid gap-10 lg:grid-cols-2 items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          {/* LEFT SIDE */}
          <div>
            {/* Logo + CK FITNESS */}
            <motion.div
              className="flex items-center gap-4 mb-4"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <Image
                  src="/logo.png"
                  alt="CK Fitness Logo"
                  width={90}
                  height={90}
                  className="rounded-md"
                />
              </motion.div>

              <motion.h1
                className={`${bebas.className} text-5xl sm:text-6xl tracking-[0.20em]`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                CK FITNESS
              </motion.h1>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-4xl sm:text-5xl font-extrabold mb-5 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              Transform Your Body.
              <br />
              Transform Your Life.
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-gray-300 text-lg mb-8 max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1.1 }}
            >
              A premium gym experience with modern equipment, aesthetic lighting
              and a focused training environment.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <Link
                href="/auth/signup"
                className="px-5 py-3 rounded-md font-semibold text-black bg-gradient-to-r from-[#00C2A8] to-[#00E6C8] hover:scale-[1.06] hover:shadow-lg hover:shadow-[#00E6C8aa] transition-all"
              >
                Join Now
              </Link>

              <Link
                href="/membership"
                className="px-5 py-3 rounded-md font-semibold border border-[#00E6C8] text-[#00E6C8] hover:bg-[#00E6C810] hover:scale-[1.03] transition-all"
              >
                View Membership Plans
              </Link>
            </motion.div>

            {/* Countdown */}
            <motion.div
              className="bg-[#0B1220] border border-white/10 rounded-xl p-4 inline-block"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1 }}
            >
              <p className="text-sm text-gray-400 mb-2">
                Countdown —{" "}
                <span className="text-[#00E6C8] font-semibold">
                  December 15, 2025
                </span>
              </p>

              <div className="grid grid-cols-4 gap-3 text-center">
                <CountdownBlock label="Days" value={timeLeft.days} />
                <CountdownBlock label="Hours" value={timeLeft.hours} />
                <CountdownBlock label="Minutes" value={timeLeft.minutes} />
                <CountdownBlock label="Seconds" value={timeLeft.seconds} />
              </div>
            </motion.div>
          </div>

          {/* RIGHT HERO IMAGE */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 1.1 }}
          >
            <div className="absolute -inset-10 bg-[#00E6C822] blur-3xl rounded-xl"></div>

            <div className="relative bg-[#0B1220] border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/40">
              <Image
                src="/gallery1.jpg"
                alt="Gym Floor"
                width={1200}
                height={800}
                className="rounded-xl object-cover max-h-[380px] w-full"
              />
            </div>
          </motion.div>
        </motion.section>

        {/* ===================================================== */}
        {/* 2️⃣ WHY CK FITNESS */}
        {/* ===================================================== */}
        <motion.section
          className="space-y-4"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold">Why CK Fitness?</h2>
          <p className="text-gray-300 text-lg max-w-3xl">
            CK Fitness isn’t just a gym — it’s a commitment to becoming the
            strongest version of yourself. Whether your goal is strength, weight
            loss, discipline, or complete transformation, we stand beside you in
            every set and every session.
          </p>
        </motion.section>

        {/* ===================================================== */}
        {/* 3️⃣ FACILITIES SECTION */}
        {/* ===================================================== */}
        <motion.section
          className="space-y-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h2 className="text-3xl font-bold">Facilities</h2>
            <p className="text-gray-400 text-sm max-w-xl">
              A carefully designed space with modern equipment, aesthetic
              lighting and a safe, hygienic training environment.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FacilityCard
              icon="🏋️"
              title="High-End Equipment"
              description="Modern strength machines, free weights, squat rack and smith machine for all levels."
            />
            <FacilityCard
              icon="🏃‍♂️"
              title="Dedicated Cardio Zone"
              description="Treadmills, spin bike, cross trainer & stairmill for endurance."
            />
            <FacilityCard
              icon="🧼"
              title="Hygienic Environment"
              description="Regular cleaning for a safe workout experience."
            />
            <FacilityCard
              icon="🎧"
              title="Motivational Music"
              description="Curated workout playlists and energetic ambience."
            />
            <FacilityCard
              icon="💡"
              title="Aesthetic Lighting"
              description="LED ambient lighting for a premium training vibe."
            />
            <FacilityCard
              icon="🎯"
              title="Guidance & Support"
              description="Goal-based workout planning and form correction."
            />
          </div>
        </motion.section>

        {/* ===================================================== */}
        {/* 4️⃣ MEMBERSHIP CTA */}
        {/* ===================================================== */}
        <motion.section
          className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <div>
            <h3 className="text-2xl font-bold mb-1">
              Ready to start your transformation?
            </h3>
            <p className="text-gray-300">
              Explore our membership plans and early bird offers.
            </p>
          </div>
          <Link
            href="/membership"
            className="px-5 py-3 rounded-md font-semibold text-black bg-gradient-to-r from-[#00C2A8] to-[#00E6C8] hover:scale-[1.03] hover:shadow-lg hover:shadow-[#00E6C8aa] transition-all"
          >
            View Membership Plans
          </Link>
        </motion.section>

        {/* ===================================================== */}
        {/* 5️⃣ GALLERY */}
        {/* ===================================================== */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h2 className="text-3xl font-bold">Inside CK Fitness</h2>
            <p className="text-gray-400 text-sm max-w-xl">
              A glimpse into our training floor & modern interiors.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {["/gallery1.jpg", "/gallery2.jpg", "/gallery3.jpg"].map(
              (src, idx) => (
                <GalleryImage key={idx} src={src} />
              )
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {["/gallery4.jpg", "/gallery5.jpg", "/gallery6.jpg"].map(
              (src, idx) => (
                <GalleryImage key={idx} src={src} />
              )
            )}
          </div>
        </motion.section>
{/* ===================================================== */}
{/* CONTACT SECTION – With Embedded Map                   */}
{/* ===================================================== */}
<motion.section
  className="grid gap-10 md:grid-cols-2 items-start"
  initial={{ opacity: 0, y: 35 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.9, ease: "easeOut" }}
>
  {/* LEFT SIDE — CONTACT INFO */}
  <div className="space-y-6">
    <h2 className="text-3xl font-bold mb-2">Contact</h2>

    {/* OWNER */}
    <div className="flex items-center gap-4">
      <Image
        src="/owner.jpg"
        alt="Owner: Prince Thakur"
        width={80}
        height={80}
        className="rounded-full border border-white/20 shadow-lg object-cover"
      />
      <div>
        <p className="font-semibold text-xl">Prince Thakur</p>
        <p className="text-gray-400 text-sm">Owner, CK Fitness</p>
      </div>
    </div>

    {/* CONTACT LIST */}
    <div className="space-y-4 text-lg">

      {/* PHONE */}
      <Link
        href="tel:+919472526457"
        className="flex items-center gap-3 hover:text-[#00E6C8] transition-all"
      >
        <FaPhoneAlt className="text-[#00E6C8] text-xl" />
        <span><strong>Phone:</strong> +91 9472526457</span>
      </Link>

      {/* EMAIL */}
      <Link
        href="mailto:fitbyckfitness@gmail.com"
        className="flex items-center gap-3 hover:text-[#00E6C8] transition-all"
      >
        <HiOutlineMail className="text-[#00E6C8] text-2xl" />
        <span><strong>Email:</strong> fitbyckfitness@gmail.com</span>
      </Link>

      {/* INSTAGRAM */}
      <Link
        href="https://instagram.com/ck_fitness22"
        target="_blank"
        className="flex items-center gap-3 hover:text-[#E1306C] transition-all"
      >
        <FaInstagram className="text-[#E1306C] text-2xl" />
        <span><strong>Instagram:</strong> @ck_fitness22</span>
      </Link>
    </div>

    {/* WHATSAPP BUTTON */}
    <a
      href="https://api.whatsapp.com/send?phone=919472526457&text=Hello%2C%20I%20have%20a%20query."
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-black font-semibold rounded-md
                 hover:bg-[#32ff89] hover:scale-[1.05] transition-all mt-2"
    >
      <FaWhatsapp className="text-xl" />
      WhatsApp Us
    </a>
  </div>

  {/* RIGHT SIDE — EMBEDDED GOOGLE MAP (NO API KEY NEEDED) */}
  <div className="space-y-4">
    <p className="text-gray-400 text-sm">
      Find us easily — explore the map or open live directions.
    </p>

    {/* GOOGLE MAP EMBED WITHOUT API KEY */}
    <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden border border-white/10 shadow-lg">
      <iframe
        width="100%"
        height="100%"
        loading="lazy"
        style={{ border: 0 }}
        allowFullScreen
        src="https://www.google.com/maps?q=Station+Road+Near+RK+Palace+852131&z=15&output=embed"
      ></iframe>
    </div>

    {/* BUTTON — OPEN LIVE DIRECTIONS */}
    <a
      href="https://www.google.com/maps/dir/?api=1&destination=Station+Road+Near+RK+Palace+852131"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 bg-[#0B1220] border border-white/10 rounded-xl py-3
                 hover:border-[#00E6C8] hover:scale-[1.02] transition-all text-sm"
    >
      🚗 <span className="font-semibold">Open Google Maps Directions</span>
    </a>
  </div>
</motion.section>



        {/* FOOTER */}
        <footer className="border-top border-white/10 pt-6 mt-4 text-sm text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} CK Fitness. All rights reserved.</span>
          <span>Built with dedication, discipline & passion for fitness.</span>
        </footer>
      </motion.div>
    </main>
  );
}

/* ========================================================= */
/* SMALL COMPONENTS */
/* ========================================================= */

function CountdownBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#020617] border border-white/10 rounded-lg py-2 px-3">
      <div className="text-2xl font-bold text-[#00E6C8]">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function FacilityCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      whileHover={{
        scale: 1.12,
        y: -10,
        boxShadow: "0px 15px 45px rgba(0, 230, 200, 0.35)",
        backgroundColor: "rgba(15, 25, 45, 0.9)",
      }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 shadow-md shadow-black/30 flex flex-col gap-3"
    >
      <div className="h-12 w-12 rounded-full bg-[#020617] flex items-center justify-center text-3xl">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function GalleryImage({ src }: { src: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-[#020617]"
    >
      <Image
        src={src}
        alt="CK Fitness Gallery Image"
        width={800}
        height={600}
        className="w-full h-48 md:h-56 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
