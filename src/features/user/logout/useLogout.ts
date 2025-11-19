import { useLogoutMutation } from "@/entities/user/state/mutations";

export const useLogout = () => {
  return useLogoutMutation();
};