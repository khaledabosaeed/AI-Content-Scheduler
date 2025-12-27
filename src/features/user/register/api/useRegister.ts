import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { RegisterFormInputs } from "../libs/type";

type RegisterMutationOptions = {
  onSuccess?: (
    data: unknown,
    variables: RegisterFormInputs,
    context: unknown
  ) => void;
  onError?: (
    error: Error,
    variables: RegisterFormInputs,
    context: unknown
  ) => void;
};

export const useRegisterMutation = ({
  onSuccess,
  onError,
}: RegisterMutationOptions = {}) => {
  return useMutation({
    mutationFn: async (
      credentials: RegisterFormInputs & { rememberMe?: boolean }
    ) => {
      const response = await api.post("auth/register", credentials, {
        requiresAuth: false,
      });
      return response;
    },
    onSuccess: (data, variables, context) => {
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