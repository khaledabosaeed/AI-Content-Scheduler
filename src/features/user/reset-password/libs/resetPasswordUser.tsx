export const resetPasswordUser = async (payload: {
  token: string;
  newPassword: string;
}) => {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to reset password");
  }

  return await response.json();
};