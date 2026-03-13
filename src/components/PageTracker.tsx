// src/components/PageTracker.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { logAnalytics } from "@/lib/googleSheets";

export default function PageTracker() {
  const pathname = usePathname();
  const trackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Prevent double-firing in React StrictMode
    if (trackedPath.current !== pathname) {
      logAnalytics("view", pathname || "/");
      trackedPath.current = pathname;
    }
  }, [pathname]);

  return null; // Invisible component
}
