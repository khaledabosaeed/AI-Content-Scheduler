"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useLoginMutation } from "@/features/user/login/useLogin";

// 1. تعريف سكيم الفاليديشين باستخدام Yup
const loginSchema = Yup.object({
  email: Yup.string()
    .email("Email is invalid")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
}).required();

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const { mutate, isLoading, error, data } = useLoginMutation({
    onSuccess: (data) => console.log("Login success:", data),
    onError: (error) => console.error("Login failed:", error),
  });

  // 2. إرسال البيانات عند submit
  const onSubmit = (values: LoginFormInputs) => {
    mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full max-w-sm">
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        {...register("email")}
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        {...register("password")}
      />
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}

      <button
        className="bg-black text-white py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Login"}
      </button>

      {error && <p className="text-red-500">{(error as Error).message}</p>}
      {data && <p className="text-green-500">Login successful!</p>}
    </form>
  );
}
