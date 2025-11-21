import { api } from "@/shared/api/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginCredentials } from "../libs/type";
import { userKeys } from "@/entities/user/state/keys";



type LoginMutationOptions = {
  onSuccess?: (
    data: unknown,
    variables: LoginCredentials,
    context: unknown
  ) => void;
  onError?: (
    error: Error,
    variables: LoginCredentials,
    context: unknown
  ) => void;
};

export const useLoginMutation = ({
  onSuccess,
  onError,
}: LoginMutationOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      credentials: LoginCredentials & { rememberMe?: boolean }
    ) => {
      const response = await api.post("auth/login", credentials);

      // const token = (response as any).data.token || (response as any).token;
      return response;
    },
    onSuccess: (data, variables, context) => {
      // 1️⃣ تحديث الـ cache مباشرة
      queryClient.setQueryData(userKeys.me(), (old: unknown) => (data?.user ?? old) as unknown);

      // 2️⃣ إعادة fetch لأي query يعتمد على بيانات المستخدم
      queryClient.invalidateQueries({ queryKey: userKeys.all() });
      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (onError) {
        onError(error, variables, context);
      }
    },
  });
};