import { api } from "@/shared/api/api-client";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/state/keys";

type ResetPasswordPayload = {
  token: string; // الكود المؤقت اللي جالك بالإيميل
  newPassword: string;
};

export const useResetMutation = () => {

    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      const response = await api.post("/auth/reset-password", payload, {
        requiresAuth: false,
      });
      return response;
    },

    onSuccess: (data) => {
      queryClient.setQueryData(userKeys.me(), (old: unknown) => (data?.user ?? old) as unknown);

      // 2️⃣ إعادة fetch لأي query يعتمد على بيانات المستخدم
      queryClient.invalidateQueries({ queryKey: userKeys.all() });

      console.log("Password reset successfully!", data);
    },
    onError: (error) => {
      console.error("Failed to reset password", error);
    },
  });
};
