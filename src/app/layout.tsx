import type { Metadata } from "next";
import "./styles/globals.css";
import QueryProvider from "./_providers/query-provider";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/state/keys";
import { ThemeProvider } from "./_providers/theme-provider";
import { Suspense } from "react";
import { getUserServer } from "@/shared/api/getUserclient";
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "AI Content Scheduler",
  description: "Schedule your AI-generated content effortlessly",
};

async function PrefetchUserData() {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: userKeys.me(),
      queryFn: getUserServer,
    });
    

    const dehydratedState = dehydrate(queryClient);


    return dehydratedState;
  } catch (error) {

    return undefined;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ انتظر جلب البيانات قبل العرض (يمنع Flicker)
  const dehydratedState = await PrefetchUserData();

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="w-full min-h-screen relative font-sans">
        <ThemeProvider>
          <QueryProvider dehydratedState={dehydratedState}>
            <Suspense fallback={<div />}>
              <main>
                {children}
                <Toaster richColors />
              </main>
            </Suspense>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
