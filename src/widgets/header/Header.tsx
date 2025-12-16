"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useUser } from "@/entities/user/state/queries";
import { useLogoutMutation } from "@/features/user/logout/useLogout";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { useSections } from "@/app/_providers/SectionsContext";
import { toast } from "sonner";

export default function Header() {
  const { data } = useUser();
  const user = data?.user;
  const { mutate } = useLogoutMutation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { visibleIndex, setVisibleIndex } = useSections();

  const sectionLinks = [
    { href: "#hero", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#fun-steps", label: "How It Works" },
    { href: "#about", label: "About" },
    { href: "#pricing", label: "Pricing" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#faq", label: "FAQ" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    const handleScroll = () => setSticky(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSectionClick = (index: number) => {
    setVisibleIndex(index);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 transition-all duration-300">
      <div className={`flex items-center flex-row-reverse justify-between py-3 sm:py-4 px-4 sm:px-6 lg:px-8 text-white transition-shadow ${sticky ? "shadow-lg" : "shadow-none"}`}>
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-lg sm:text-xl md:text-2xl hover:opacity-90 transition-opacity whitespace-nowrap text-text-primary"
        >
          AI Scheduler
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 flex-row-reverse">
          {sectionLinks.map((link, idx) => (
            <button
              key={link.href}
              onClick={() => handleSectionClick(idx)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors text-text-primary ${visibleIndex === idx ? "bg-white/20" : "hover:bg-white/10"}`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Theme & User */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="rounded-sm bg-[hsl(var(--primary))]">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-white/10 transition bg-[hsl(var(--primary))]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>

          {!user ? (
            <Link
              href="/login"
              className="hidden sm:block px-4 sm:px-6 py-2 rounded-lg border border-white/30 bg-white/10 text-text-primary font-semibold text-sm sm:text-base shadow-md hover:shadow-md hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              Login
            </Link>
          ) : (
            <div ref={dropdownRef} className="relative flex">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-background rounded-md text-sm sm:text-base font-medium shadow-md transition"
              >
                {user.name}
                <ChevronDown className="w-4 h-4" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-52 bg-card backdrop-blur-lg rounded-xl shadow-2xl z-50 border border-border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-1">
                    <Link
                      href="/chat"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center justify-end gap-2 px-4 py-2.5 rounded-lg text-text-primary hover:bg-action-hover hover:text-primary transition-all duration-200 text-sm font-medium group"
                    >
                      <span>Chat</span>
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center justify-end gap-2 px-4 py-2.5 rounded-lg text-text-primary hover:bg-action-hover hover:text-primary transition-all duration-200 text-sm font-medium group"
                    >
                      <span>Dashboard</span>
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>

                    <div className="my-1 h-px bg-divider"></div>

                    <button
                      onClick={() => {
                        toast.success("Logged out successfully!");
                        mutate();
                      }}
                      className="flex items-center justify-end gap-2 w-full px-4 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200 text-sm font-medium group"
                    >
                      <span>Logout</span>
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-4 flex flex-col gap-2 border-t border-white/20 bg-black/20 animate-in">
          {sectionLinks.map((link, idx) => (
            <button
              key={link.href}
              onClick={() => handleSectionClick(idx)}
              className="text-black px-3 py-2 rounded-md hover:bg-white/10 transition text-sm font-medium"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
