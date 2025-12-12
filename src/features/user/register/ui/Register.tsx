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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../libs/validation";
import { RegisterFormInputs } from "../libs/type";
import { useRegisterMutation } from "../api/useRegister";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function StyledRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(registerSchema),
  });

  const { mutate, isPending, error, data } = useRegisterMutation();

  const onSubmit = (values: RegisterFormInputs) => {
    mutate(values, {
      
      onSuccess: () =>{
        toast.success("Account created successfully!"); 
        router.push("/login")
      },
      onError: (err: any) => {
        toast.error(err?.message || "Registration failed"); // ✅ هنا التوست للخطأ
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[hsl(var(--background))]">
      <Card className="w-full max-w-md rounded-2xl shadow-xl backdrop-blur-xl bg-[hsl(var(--paper)/90)] border border-[hsl(var(--border)/50)]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[hsl(var(--primary))]">
            Create Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Full Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-[hsl(var(--foreground))] text-end">
                Full Name
              </label>
              <Input
                placeholder="John Doe"
                {...register("name")}
                className="rounded-xl bg-[hsl(var(--input))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--text-disabled))] text-end"
              />
              {errors.name && (
                <p className="text-sm text-[hsl(var(--destructive))]">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-[hsl(var(--foreground))] text-end">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="rounded-xl bg-[hsl(var(--input))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--text-disabled))] text-end"
              />
              {errors.email && (
                <p className="text-sm text-[hsl(var(--destructive))]">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-[hsl(var(--foreground))] text-end">
                Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="•••••••"
                {...register("password")}
                className="rounded-xl bg-[hsl(var(--input))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--text-disabled))] text-end"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-2/3 -translate-y-1/2 text-text-secondary hover:text-foreground transition-colors"
              >
                {" "}
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    {" "}
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />{" "}
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />{" "}
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    {" "}
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />{" "}
                    <path d="M15.171 13.576l1.414 1.414A6.981 6.981 0 0018.528 11c-1.274-4.057-5.064-7-9.528-7a6.998 6.998 0 00-1.528.161l2.117 2.117a4 4 0 015.771 5.771z" />{" "}
                  </svg>
                )}{" "}
              </button>
              {errors.password && (
                <p className="text-sm text-[hsl(var(--destructive))]">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-[hsl(var(--foreground))] text-end">
                Confirm Password
              </label>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="•••••••"
                {...register("confirmPassword")}
                className="rounded-xl bg-[hsl(var(--input))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--text-disabled))] text-end"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-2/3 -translate-y-1/2 text-text-secondary hover:text-foreground transition-colors"
              >
                {" "}
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    {" "}
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />{" "}
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />{" "}
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    {" "}
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />{" "}
                    <path d="M15.171 13.576l1.414 1.414A6.981 6.981 0 0018.528 11c-1.274-4.057-5.064-7-9.528-7a6.998 6.998 0 00-1.528.161l2.117 2.117a4 4 0 015.771 5.771z" />{" "}
                  </svg>
                )}{" "}
              </button>
              {errors.confirmPassword && (
                <p className="text-sm text-[hsl(var(--destructive))]">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2 justify-end">
              <Checkbox
                id="remember"
                checked={false}
                onCheckedChange={() => {}}
              />
              <label
                htmlFor="remember"
                className="text-sm text-[hsl(var(--foreground))]"
              >
                Remember me
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-3 bg-[hsl(var(--primary))] hover:text-[hsl(var(--foreground))] text-[hsl(var(--primary-foreground))] rounded-xl shadow-md hover:shadow-lg transition-all duration-500"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Account"}
            </Button>
            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[hsl(var(--border))]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-[hsl(var(--paper))] text-[hsl(var(--text-secondary))] font-medium text-sm">
                  ?Already have an account
                </span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              href="/login"
              className="block w-full text-center py-3 px-6 border-2 border-[hsl(var(--border))] hover:border-[hsl(var(--secondary)/60)] hover:bg-[hsl(var(--secondary)/10)] text-[hsl(var(--foreground))] font-semibold rounded-xl transition-all duration-300"
            >
              Sign In
            </Link>

            {/* Error / Success messages */}
            {error && (
              <p className="text-sm text-[hsl(var(--destructive))]">
                {(error as Error).message}
              </p>
            )}
            {data && (
              <p className="text-sm text-[hsl(var(--primary))]">
                Account created successfully!
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
