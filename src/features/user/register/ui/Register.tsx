"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../libs/validation";
import { useRegisterMutation } from "../api/useRegister";
import { LoginCredentials } from "../libs/type";



export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
    resolver: yupResolver(registerSchema),
  });

  const { mutate, isLoading, error, data } = useRegisterMutation();

  const onSubmit = (values: LoginCredentials) => {
    const {...payload } = values
    console.log(payload)
    mutate(values, {
      onSuccess: (data) => console.log("Register success:", data),
      onError: (err) => console.error("Register failed:", err),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full max-w-sm">
      <input
        type="text"
        placeholder="Name"
        className="border p-2 rounded"
        {...register("name")}
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

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

      <input
        type="password"
        placeholder="Confirm Password"
        className="border p-2 rounded"
        {...register("confirmPassword")}
      />
      {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}

      <button
        className="bg-black text-white py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Register"}
      </button>

      {error && <p className="text-red-500">{(error as Error).message}</p>}
      {data && <p className="text-green-500">Register successful!</p>}
    </form>
  );
}
