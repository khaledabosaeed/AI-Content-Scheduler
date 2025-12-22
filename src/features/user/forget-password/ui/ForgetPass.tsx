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
import { FloatingIcons } from "../../../../shared/ui/floating-icons";
import { Mail, Lock } from "lucide-react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { forgotPasswordSchema } from "../libs/validation"; 
import { ForgotPasswordValues } from "../libs/type"; 
import { useForgotPasswordMutation } from "../api/useForget";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const { mutate, isPending } = useForgotPasswordMutation();

  const onSubmit = (values: ForgotPasswordValues) => {
      setLoading(true);
      mutate(values, {
        onSuccess: (data) => {
          toast.success("If the email exists, a reset link was sent.");
          // نستخدم token لتوجيه المستخدم مباشرة للـ Reset Password
          router.push(`/reset-password?token=${data.token}`);
          setLoading(false);  
        },
        onError: (err: any) => {
          // Use your custom error handling logic
          const errorMessage = err?.response?.data?.message || "Something went wrong";
          toast.error(errorMessage);
        },
      });
    };


//   const onSubmit = async (values: ForgotPasswordValues) => {
//   try {
//     const res = await fetch("/api/auth/forget-password", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(values),
//     });
//     const data = await res.json();

//     if (res.ok && data.success) {
      
//     } else {
      
//     }
//   } catch {
//     toast.error("Something went wrong");
//   } finally {
//     setLoading(false);
//   }
// };


  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 overflow-hidden">
      <FloatingIcons />

      <Card className="relative z-10 w-full max-w-md shadow-2xl rounded-3xl bg-background border-2 border-border/50">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-primary/50">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-primary">
            Forgot Password
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your email and we’ll send you a reset link
          </p>
        </CardHeader>

        <CardContent>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm text-foreground text-left">
                Email
              </label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className={`rounded-xl pl-10 h-12 bg-input border-2 ${
                    errors.email
                      ? "border-destructive"
                      : "border-input focus:border-primary"
                  }`}
                  {...register("email")}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/30"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            {/* Back to Login */}
            <p className="text-center text-sm text-foreground">
              Remembered your password?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-primary font-semibold hover:underline"
              >
                Back to Login
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
