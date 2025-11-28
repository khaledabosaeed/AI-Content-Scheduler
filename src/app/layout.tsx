// app/layout.tsx
import type { Metadata } from "next";
import "./styles/globals.css";
import QueryProvider from "./providers/query-provider";
import Header from "@/widgets/header/Header";
import Footer from "@/widgets/footer/Footer";

export const metadata: Metadata = {
  title: "AI Content Scheduler",
  description: "Schedule your AI-generated content effortlessly",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="w-full min-h-screen relative">
        <QueryProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
