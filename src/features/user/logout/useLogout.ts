import { userKeys } from "@/entities/user/state/keys";
import { api } from "@/shared/api/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.post(
        "auth/logout",
        {},
        {
          requiresAuth: true,
        }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.setQueryData(userKeys.me(), null);
      queryClient.invalidateQueries({ queryKey: userKeys.all() });
    },
    onError: (error) => {
      console.error("Logout failed", error);
    },
  });
};
