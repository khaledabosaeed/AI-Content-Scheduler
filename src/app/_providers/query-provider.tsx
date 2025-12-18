"use client";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  DehydratedState,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * QueryProvider مع HydrationBoundary
 *
 * ✅ يقوم بـ:
 * 1. hydrate البيانات المفetch من السيرفر إلى الكلاينت
 * 2. تجنب مشاركة الكاش بين الـ requests المختلفة
 * 3. إعادة استخدام نفس QueryClient عبر صفحات متعددة
 *
 * 🔹 dehydratedState: البيانات المفetchة من السيرفر في layout.tsx
 */
export default function QueryProvider({
  children,
  dehydratedState,
}: {
  children: React.ReactNode;
  dehydratedState?: DehydratedState;
}) {

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - البيانات تبقى fresh لـ 5 دقايق
            gcTime: 10 * 60 * 1000, // 10 minutes - احفظها في الـ memory لـ 10 دقايق بعد ما تصير stale
            refetchOnMount: false, // 🔴 مهم: لا تفetch عند mount إذا كانت البيانات في الـ cache من السيرفر
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            retry: 1, // حاول مرة واحدة عند الفشل
          },
          mutations: {
            retry: 0, // لا تحاول أي mutations بشكل automatic
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* 🔹 HydrationBoundary: تحويل البيانات المفetchة من السيرفر للكلاينت */}
      <HydrationBoundary state={dehydratedState}>
        {children}
      </HydrationBoundary>
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
