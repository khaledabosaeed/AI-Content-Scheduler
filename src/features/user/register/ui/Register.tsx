"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../libs/validation";
import { useRegisterMutation } from "../api/useRegister";
import Link from "next/link";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
    resolver: yupResolver(registerSchema),
  });

  const { mutate, isPending, error, data } = useRegisterMutation();

  const onSubmit = (values: LoginCredentials) => {
    const {...payload } = values
    console.log(payload)
    mutate(values, {
      onSuccess: (data) => console.log("Register success:", data),
      onError: (err) => console.error("Register failed:", err),
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-secondary/10 via-background to-primary/10 dark:from-secondary/5 dark:via-background dark:to-primary/5 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Glass Card */}
        <div className="bg-background/95 dark:bg-background-paper/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8 md:p-10 space-y-6">

          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-secondary to-secondary/70 shadow-xl shadow-secondary/30 mb-3">
              <svg className="w-10 h-10 text-secondary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              انضم إلينا
            </h1>
            <p className="text-text-secondary text-sm">
              ابدأ جدولة محتواك بسهولة
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-foreground">
                الاسم الكامل
              </label>
              <input
                id="name"
                type="text"
                placeholder="أحمد محمد"
                className="w-full px-4 py-4 bg-background border-2 border-border hover:border-secondary/50 focus:border-secondary rounded-xl focus:outline-none focus:ring-4 focus:ring-secondary/20 transition-all duration-200 text-foreground placeholder:text-text-disabled"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-foreground">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-4 bg-background border-2 border-border hover:border-secondary/50 focus:border-secondary rounded-xl focus:outline-none focus:ring-4 focus:ring-secondary/20 transition-all duration-200 text-foreground placeholder:text-text-disabled"
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
                placeholder="كلمة مرور قوية"
                className="w-full px-4 py-4 bg-background border-2 border-border hover:border-secondary/50 focus:border-secondary rounded-xl focus:outline-none focus:ring-4 focus:ring-secondary/20 transition-all duration-200 text-foreground placeholder:text-text-disabled"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
                تأكيد كلمة المرور
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="أعد إدخال كلمة المرور"
                className="w-full px-4 py-4 bg-background border-2 border-border hover:border-secondary/50 focus:border-secondary rounded-xl focus:outline-none focus:ring-4 focus:ring-secondary/20 transition-all duration-200 text-foreground placeholder:text-text-disabled"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 px-6 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground font-bold rounded-xl shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              {isPending ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
            </button>

            {/* Messages */}
            {error && (
              <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-4">
                <p className="text-destructive text-sm font-semibold">{(error as Error).message}</p>
              </div>
            )}

            {data && (
              <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4">
                <p className="text-primary text-sm font-semibold">تم إنشاء الحساب بنجاح!</p>
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
                لديك حساب بالفعل؟
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            href="/login"
            className="block w-full text-center py-4 px-6 border-2 border-border hover:border-secondary/60 hover:bg-secondary/5 text-foreground font-semibold rounded-xl transition-all duration-300"
          >
            تسجيل الدخول
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-text-secondary text-sm mt-6">
          بالتسجيل، أنت توافق على الشروط والأحكام
        </p>
      </div>
    </div>
  );
}
