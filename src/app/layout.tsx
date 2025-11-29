// app/layout.tsx
import type { Metadata } from "next";
import "./styles/globals.css";
import QueryProvider from "./_providers/query-provider";

export const metadata: Metadata = {
  title: "AI Content Scheduler",
  description: "Schedule your AI-generated content effortlessly",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="w-full min-h-screen relative">
        <QueryProvider>
          <main>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
