import { apiRequest } from "./api";

export const fetchMyTeams = async (token) => {
  const data = await apiRequest("/teams/my-teams", { method: "GET" }, token);
  return data.teams;
};

export const fetchAllTeams = async (token) => {
  const data = await apiRequest("/teams/all", { method: "GET" }, token);
  return data.teams;
};

export const fetchTeamById = async (id, token) => {
  const data = await apiRequest(`/teams/${id}`, { method: "GET" }, token);
  return data.team;
};

export const createTeam = async (name, token) => {
  const data = await apiRequest(
    "/teams/create",
    { method: "POST", body: JSON.stringify({ name }) },
    token,
  );
  return data.team;
};

export const addMember = async (teamId, userId, token) => {
  const data = await apiRequest(
    `/teams/${teamId}/add-member`,
    { method: "POST", body: JSON.stringify({ userId }) },
    token,
  );
  return data.team;
};
