import { api } from "@/shared/api/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ForgetPasswordPayload } from "../libs/type";

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
      queryClient.setQueryData(["currentUser"], data.user);

      // 2️⃣ إعادة fetch لأي query يعتمد على بيانات المستخدم
      queryClient.invalidateQueries(["currentUser"]);
      console.log("Forget password email sent successfully!", data);
    },
    onError: (error) => {
      console.error("Failed to send forget password email", error);
    },
  });
};
