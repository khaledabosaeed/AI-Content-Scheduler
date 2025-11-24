"use client";

import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/features/user/login/api/useLogin";
import { loginSchema } from "@/features/user/login/libs/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginCredentials } from "../libs/type";
import Link from "next/link";
import { useState } from "react";
import ChatInterface from "@/features/chat/ChatInterface";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
  });

  const { mutate, isPending, error, data } = useLoginMutation({
    onSuccess: (data) => console.log("Login success:", data),
    onError: (error) => console.error("Login failed:", error),
  });

  const onSubmit = (values: LoginCredentials) => {
    const {...payload } = values
    console.log(values)
    mutate(values);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/5 dark:via-background dark:to-secondary/5 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Glass Card */}
        <div className="bg-background/95 dark:bg-background-paper/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8 md:p-10 space-y-8">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 shadow-xl shadow-primary/30 mb-3">
              <svg
                className="w-10 h-10 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-text-secondary text-sm">
              Sign in to your content scheduling platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-foreground"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-4 bg-background border-2 border-border hover:border-primary/50 focus:border-primary rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-text-disabled"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-destructive text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-4 py-4 bg-background border-2 border-border hover:border-primary/50 focus:border-primary rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-text-disabled"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M15.171 13.576l1.414 1.414A6.981 6.981 0 0018.528 11c-1.274-4.057-5.064-7-9.528-7a6.998 6.998 0 00-1.528.161l2.117 2.117a4 4 0 015.771 5.771z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold rounded-xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>

            {/* Messages */}
            {error && (
              <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-4">
                <p className="text-destructive text-sm font-semibold">
                  {(error as Error).message}
                </p>
              </div>
            )}

            {data && (
              <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4">
                <p className="text-primary text-sm font-semibold">
                  Signed in successfully!
                </p>
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-background-paper text-text-secondary font-medium text-sm">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            href="/register"
            className="block w-full text-center py-4 px-6 border-2 border-border hover:border-primary/60 hover:bg-primary/5 text-foreground font-semibold rounded-xl transition-all duration-300"
          >
            Create New Account
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-text-secondary text-sm mt-6">
          ⚡ Powered by AI
        </p>
      </div>
      {error && <p className="text-red-500">{(error as Error).message}</p>}
      {data && <ChatInterface />}
    </div>
  );
}
