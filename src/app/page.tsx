"use client";

import { useUser } from "@/entities/user/state/queries";
import LandingPage from "./landingPage/page";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/chat"); // إذا مسجل دخول → اذهب للشات
      } else {
        router.replace("/landingPage"); // إذا مش مسجل → اذهب للّوجين
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>                                                                     
      <div className="flex justify-end mb-8">
        <ThemeToggle />
      </div>
    </div>
  );
}
