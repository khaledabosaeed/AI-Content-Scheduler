"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { toast } from "sonner";
import { LoginCredentials } from "../libs/type";
import { useLoginMutation } from "../api/useLogin";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../libs/validation";

export default function StyledLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
  });
  const { mutate } = useLoginMutation();

  const onSubmit = (values: LoginCredentials) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Logged in successfully!");
        router.push("/chat");
      },
      onError: (err: any) => {
        toast.error(err?.message || "Login failed");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <Card className="w-full max-w-sm shadow-xl rounded-2xl bg-[hsl(var(--card))] text-card-background">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[hsl(var(--primary))]">
            !Welcome Back
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email */}
            <div className="flex flex-col text-end">
              <label className="font-medium text-text-primary">Email</label>
              <Input
                {...register("email")}
                placeholder="you@example.com"
                className="rounded-xl text-end bg-input text-text-primary"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col text-end">
              <label className="font-medium text-text-primary">Password</label>
              <Input
                type="password"
                {...register("password")}
                placeholder="•••••••"
                className="rounded-xl text-end bg-input text-text-primary"
              />
            </div>

            {/* Remember */}
            <div className="flex items-center justify-end gap-2">
              <Checkbox
                id="remember"
                checked={false}
                onCheckedChange={() => {}}
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-3 rounded-xl bg-[hsl(var(--primary))] text-primary-foreground transition-colors duration-500"
            >
              Sign In
            </Button>

            {/* Forgot */}
            <p className="text-center text-sm hover:underline text-text-primary">
              ?Forgot your password
            </p>
          </form>

          {/* Separator */}
          <div className="flex items-center gap-2 my-4 text-gray-400">
            <span className="flex-1 h-px bg-gray-300"></span>
            <span>or</span>
            <span className="flex-1 h-px bg-gray-300"></span>
          </div>

          {/* Social buttons */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={() =>
                (window.location.href = "/api/oauth/facebook/login")
              }
              variant="outline"
              className="w-full hover:bg-[hsl(var(--primary))] hover:text-primary-foreground transition-colors duration-500"
            >
              Sign in with Facebook
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm mt-2 text-text-primary">
            Don't have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-blue-600 font-medium cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
