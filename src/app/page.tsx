// app/page.tsx
"use client"; // ← مهم جداً، يجعل الصفحة Client Component

import LoginForm from "@/features/user/login/ui/Login";
import { useUser } from "@/entities/user/state/queries";
import LandingPage from "./landingPage/page";

export default function Page() {
  const { data, isLoading } = useUser();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <LandingPage/>
    </div>
  );
}
