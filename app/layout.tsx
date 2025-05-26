import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

// Body font - Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700"],
  variable: "--font-body",
});

// Optional: Geist Mono (for code/mono use)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Note: Bauhaus 93 must be locally hosted if you plan to use it
// Example setup will go in global CSS as: --font-heading: "Bauhaus 93";

export const metadata: Metadata = {
  title: "Disoriti App",
  description: "Frontend powered by Next.js and Shadcn UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head />
      <body
        className={`${poppins.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
