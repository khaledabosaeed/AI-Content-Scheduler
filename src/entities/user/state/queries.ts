import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { userKeys } from "./keys";

export const useUser = () => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => {
      const response = await api.get("/auth/me", {
        credentials: "include", // مهم جدًا لإرسال الكوكيز
      });
      return response;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // مهم بعد refresh
  });
};
