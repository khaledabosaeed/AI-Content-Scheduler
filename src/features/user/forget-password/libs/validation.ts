import * as yup from "yup"

// Forgot Password validation schema
export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
})
