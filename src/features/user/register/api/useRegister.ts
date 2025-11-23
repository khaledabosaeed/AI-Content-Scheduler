import { userKeys } from "@/entities/user/state/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { RegisterFormInputs } from "../libs/type";

type RegisterMutationOptions = {
  onSuccess?: (
    data: unknown,
    variables: RegisterFormInputs     ,
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      credentials: RegisterFormInputs & { rememberMe?: boolean }
    ) => {
      const response = await api.post("/auth/register", credentials, {
        requiresAuth: false,
      });
      console.log("REGISTER PAYLOAD:", response);
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