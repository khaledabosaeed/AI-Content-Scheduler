import { useResetMutation } from "@/entities/user/state/mutations";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordUser } from "./libs/resetPasswordUser";

export const useRest = () => {
   return useMutation({
    mutationFn: resetPasswordUser,
  });
};