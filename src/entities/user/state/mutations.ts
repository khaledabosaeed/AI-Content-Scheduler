"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "./keys";
import {
  loginUser,
  logoutUser,
  registerUser,
  forgotPasswordUser,
  resetPasswordUser,
} from "@/services/userService";

// LOGIN ---------------------
export const useLoginMutation = () => {
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

// LOGOUT ---------------------
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries(userKeys.me());
      queryClient.invalidateQueries(userKeys.all);
    },
  });
};

// REGISTER ---------------------
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data: any) => {
      queryClient.setQueryData(userKeys.me(), data.user);
      queryClient.invalidateQueries(userKeys.all());
    },
  });
};

// FORGOT PASSWORD ---------------------
export const useForgetMutation = () => {
  return useMutation({
    mutationFn: forgotPasswordUser,
  });
};

// RESET PASSWORD ---------------------
export const useResetMutation = () => {
  return useMutation({
    mutationFn: resetPasswordUser,
  });
};
