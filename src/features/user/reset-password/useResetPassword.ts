import { useResetMutation } from "@/entities/user/state/mutations";

export const useLogout = () => {
  return useResetMutation();
};