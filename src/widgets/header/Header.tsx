"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useUser } from "@/entities/user/state/queries";

export default function Header() {
  const pathname = usePathname();
  const { data } = useUser();
  const user = data?.user;

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    {
      href: user ? "/chat" : "/login",
      label: "Chat",
      active: pathname === "/chat",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    { href: "/", label: "Home", active: pathname === "/" },
  ];

  const linkClasses = (isActive: boolean) =>
    `px-4 py-2 rounded hover:bg-indigo-700 transition ${
      isActive && "text-white bg-indigo-600"}`;

  return (
    <header className="w-full bg-gradient-to-r from-indigo-700 to-indigo-600 text-white">
      <div className="flex flex-row-reverse items-center justify-between py-4 px-6">
        {/* Right: Logo + Nav */}
        <div className="flex flex-row-reverse items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            AI Scheduler
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClasses(link.active)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded border border-white/30 hover:bg-white/10"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* User Dropdown */}
          {!user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/register"
                className="px-4 py-2 rounded border border-white/30 hover:bg-white/10 transition"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded border border-white/30 hover:bg-white/10 transition"
              >
                Login
              </Link>
            </div>
          ) : (
            <div ref={dropdownRef} className="hidden relative md:flex">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded transition"
              >
                {user.name}
                <ChevronDown className="w-4 h-4" />
              </button>
              {userMenuOpen && (
                <ul className="absolute right-0 top-12 w-40 bg-white text-indigo-600 rounded shadow-lg">
                  <li className="px-4 py-2 hover:bg-indigo-100 cursor-pointer text-end transition">
                    Profile
                  </li>
                  <li className="px-4 py-2 hover:bg-indigo-100 cursor-pointer text-end transition">
                    Settings
                  </li>
                  <li className="px-4 py-2 hover:bg-indigo-100 cursor-pointer text-end transition">
                    Logout
                  </li>
                </ul>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded hover:bg-white/10 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden text-end bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-4 flex flex-col gap-4 border-t border-white/20 text-white">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              {link.label}
            </Link>
          ))}

          {!user && (
            <div className="flex flex-col gap-3 mt-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded border border-white/30 hover:bg-white/10 transition text-center"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded border border-white/30 hover:bg-white/10 transition text-center"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
