import type { Metadata } from "next";
import "./styles/globals.css";
import QueryProvider from "./_providers/query-provider";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/state/keys";
import { fetchUserData } from "@/entities/user/state/queries";
import { ThemeProvider } from "./_providers/theme-provider";

export const metadata: Metadata = {
  title: "AI Content Scheduler",
  description: "Schedule your AI-generated content effortlessly",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  // 🔹 prefetch بيانات اليوزر من السيرفر قبل العرض
  await queryClient.prefetchQuery({
    queryKey: userKeys.me(),
    queryFn: fetchUserData,
  });

  // 🔹 تحويل الكاش إلى JSON يمكن إرساله للعميل
  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="w-full min-h-screen relative">
        <ThemeProvider>
          <QueryProvider dehydratedState={dehydratedState}>
            <main>{children}</main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
