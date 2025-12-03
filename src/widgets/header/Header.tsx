"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useUser } from "@/entities/user/state/queries";
import { useLogoutMutation } from "@/features/user/logout/useLogout";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";

export default function Header() {
  const { data } = useUser();
  const user = data?.user;
  const { mutate } = useLogoutMutation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("#hero");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sectionLinks = [
    { href: "#hero", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#fun-steps", label: "How It Works" },
    { href: "#about", label: "About" },
    { href: "#pricing", label: "Pricing" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#cta", label: "CTA" },
    { href: "#faq", label: "FAQ" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);

    const sections = sectionLinks.map((link) => document.querySelector(link.href) as HTMLElement);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection("#" + entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((sec) => sec && observer.observe(sec));

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      sections.forEach((sec) => sec && observer.unobserve(sec));
    };
  }, []);

  return (
    <header className={`w-full sticky top-0 z-40 transition-all duration-300`}>
      <div
        className={`flex items-center flex-row-reverse justify-between py-3 sm:py-4 px-4 sm:px-6 lg:px-8 transition-all duration-300
          text-white
          ${sticky ? 'shadow-lg' : 'shadow-md'}
        `}
        style={{ backgroundColor: "hsl(var(--accent))" }}
      >
        {/* Logo */}
        <Link href="/" className="font-bold text-lg sm:text-xl md:text-2xl hover:opacity-90 transition-opacity whitespace-nowrap">
          AI Scheduler
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 flex-row-reverse">
          {sectionLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${activeSection === link.href 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Theme & User */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <ThemeToggle />

          {!user ? (
            <Link
              href="/login"
              className="hidden sm:block px-4 sm:px-6 py-2 rounded-lg border border-white/30 bg-white/10 text-white font-semibold text-sm sm:text-base shadow-sm hover:shadow-md hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              Login
            </Link>
          ) : (
            <div ref={dropdownRef} className="relative flex">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white text-indigo-600 rounded-md text-sm sm:text-base font-medium hover:shadow-md transition"
              >
                {user.name}
                <ChevronDown className="w-4 h-4" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white text-indigo-600 rounded-lg shadow-xl z-50 border border-gray-100">
                  <Link
                    href="/chat"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 border-b border-indigo-200 hover:bg-indigo-50 text-end text-sm transition"
                  >
                    Chat
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 border-b hover:bg-indigo-50 text-end text-sm transition"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={() => mutate()}
                    className="block w-full text-end px-4 py-2 text-red-600 font-medium hover:bg-indigo-50 transition text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-white/10 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-4 flex flex-col gap-2 border-t border-white/20 text-white animate-in"
             style={{ backgroundColor: "hsl(var(--accent))" }}>
          {sectionLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-white px-3 py-2 rounded-md hover:bg-white/10 transition text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
