
const useMock = true // للتيست فقط عبال ما يجهز الApi 
export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  if (useMock) {
    console.log("Login payload:", { email, password });
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          user: { id: 1, username: "Razan", email, role: "user", createdAt: new Date().toISOString() },
          token: "mock-token-123",
        });
      }, 500)
    );
  }

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Failed to login");
  return await response.json();
};