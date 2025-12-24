"use client"

import type React from "react"
import { useState } from "react"
// Assuming correct paths for shadcn/ui components
import { Button } from "@/shared/components/ui/button" 
import { Input } from "@/shared/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Checkbox } from "@/shared/components/ui/checkbox"

// Import Icons and additional components
import { FloatingIcons } from "../../../../shared/ui/floating-icons" 
import { Mail, Lock, Eye, EyeOff } from "lucide-react" 

// Form and API Logic
import { yupResolver } from "@hookform/resolvers/yup"
import { loginSchema } from "../libs/validation" 
import { LoginCredentials } from "../libs/type" 
import { useForm } from "react-hook-form"
import { toast } from "sonner" 
import { useLoginMutation } from "../api/useLogin" // The actual API hook
import { useRouter } from "next/navigation"


export default function StyledLoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter(); 

  // useForm initialization with yupResolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  });

  // API Mutation Hook
  const { mutate, isPending } = useLoginMutation();

  // Combine form submitting state with API pending state
  const submitting = isFormSubmitting || isPending;

  // Actual submission function
  const onSubmit = (values: LoginCredentials) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Login successful!");
        router.push("/chat");
      },
      onError: (err: any) => {
        // Use your custom error handling logic
        const errorMessage = err?.response?.data?.message || "Login failed. Please check your credentials.";
        toast.error(errorMessage);
      },
    });
  };

const handleGoogleLogin = async () => {
  const res = await fetch("/api/auth/callback/google", {
    method: "GET",
  });

  const data = await res.json();

  if (data?.url) {
    window.location.href = data.url;
  }
};
return (
  <div
    className="min-h-screen bg-background flex items-center justify-center px-4 overflow-hidden"
    dir="ltr"
  >
    <FloatingIcons />

    <Card className="relative z-10 w-full max-w-md shadow-2xl rounded-3xl bg-background border-2 border-border/50">
      <CardHeader className="text-center space-y-2 pb-4">
        {/* Using primary color for icon background based on your theme */}
        <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-primary/50">
          <Lock className="w-8 h-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-3xl font-extrabold text-primary">
          Welcome Back!
        </CardTitle>
        <p className="text-sm text-muted-foreground">Sign in to continue</p>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm text-foreground text-left">
              Email
            </label>
            <div className="relative">
              <Input
                type="email"
                placeholder="you@example.com"
                // Applying register and error styles
                className={`rounded-xl pl-10 h-12 bg-input border-2 ${
                  errors.email
                    ? "border-destructive"
                    : "border-input focus:border-primary"
                } transition-colors text-left`}
                dir="ltr"
                {...register("email")}
              />
              {/* Icons position changed to right for LTR/English */}
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            {/* Error message */}
            {errors.email && (
              <p className="text-xs text-destructive text-left">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
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

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-sm text-foreground cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <button
              onClick={() => router.push("/forget-password")}
              type="button"
              className="text-sm text-primary font-medium hover:underline transition-colors"
            >
              Forgot your password?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-[hsl(var(--primary))] hover:bg-primary hover:text-background text-primary-foreground font-semibold shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.01]"
            disabled={submitting}
          >
            {submitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-6">
          <span className="flex-1 h-px bg-divider"></span>
          <span className="text-sm text-muted-foreground">OR</span>
          <span className="flex-1 h-px bg-divider"></span>
        </div>

        {/* Social Button (Facebook) */}
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/api/auth/google")}
          className="w-full h-12 rounded-xl border-2 border-border hover:bg-muted/50 hover:border-primary transition-all duration-300 font-medium bg-transparent text-foreground"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.41 17.74 9.5 24 9.5z"
            />{" "}
            <path
              fill="#4285F4"
              d="M46.5 24c0-1.64-.15-3.22-.43-4.75H24v9.02h12.7c-.55 2.96-2.2 5.48-4.7 7.18l7.27 5.65C43.98 36.82 46.5 30.96 46.5 24z"
            />{" "}
            <path
              fill="#FBBC05"
              d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"
            />{" "}
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.9-5.78l-7.27-5.65c-2.02 1.36-4.6 2.16-8.63 2.16-6.26 0-11.57-3.91-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />{" "}
          </svg>
          Sign in with Google
        </Button>

        {/* Sign Up Link */}
        <p className="text-center text-sm mt-6 text-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-primary font-semibold hover:underline transition-colors"
          >
            Sign Up
          </button>
        </p>
      </CardContent>
    </Card>
  </div>
);
}