import { apiRequest } from "./api";

export const searchUsers = async (query, token) => {
  const data = await apiRequest(
    `/auth/users?search=${encodeURIComponent(query)}`,
    { method: "GET" },
    token,
  );
  return data.users;
};
