import { apiRequest } from "./api";

export const fetchTeamTasks = async (teamId, token) => {
  const data = await apiRequest(
    `/tasks/team/${teamId}`,
    { method: "GET" },
    token,
  );
  return data.tasks;
};

export const createTask = async (taskData, token) => {
  const data = await apiRequest(
    "/tasks/create",
    { method: "POST", body: JSON.stringify(taskData) },
    token,
  );
  return data.task;
};
