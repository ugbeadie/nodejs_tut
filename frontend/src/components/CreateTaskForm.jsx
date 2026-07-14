import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createTask } from "../lib/tasks";

export const CreateTaskForm = ({ team, onCreated }) => {
  const { token, user } = useAuth();
  const canAssignOthers = team.owner._id === user._id || user.role === "admin";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState(canAssignOthers ? "" : user._id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const task = await createTask(
        {
          name,
          description,
          priority,
          teamId: team._id,
          assignedTo: canAssignOthers ? assignedTo : user._id,
        },
        token,
      );
      setName("");
      setDescription("");
      setPriority("medium");
      setAssignedTo(canAssignOthers ? "" : user._id);
      onCreated(task);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 border border-gray-200 rounded-lg p-4"
    >
      <input
        type="text"
        placeholder="Task name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows={3}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="low">Low priority</option>
        <option value="medium">Medium priority</option>
        <option value="high">High priority</option>
      </select>

      {canAssignOthers ? (
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Assign to...
          </option>
          {team.members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.username}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-sm text-gray-500">
          This task will be assigned to you.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
};
