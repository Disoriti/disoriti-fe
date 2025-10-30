import "@/app/globals.css";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-context";



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
  title: "Disoriti - AI-powered ad generator",
  description: "Disoriti lets you generate effective AI-powered ads for any social media platform—fast. Turn your ideas into scroll-stopping posts, banners, and stories with the help of advanced AI creative tools.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark">
      <head />
      <body
        className={`${poppins.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
