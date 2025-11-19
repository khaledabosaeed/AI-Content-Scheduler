export const logoutUser = async () => {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Failed to logout");
  }
};