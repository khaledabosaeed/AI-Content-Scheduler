import { User } from "@/entities/user/type";


const useMock = true // للتيست فقط عبال ما يجهز الApi 

// --------------------- LOGIN ---------------------
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

// --------------------- LOGOUT ---------------------

export const logoutUser = async () => {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Failed to logout");
  }
};

// --------------------- REGISTER ---------------------

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

// --------------------- FORGOT PASSWORD ---------------------

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

// --------------------- RESET PASSWORD ---------------------

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

// --------------------- GET CURRENT USER ---------------------

export const getCurrentUser = async (): Promise<User> => {
  const response = await fetch("/api/auth/me", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  const data = await response.json();
  return data; // ترجع User object
};