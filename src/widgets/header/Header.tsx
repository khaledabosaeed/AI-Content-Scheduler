"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
import { useTheme } from "@/app/providers/theme-provider";
import { useUser } from "@/entities/user/state/queries";

export default function Header() {
  //   const { theme, toggleTheme } = useTheme();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { data } = useUser();
  const user = data?.user;

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
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <header className="w-full bg-gradient-to-r from-indigo-700 to-indigo-600 text-white">
      <div className="flex flex-row-reverse items-center justify-between py-4 px-6">
        {/* Right: Logo + Nav */}
        <div className="flex flex-row-reverse items-center gap-6">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl">
            AI Scheduler
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {user ? (
              <Link
                href="/chat"
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Chat
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition"
              >
                Chat
              </Link>
            )}
            <Link href="/dashboard" className="hover:text-gray-200 transition">
              Dashboard
            </Link>
            <Link href="/" className="hover:text-gray-200 transition">
              Home
            </Link>
          </nav>
        </div>

        <div className="flex">
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
          {/* Left: Theme + Auth */}
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

          {/* Login/Register or User Dropdown */}
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
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded transition"
              >
                {user.name}
                <ChevronDown className="w-4 h-4" />
              </button>
              {dropdownOpen && (
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
        </div>

        
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden text-end bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-4 flex flex-col gap-4 border-t border-white/20 text-white">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>

          {user ? (
            <>
              <Link
                href="/chat"
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition text-center"
              >
                Chat
              </Link>

              {/* USER DROPDOWN TOGGLE */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="mt-2 py-2 px-3 bg-white/10 rounded flex justify-between items-center"
              >
                <span className="text-sm opacity-80">
                  {userMenuOpen ? "▲" : "▼"}
                </span>
                <span className="font-medium">{user.name}</span>
                
              </button>

              {/* DROPDOWN MENU */}
              {userMenuOpen && (
                <div className="flex flex-col gap-2 bg-white/5 rounded p-3 mt-1 items-end">
                  <button className="text-start hover:text-gray-200">
                    Profile
                  </button>
                  <button className="text-start hover:text-gray-200">
                    Settings
                  </button>
                  <button className="text-start hover:text-gray-200">
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition text-center"
              >
                Chat
              </Link>

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
            </>
          )}
        </div>
      )}
    </header>
  );
}
