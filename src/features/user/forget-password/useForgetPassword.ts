import { useForgetMutation } from "@/entities/user/state/mutations";

export const useLogout = () => {
  return useForgetMutation();
};