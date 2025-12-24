// hooks/useResetPasswordMutation.ts
import { api } from "@/shared/api/api-client";
import { useMutation } from "@tanstack/react-query";
import { ResetPasswordValues } from "../libs/type";


type ResetPasswordOptions = {
  onSuccess?: (data: any, variables: ResetPasswordValues) => void;
  onError?: (error: any, variables: ResetPasswordValues) => void;
};

export const useResetPasswordMutation = ({
  onSuccess,
  onError,
}: ResetPasswordOptions = {}) => {
  return useMutation({
    mutationFn: async (values: ResetPasswordValues) => {
      const response = await api.post("auth/reset-password", values, {
        requiresAuth: false, // المستخدم غير مسجل دخول
      });
      console.log("Reset password response:", response); // للتأكد من الاستجابة
      return response;
    },
    onSuccess: (data, variables) => {
      onSuccess?.(data, variables); // التوجيه أو الرسائل تظهر في الكومبوننت
    },
    onError: (error, variables) => {
      onError?.(error, variables);
    },
  });
};
