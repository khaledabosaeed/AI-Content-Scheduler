export const getCurrentUser = async ()=> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  const data = await response.json();
  return data; // ترجع User object
};