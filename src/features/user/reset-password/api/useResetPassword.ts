import { api } from "@/shared/api/api-client";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { ResetPasswordPayload } from "../libs/type";



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
      queryClient.setQueryData(["currentUser"], data.user);

      // 2️⃣ إعادة fetch لأي query يعتمد على بيانات المستخدم
      queryClient.invalidateQueries(["currentUser"]);

      console.log("Password reset successfully!", data);
    },
    onError: (error) => {
      console.error("Failed to reset password", error);
    },
  });
};
