// app/providers/query-provider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "./theme-provider";

const queryClient = new QueryClient();

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // add here the fetch for the user session if needed
  // to make the first load clean and avoid flickering Y om Rooze 
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
