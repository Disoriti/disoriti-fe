"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, BookOpen, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

const navigation = [
  { name: "Home", href: "/", isExternal: true },
  { name: "About", href: "#about", isExternal: false },
  { name: "How it works", href: "#how-it-works", isExternal: false },
  { name: "Showcase", href: "#showcase", isExternal: false },
  { name: "Team", href: "#team", isExternal: false },
  { name: "Pricing", href: "#pricing", isExternal: false },
  { name: "FAQ", href: "#faq", isExternal: false },
  { name: "Blogs", href: "/blogs", isExternal: true },
];

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle smooth scroll
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href");
    if (href?.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-10">
              <Image
                src="/logo-primary.png"
                alt="Disoriti"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={item.isExternal ? undefined : handleNavClick}
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    item.isExternal && item.name === "Blogs"
                      ? 'text-muted-foreground hover:text-accent px-3 py-1.5 rounded-lg border border-primary/20 hover:border-accent/30 bg-background/20 hover:bg-background/40' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {item.isExternal && item.name === "Blogs" && <BookOpen className="h-4 w-4" />}
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Logged in as {user?.email || 'User'}
                  </span>
                  <Link href="/dashboard">
                    <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-sm flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-sm">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-sm">
                      Get started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t mt-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={item.isExternal ? undefined : handleNavClick}
                  className={`block py-2 text-base font-medium transition-colors flex items-center gap-2 ${
                    item.isExternal && item.name === "Blogs"
                      ? 'text-muted-foreground hover:text-accent px-3 py-2 rounded-lg border border-primary/20 hover:border-accent/30 bg-background/20 hover:bg-background/40' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {item.isExternal && item.name === "Blogs" && <BookOpen className="h-4 w-4" />}
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-sm text-muted-foreground border-b border-primary/10 mb-2">
                      Logged in as {user?.email || 'User'}
                    </div>
                    <Link href="/dashboard" className="block">
                      <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-base flex items-center justify-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block">
                      <Button variant="ghost" className="w-full justify-start text-base">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup" className="block">
                      <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-base">
                        Get started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}