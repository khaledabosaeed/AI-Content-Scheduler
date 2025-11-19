export const forgotPasswordUser = async (payload: { email: string }) => {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to send reset email");
  }

  return await response.json();
};