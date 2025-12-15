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
    // 🔹 prefetch بيانات اليوزر من السيرفر قبل العرض
    await queryClient.prefetchQuery({
      queryKey: userKeys.me(),
      queryFn: getUserServer,
    });

    // 🔹 تحويل الكاش إلى JSON يمكن إرساله للعميل
    const dehydratedState = dehydrate(queryClient);
    // console.log("✅ User data prefetched successfully");
    // console.log(
    //   JSON.stringify(dehydratedState, null, 2),
    //   "this is dehydratedState"
    // );
    // console.log("📊 Query State:", dehydratedState.queries[0]?.state);

    return dehydratedState;
  } catch (error) {
    // console.error("❌ Failed to prefetch user data:", error);
    // إرجع undefined وليس throw - سيسمح بالمتابعة بدون بيانات اليوزر
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
      <body className="w-full min-h-screen relative">
        <ThemeProvider>
          <QueryProvider dehydratedState={dehydratedState}>
            <Suspense fallback={<div />}>
              <main>
                {children}
                <Toaster
                  richColors
                  toastOptions={{
                    success: {
                      style: {
                        background: "var(--toast-success-bg)",
                        color: "var(--toast-success-color)",
                      },
                    },
                    error: {
                      style: {
                        background: "var(--toast-error-bg)",
                        color: "var(--toast-error-color)",
                      },
                    },
                    info: {
                      style: {
                        background: "var(--toast-info-bg)",
                        color: "var(--toast-info-color)",
                      },
                    },
                    warning: {
                      style: {
                        background: "var(--toast-warning-bg)",
                        color: "var(--toast-warning-color)",
                      },
                    },
                  }}
                />
              </main>
            </Suspense>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
