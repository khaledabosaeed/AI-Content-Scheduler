import * as Yup from "yup";

export const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Name can only contain letters and spaces"
    )
    .required("Name is required"),

  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .lowercase()
    .max(100, "Email must not exceed 100 characters")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    )
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .test(
      "no-spaces",
      "Password cannot contain spaces",
      (value) => !value || !/\s/.test(value)
    )
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
}).required();
