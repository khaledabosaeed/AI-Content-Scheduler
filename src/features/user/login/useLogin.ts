import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/state/keys";
import { loginUser } from "./libs/loginUser";
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data: any) => {
      console.log("Login success:", data);
      queryClient.setQueryData(userKeys.me(), data.user);
      queryClient.invalidateQueries(userKeys.all);
    },
  });
};