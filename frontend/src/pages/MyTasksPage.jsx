import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchMyTasks } from "../lib/tasks";

const STATUS_STYLES = {
  pending: "bg-gray-100 text-gray-700",
  "in-progress": "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
};

const PRIORITY_STYLES = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-red-100 text-red-700",
};

const MyTasksPage = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchMyTasks(token);
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [token]);

  return (
    <div className="max-w-2xl mx-auto pt-10 px-4 pb-10">
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← Back to Dashboard
      </Link>

      <h1 className="text-xl font-semibold text-gray-900 mt-4 mb-6">
        My Tasks
      </h1>

      {loading && (
        <p className="text-sm text-gray-500">Loading your tasks...</p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && tasks.length === 0 && (
        <p className="text-sm text-gray-500">
          No tasks assigned to you right now.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <div key={task._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-medium text-gray-900">{task.name}</h3>
              <div className="flex gap-1.5 shrink-0">
                <span
                  className={`text-xs px-2 py-0.5 rounded ${PRIORITY_STYLES[task.priority]}`}
                >
                  {task.priority}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLES[task.status]}`}
                >
                  {task.status}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span>Team: {task.team.name}</span>
              <span>Created by: {task.createdBy.username}</span>
            </div>
            <Link
              to={`/teams/${task.team._id}`}
              className="text-xs text-blue-600 hover:underline mt-2 inline-block"
            >
              Go to team →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTasksPage;
