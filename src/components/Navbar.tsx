"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

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
     ⭐ AUTH STATE TRACKING
  ----------------------------------------- */
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
    };
    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  /* -----------------------------------------
     ⭐ STATIC NAV TABS
  ----------------------------------------- */
  const baseTabs = [
    { name: "Home", path: "/" },
    { name: "Membership", path: "/membership" },
    { name: "FitTalks", path: "/fit-talks" },        // FIXED
    { name: "PulseConnect", path: "/pulse-connect" } // placeholder
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

          {/* MEMBER PANEL: visible only when logged in */}
          {user && (
            <motion.div whileHover={{ scale: 1.1, x: 3 }}>
              <Link
                href="/member-panel"
                onMouseEnter={() => smartPrefetch("/member-panel")}
                className={`relative px-1 transition-all duration-300 ${
                  pathname === "/member-panel"
                    ? "text-[#00E6C8] font-semibold drop-shadow-[0_0_10px_#00E6C8]"
                    : "text-gray-300 hover:text-[#00E6C8]"
                }`}
              >
                My Fitness Hub

                {pathname === "/member-panel" && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute left-0 -bottom-1 h-[3px] w-full bg-[#00E6C8] rounded-full"
                  />
                )}
              </Link>
            </motion.div>
          )}

          {/* LOGIN / SIGNUP / LOGOUT */}
          {!user ? (
            <>
              <Link
                href="/auth/login"
                onMouseEnter={() => smartPrefetch("/auth/login")}
                className="text-gray-300 hover:text-[#00E6C8]"
              >
                Login
              </Link>

              <motion.div whileHover={{ scale: 1.12 }}>
                <Link
                  href="/auth/signup"
                  onMouseEnter={() => smartPrefetch("/auth/signup")}
                  className="ml-4 px-4 py-2 rounded-md text-black font-semibold bg-gradient-to-r from-[#00C2A8] to-[#00E6C8] hover:shadow-xl hover:shadow-[#00E6C8aa]"
                >
                  Join Now
                </Link>
              </motion.div>
            </>
          ) : (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              className="ml-4 px-4 py-2 rounded-md font-semibold text-white bg-red-500/80 hover:bg-red-600 hover:scale-[1.07] hover:shadow-[0_0_14px_rgba(255,70,70,0.65)] active:scale-[0.95]"
            >
              Logout
            </button>
          )}
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

            {/* Member panel */}
            {user && (
              <Link
                href="/member-panel"
                onClick={() => setOpen(false)}
                className="block py-2 hover:text-[#00E6C8]"
              >
                My Fitness Hub
              </Link>
            )}

            {/* Auth buttons */}
            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="block py-2 hover:text-[#00E6C8]"
                >
                  Login
                </Link>

                <Link
                  href="/auth/signup"
                  onClick={() => setOpen(false)}
                  className="block mt-3 text-[#00E6C8] font-semibold"
                >
                  Join Now
                </Link>
              </>
            ) : (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setOpen(false);
                  window.location.href = "/";
                }}
                className="block py-2 text-red-400 font-semibold hover:text-red-300 hover:scale-[1.05]"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
