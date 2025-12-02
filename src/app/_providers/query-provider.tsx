// app/providers/query-provider.tsx
"use client";

import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";



export default function QueryProvider({
  children,
  dehydratedState,
}: {
  children: React.ReactNode;
  dehydratedState?: null;
}) {
  // add here the fetch for the user session if needed
  // to make the first load clean and avoid flickering Y om Rooze

  // أنشئي QueryClient هنا داخل ال-component لتجنّب مشاركة كاش عبر requests في dev وحاجات غريبة
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            refetchOnWindowFocus: true, // Refetch when window regains focus
            refetchOnReconnect: true, // Refetch when reconnecting
            retry: 1, // Retry failed requests once
          },
          mutations: {
            retry: 0, // Don't retry mutations by default
          },
        },
      })
  );

  return (
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          {children}
        </HydrationBoundary>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
  );
}
