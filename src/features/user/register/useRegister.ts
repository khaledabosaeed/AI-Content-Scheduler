import { userKeys } from "@/entities/user/state/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUser } from "./libs/registerUser";
import { api } from "@/shared/api/api-client";

// export const useLogout = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: registerUser,
//     onSuccess: (data: any) => {
//       queryClient.setQueryData(userKeys.me(), data.user);
//       queryClient.invalidateQueries(userKeys.all());
//     },
//   });
// };

type LoginCredentials = {
  name: string;
  email: string;
  password: string;
};

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
      queryClient.setQueryData(["currentUser"], data.user);

      // 2️⃣ إعادة fetch لأي query يعتمد على بيانات المستخدم
      queryClient.invalidateQueries(["currentUser"]);
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