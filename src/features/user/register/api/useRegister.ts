import { userKeys } from "@/entities/user/state/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { LoginCredentials } from "../libs/type";

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


export const useRegisterMutation = ({
  onSuccess,
  onError,
}: LoginMutationOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      credentials: LoginCredentials & { rememberMe?: boolean }
    ) => {
      const response = await api.post("auth/register", credentials, {
        requiresAuth: false,
      });
      return response;
    },
    onSuccess: (data, variables, context) => {
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