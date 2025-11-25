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
      const response = await api.post("auth/login", credentials, {
        requiresAuth: false, // 🔥🔥 هاي أهم خطوة
      });

      return response;
    },

    onSuccess: (data, variables, context) => {
      console.log("LOGIN RESPONSE DATA:", data);
      queryClient.setQueryData(userKeys.me(), data?.user);

      queryClient.invalidateQueries({ queryKey: userKeys.all() });

      onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      onError?.(error, variables, context);
    },
  });
};
