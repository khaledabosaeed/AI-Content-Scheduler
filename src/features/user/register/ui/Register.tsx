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
import { FloatingIcons } from "../../../../shared/ui/floating-icons";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function StyledRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      onSuccess: () => {
        toast.success("Account created successfully!");
        router.push("/login");
      },
      onError: (err: any) => {
        toast.error(err?.message || "Registration failed"); // ✅ هنا التوست للخطأ
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[hsl(var(--background))]">
      {/* 👈 استخدام مكون الأيقونات العائمة */}
      <FloatingIcons />

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
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm text-foreground text-left">Email</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  // Applying register and error styles
                  className={`rounded-xl pl-10 h-12 bg-input border-2 ${
                    errors.email ? 'border-destructive' : 'border-input focus:border-primary'
                  } transition-colors text-left`}
                  dir="ltr"
                  {...register("email")}
                />
                {/* Icons position changed to right for LTR/English */}
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /> 
              </div>
              {/* Error message */}
              {errors.email && (
                <p className="text-xs text-destructive text-left">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm text-foreground text-left">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="•••••••"
                  // Applying register and error styles
                  className={`rounded-xl pl-10 pr-10 h-12 bg-input border-2 ${
                    errors.password
                      ? "border-destructive"
                      : "border-input focus:border-primary"
                  } transition-colors text-left`}
                  dir="ltr"
                  {...register("password")}
                />
                {/* Icons position changed for LTR/English */}
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                {/* Show/Hide Password Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {/* Error message */}
              {errors.password && (
                <p className="text-xs text-destructive text-left">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm text-foreground text-left">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="•••••••"
                  // Applying register and error styles
                  className={`rounded-xl pl-10 pr-10 h-12 bg-input border-2 ${
                    errors.password
                      ? "border-destructive"
                      : "border-input focus:border-primary"
                  } transition-colors text-left`}
                  dir="ltr"
                  {...register("password")}
                />
                {/* Icons position changed for LTR/English */}
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                {/* Show/Hide Password Button */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {/* Error message */}
              {errors.password && (
                <p className="text-xs text-destructive text-left">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2 justify-end">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
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
