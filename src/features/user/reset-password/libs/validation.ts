import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";


export const resetPasswordSchema = Yup.object({
  newPassword: Yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
}).required();