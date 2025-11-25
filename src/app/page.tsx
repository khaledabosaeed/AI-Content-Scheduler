"use client";

import { useUser } from "@/entities/user/state/queries";
import LandingPage from "./landingPage/page";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";

export default function Page() {
  const { data, isLoading } = useUser();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-end mb-8">
        <ThemeToggle />
      </div>
      <LandingPage />
    </div>
  );
}
