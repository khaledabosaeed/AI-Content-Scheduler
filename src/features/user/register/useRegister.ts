import { userKeys } from "@/entities/user/state/keys";
import { useRegisterMutation } from "@/entities/user/state/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUser } from "./libs/registerUser";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data: any) => {
      queryClient.setQueryData(userKeys.me(), data.user);
      queryClient.invalidateQueries(userKeys.all());
    },
  });
};