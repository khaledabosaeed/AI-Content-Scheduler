import { api } from "@/shared/api/api-client";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordValues } from "../libs/type";

type ForgotPasswordOptions = {
  onSuccess?: (data: any, variables: ForgotPasswordValues) => void;
  onError?: (error: any, variables: ForgotPasswordValues) => void;
};

export const useForgotPasswordMutation = ({
  onSuccess,
  onError,
}: ForgotPasswordOptions = {}) => {
  return useMutation({
    mutationFn: async (values: ForgotPasswordValues) => {
      const response = await api.post("auth/forget-password", values, {
        requiresAuth: false, // مهم لأنه المستخدم غير مسجل دخول
      });
      console.log("Forgot password response:", response); // للتأكد من الاستجابة
      return response;
    },
    onSuccess: (data, variables) => {
      onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      onError?.(error, variables);
    },
  });
};
