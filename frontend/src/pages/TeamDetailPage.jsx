import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchTeamById } from "../lib/teams";
import { fetchTeamTasks } from "../lib/tasks";
import { MemberList } from "../components/MemberList";
import { AddMemberForm } from "../components/AddMemberForm";
import { TransferMemberForm } from "../components/TransferMemberForm";
import { TaskList } from "../components/TaskList";
import { CreateTaskForm } from "../components/CreateTaskForm";

const TeamDetailPage = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskFilter, setTaskFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState("");
  const [tasksError, setTasksError] = useState("");

  useEffect(() => {
    const loadTeam = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchTeamById(id, token);
        setTeam(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, [id, token]);

  useEffect(() => {
    const loadTasks = async () => {
      setTasksLoading(true);
      setTasksError("");
      try {
        const data = await fetchTeamTasks(id, token);
        setTasks(data);
      } catch (err) {
        setTasksError(err.message);
      } finally {
        setTasksLoading(false);
      }
    };

    loadTasks();
  }, [id, token]);

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)),
    );
  };

  const handleTaskDeleted = (taskId) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  if (loading)
    return (
      <p className="text-sm text-gray-500 mt-10 text-center">Loading team...</p>
    );
  if (error)
    return <p className="text-sm text-red-600 mt-10 text-center">{error}</p>;
  if (!team) return null;

  const isAdmin = user.role === "admin";
  const canManageMembers = team.owner._id === user._id || isAdmin;
  const visibleTasks =
    taskFilter === "mine"
      ? tasks.filter((t) => t.assignedTo._id === user._id)
      : tasks;

  return (
    <div className="max-w-2xl mx-auto pt-10 px-4 pb-10">
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← Back to Dashboard
      </Link>

      <h1 className="text-xl font-semibold text-gray-900 mt-4 mb-6">
        {team.name}
      </h1>

      <MemberList
        team={team}
        onMemberRemoved={setTeam}
        canManage={canManageMembers}
      />

      {canManageMembers && (
        <AddMemberForm teamId={team._id} onMemberAdded={setTeam} />
      )}

      {isAdmin && <TransferMemberForm team={team} onTransferred={setTeam} />}

      <div className="mt-10 pt-6 border-t border-gray-200">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Create Task</h2>
        <CreateTaskForm team={team} onCreated={handleTaskCreated} />
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setTaskFilter("all")}
            className={`text-sm px-3 py-1.5 rounded-md ${taskFilter === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setTaskFilter("mine")}
            className={`text-sm px-3 py-1.5 rounded-md ${taskFilter === "mine" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}
          >
            My Tasks
          </button>
        </div>

        {tasksLoading && (
          <p className="text-sm text-gray-500">Loading tasks...</p>
        )}
        {tasksError && <p className="text-sm text-red-600">{tasksError}</p>}

        {!tasksLoading && !tasksError && (
          <TaskList
            tasks={visibleTasks}
            team={team}
            onUpdated={handleTaskUpdated}
            onDeleted={handleTaskDeleted}
          />
        )}
      </div>
    </div>
  );
};

export default TeamDetailPage;
