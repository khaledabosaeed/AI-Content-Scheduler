import { useLoginMutation } from "@/entities/user/state/mutations";

export const useLogin = () => {
  return useLoginMutation();
};