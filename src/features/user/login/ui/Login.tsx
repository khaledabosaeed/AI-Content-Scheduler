"use client";

import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/features/user/login/api/useLogin";
import { loginSchema } from "@/features/user/login/libs/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginCredentials } from "../libs/type";
import Link from "next/link";

export default function LoginForm() {
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
              <svg className="w-10 h-10 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              مرحباً بعودتك
            </h1>
            <p className="text-text-secondary text-sm">
              سجل دخولك إلى منصة جدولة المحتوى
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-foreground">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-4 bg-background border-2 border-border hover:border-primary/50 focus:border-primary rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-text-disabled"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-foreground">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                className="w-full px-4 py-4 bg-background border-2 border-border hover:border-primary/50 focus:border-primary rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-text-disabled"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold rounded-xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>

            {/* Messages */}
            {error && (
              <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-4">
                <p className="text-destructive text-sm font-semibold">{(error as Error).message}</p>
              </div>
            )}

            {data && (
              <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4">
                <p className="text-primary text-sm font-semibold">تم تسجيل الدخول بنجاح!</p>
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
                ليس لديك حساب؟
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            href="/register"
            className="block w-full text-center py-4 px-6 border-2 border-border hover:border-primary/60 hover:bg-primary/5 text-foreground font-semibold rounded-xl transition-all duration-300"
          >
            إنشاء حساب جديد
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-text-secondary text-sm mt-6">
          ⚡ مدعوم بالذكاء الاصطناعي
        </p>
      </div>
    </div>
  );
}
