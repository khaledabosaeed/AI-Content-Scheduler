import { userKeys } from "@/entities/user/state/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "./libs/logoutUser";

export const useLogout = () => {
   const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries(userKeys.me());
      queryClient.invalidateQueries(userKeys.all);
    },
  });
};