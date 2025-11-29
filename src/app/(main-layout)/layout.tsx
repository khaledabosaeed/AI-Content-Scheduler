// app/layout.tsx
import type { Metadata } from "next";
import Header from "@/widgets/header/Header";
import Footer from "@/widgets/footer/Footer";

export const metadata: Metadata = {
    title: "AI Content Scheduler",
    description: "Schedule your AI-generated content effortlessly",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full min-h-screen relative">
            <Header />
            {children}
            <Footer />
        </div>
    );
}
