import { useMutation } from "@tanstack/react-query";
import { forgotPasswordUser } from "./libs/forgetPasswordUser";

export const useForget = () => {
  return useMutation({
    mutationFn: forgotPasswordUser,
  });
};