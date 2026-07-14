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

export const updateTask = async (taskId, updates, token) => {
  const data = await apiRequest(
    `/tasks/update/${taskId}`,
    { method: "PATCH", body: JSON.stringify(updates) },
    token,
  );
  return data.task;
};

export const deleteTask = async (taskId, token) => {
  await apiRequest(`/tasks/delete/${taskId}`, { method: "DELETE" }, token);
};

export const reassignTask = async (taskId, assignedTo, token) => {
  const data = await apiRequest(
    `/tasks/${taskId}/reassign`,
    { method: "PATCH", body: JSON.stringify({ assignedTo }) },
    token,
  );
  return data.task;
};

export const updateTaskStatus = async (taskId, status, token) => {
  const data = await apiRequest(
    `/tasks/${taskId}/status`,
    { method: "PATCH", body: JSON.stringify({ status }) },
    token,
  );
  return data.task;
};
