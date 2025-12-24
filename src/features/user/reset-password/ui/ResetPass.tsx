"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import { resetPasswordSchema } from "../libs/validation";
import { useResetPasswordMutation } from "../api/useRestPass";

type ResetPasswordForm = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // ⚡ نحتفظ بالتوكن في state بعد mount
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: yupResolver(resetPasswordSchema),
  });

  // قراءة التوكن بعد mount
  useEffect(() => {
    const t = searchParams.get("token");
    if (!t) {
      toast.error("Reset token missing");
      router.push("/forget-password");
    } else {
      setToken(t);
      console.log("Token from URL:", t); // للتأكد
    }
  }, [searchParams, router]);

  const { mutate ,isPending } = useResetPasswordMutation();

  const onSubmit = (values: ResetPasswordForm) => {
    if (!token) {
      toast.error("Reset token missing");
      return;
    }

    mutate(
    { token, password: values.password,confirmPassword:values.confirmPassword },
    {
      onSuccess: (data) => {
        if (data.success) {
          toast.success("Password reset successful!");
          router.push("/login");
        } else {
          toast.error(data.error || "Failed to reset password");
        }
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }
  );
  };

  // const onSubmit = async (values: ResetPasswordForm) => {
  //   if (!token) {
  //     toast.error("Reset token missing");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const res = await fetch("/api/auth/reset-password", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ token, password: values.password }),
  //     });

  //     const data = await res.json();
  //     if (res.ok && data.success) {
  //       toast.success("Password reset successful!");
  //       router.push("/login");
  //     } else {
  //       toast.error(data.error || "Failed to reset password");
  //     }
  //   } catch (err) {
  //     toast.error("Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 overflow-hidden">
      <Card className="relative z-10 w-full max-w-md shadow-2xl rounded-3xl bg-background border-2 border-border/50">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-primary/50">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-primary">
            Reset Password
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your new password
          </p>
        </CardHeader>

        <CardContent>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
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

            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm text-foreground text-left">
                Confirm Password
              </label>

              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="•••••••"
                  className={`rounded-xl pl-10 pr-10 h-12 bg-input border-2 ${
                    errors.confirmPassword
                      ? "border-destructive"
                      : "border-input focus:border-primary"
                  } transition-colors text-left`}
                  dir="ltr"
                  {...register("confirmPassword")}
                />

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

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

              {errors.confirmPassword && (
                <p className="text-xs text-destructive text-left">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !token} // تمنع الإرسال بدون توكن
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/30"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
