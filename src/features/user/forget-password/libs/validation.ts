import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

export const forgotPasswordSchema = Yup.object({
  email: Yup.string().email("Email is invalid").required("Email is required"),
}).required();