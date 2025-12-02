// app/(main-layout)/layout.tsx
"use client";

import Header from "@/widgets/header/Header";
import Footer from "@/widgets/footer/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full min-h-screen relative">
            <Header />
            {children}
            <Footer />
        </div>
    );
}
