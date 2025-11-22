import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";
import { api } from "@/shared/api/api-client";

export const useUser = () => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => {
      const response = await api.get("/api/auth/me", {
        credentials: "include", // مهم لإرسال الكوكيز
      });

      if (response.status === 401) return null; // Not authenticated
      if (!response.ok) throw new Error("Failed to fetch current user");

      return response.json();
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Retry only for network errors, not 401
      if (error.message.includes("Failed to fetch")) return failureCount < 2;
      return false;
    },
  });
};

