"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <button onClick={() => {
        // alert("صفحة الlogin عبال ما نعمل الUI")
        router.push("/login")
      }}>Login</button>
      <button onClick={() => {
        alert("صفحة register عبال ما نعمل الUI")
        router.push("/register")
      }}>Register</button>
    </div>
  );
}
