import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ⭐ THEME PROVIDER
import { ThemeProvider } from "next-themes";

// ⭐ NAVBAR
import Navbar from "@/components/Navbar";

// ⭐ GOOGLE FONTS
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ⭐ SITE METADATA
export const metadata: Metadata = {
  title: "CK Fitness - Transform Your Body",
  description: "A premium gym experience. Opening on December 15, 2025.",
};

// ⭐ ROOT LAYOUT WRAPPER
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          bg-[#0A0F1F] 
          text-white 
          transition-colors 
          duration-300
          dark:bg-[#0A0F1F]
          dark:text-white
          light:bg-[#F4F4F7]
          light:text-black
        `}
      >
        {/* ⭐ THEME PROVIDER WRAPS THE WHOLE APP */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          {/* ⭐ NAVIGATION BAR */}
          <Navbar />

          {/* ⭐ PAGE FADE-IN TRANSITION */}
          <div
            className="
              pt-20
              opacity-0 
              animate-pageFade
            "
          >
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
