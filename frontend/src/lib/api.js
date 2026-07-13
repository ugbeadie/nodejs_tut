const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiRequest = async (endpoint, options = {}, token) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }

  return data;
};
