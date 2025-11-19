const useMock = true // للتيست فقط عبال ما يجهز الApi 

export const registerUser = async ({ username, email, password }: { username: string; email: string; password: string }) => {
  if (useMock) {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          user: { id: 2, username, email, role: "user", createdAt: new Date().toISOString() },
          token: "mock-token-456",
        });
      }, 500)
    );
  }

  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) throw new Error("Failed to register");
  return await response.json();
};