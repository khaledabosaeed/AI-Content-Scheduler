"use client";

import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/features/user/login/api/useLogin";
import { loginSchema } from "@/features/user/login/libs/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginCredentials } from "../libs/type";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
  });

  const { mutate, isLoading, error, data } = useLoginMutation({
    onSuccess: (data) => console.log("Login success:", data),
    onError: (error) => console.error("Login failed:", error),
  });

  // 2. إرسال البيانات عند submit
  const onSubmit = (values: LoginCredentials) => {
    const {...payload } = values
    console.log(values)
    mutate(values);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 w-full max-w-sm"
    >
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
      {errors.password && (
        <p className="text-red-500">{errors.password.message}</p>
      )}

      <button className="bg-black text-white py-2 rounded" disabled={isLoading}>
        {isLoading ? "Loading..." : "Login"}
      </button>

      {error && <p className="text-red-500">{(error as Error).message}</p>}
      {data && <p className="text-green-500">Login successful!</p>}
    </form>
  );
}
