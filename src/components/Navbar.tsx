"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* -----------------------------------------
     ⭐ SCROLL EFFECT
  ----------------------------------------- */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* -----------------------------------------
     ⭐ PREFETCH ON HOVER (FAST NAVIGATION)
  ----------------------------------------- */
  const smartPrefetch = (route: string) => {
    try {
      if (typeof window !== "undefined") {
        router.prefetch(route);
      }
    } catch {
      // ignore
    }
  };

  /* -----------------------------------------
     ⭐ STATIC NAV TABS
  ----------------------------------------- */
  const baseTabs = [
    { name: "Home", path: "/" },
    { name: "Membership", path: "/membership" },
    { name: "FitTalks", path: "/fit-talks" },        
    { name: "PulseConnect", path: "/pulse-connect" } 
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`
        fixed top-0 left-0 w-full z-50 
        border-b border-white/10
        transition-all duration-500
        ${scrolled ? "py-2 bg-[#0A0F1F]/90 backdrop-blur-xl" : "py-4 bg-[#0A0F1F]/70 backdrop-blur"}
      `}
    >
      <div className="w-full flex justify-between items-center px-6 lg:px-10">

        {/* ---------------------- LOGO ---------------------- */}
        <Link
          href="/"
          onMouseEnter={() => smartPrefetch("/")}
          className="flex items-center gap-4"
        >
          <motion.div
            whileHover={{
              scale: 1.15,
              filter: "drop-shadow(0px 0px 12px #00E6C8)",
            }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src="/logo.png"
              alt="CK Fitness Logo"
              width={60}
              height={60}
              className="rounded-md"
            />
          </motion.div>

          <motion.span
            whileHover={{
              scale: 1.1,
              textShadow: "0px 0px 10px #00E6C8",
            }}
            transition={{ duration: 0.2 }}
            className="text-3xl font-bold tracking-wide text-white"
          >
            CK FITNESS
          </motion.span>
        </Link>

        {/* ---------------------- DESKTOP MENU ---------------------- */}
        <div className="hidden md:flex gap-10 text-lg items-center relative">
          {/* MAIN TABS */}
          {baseTabs.map((item) => (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.1, x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={item.path}
                onMouseEnter={() => smartPrefetch(item.path)}
                className={`relative px-1 transition-all duration-300 ${
                  pathname === item.path
                    ? "text-[#00E6C8] font-semibold drop-shadow-[0_0_10px_#00E6C8]"
                    : "text-gray-300 hover:text-[#00E6C8]"
                }`}
              >
                {item.name}

                {pathname === item.path && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute left-0 -bottom-1 h-[3px] w-full bg-[#00E6C8] rounded-full"
                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}

          {/* JOIN NOW BUTTON */}
          <motion.div whileHover={{ scale: 1.12 }}>
            <Link
              href="/membership"
              onMouseEnter={() => smartPrefetch("/membership")}
              className="ml-4 px-5 py-2.5 rounded-xl text-black font-semibold bg-gradient-to-r from-[#00C2A8] to-[#00E6C8] hover:shadow-xl hover:shadow-[#00E6C8aa] transition-all flex items-center gap-2"
            >
              Join Now
            </Link>
          </motion.div>
        </div>

        {/* ---------------------- MOBILE MENU BUTTON ---------------------- */}
        <div
          className="md:hidden flex flex-col justify-center items-center gap-1.5 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
            className="h-[3px] w-[26px] bg-[#00E6C8] rounded-full"
          />
          <motion.span
            animate={{ opacity: open ? 0 : 1 }}
            className="h-[3px] w-[22px] bg-[#00E6C8] rounded-full"
          />
          <motion.span
            animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
            className="h-[3px] w-[26px] bg-[#00E6C8] rounded-full"
          />
        </div>
      </div>

      {/* ---------------------- MOBILE DROPDOWN ---------------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-[#0A0F1F]/60 backdrop-blur-xl border-t border-white/10 px-6 py-4 text-gray-200 text-lg shadow-lg shadow-black/20"
          >
            {/* main tabs */}
            {baseTabs.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
              >
                <Link
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className={`block py-2 ${
                    pathname === item.path
                      ? "text-[#00E6C8] font-semibold"
                      : "hover:text-[#00E6C8]"
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            <Link
              href="/membership"
              onClick={() => setOpen(false)}
              className="block mt-4 py-3 rounded-xl text-center text-black bg-[#00E6C8] font-bold"
            >
              Join Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
