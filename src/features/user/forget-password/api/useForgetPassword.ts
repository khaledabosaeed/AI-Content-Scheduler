import { api } from "@/shared/api/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ForgetPasswordPayload } from "../libs/type";
import { userKeys } from "@/entities/user/state/keys";

export const useForgetPasswordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ForgetPasswordPayload) => {
      const response = await api.post("/auth/forget-password", payload, {
        requiresAuth: false,
      });
      return response;
    },
    onSuccess: (data) => {
      // Update the cached `me` entry if the response contains user data
      queryClient.setQueryData(userKeys.me(), (old: unknown) => (data?.user ?? old) as unknown);

      // Re-fetch any queries that depend on the `user` namespace
      queryClient.invalidateQueries({ queryKey: userKeys.all() });
      console.log("Forget password email sent successfully!", data);
    },
    onError: (error) => {
      console.error("Failed to send forget password email", error);
    },
  });
};
