"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/entities/user/state/queries";

export default function LandingPage() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
 console.log("LandingPage Rendered", user);
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/chat"); // إذا مسجل دخول → اذهب للشات
      } else {
        router.replace("/login"); // إذا مش مسجل → اذهب للّوجين
      }
    }
  }, [user, isLoading, router]);

  return  // صفحة مؤقتة أثناء التحقق
}
