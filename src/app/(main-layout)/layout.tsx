// app/(main-layout)/layout.tsx
"use client";

import Header from "@/widgets/header/Header";
import Footer from "@/widgets/footer/Footer";
import { SectionsProvider } from "../_providers/SectionsContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen relative">
      <SectionsProvider>
        <Header />
        {children}
      </SectionsProvider>
      {/* <Footer /> */}
    </div>
  );
}
