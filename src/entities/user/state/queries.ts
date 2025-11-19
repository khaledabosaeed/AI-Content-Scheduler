import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";
import { getCurrentUser } from "@/services/userService";

export const useUser = () => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5,
  });
};
