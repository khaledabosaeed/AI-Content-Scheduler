"use client";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="w-full min-h-screen p-8">
      {/* Theme Toggle in top right */}

      {/* Page Content */}
      <div className="w-full flex gap-4">
        <button
          onClick={() => {
            router.push("/login")
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Login
        </button>
        <button
          onClick={() => {
            router.push("/register")
          }}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90"
        >
          Register
        </button>
      </div>
    </div>
  );
}
