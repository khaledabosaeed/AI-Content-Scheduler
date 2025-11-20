export type ResetPasswordPayload = {
  token: string; // الكود المؤقت اللي جالك بالإيميل
  newPassword: string;
};