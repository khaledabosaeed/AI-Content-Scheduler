import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";

export const useUser = () => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn:async ()=> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  const data = await response.json();
  return data; // ترجع User object
},
    staleTime: 1000 * 60 * 5,
  });
};
