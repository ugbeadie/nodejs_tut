import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  updateTask,
  deleteTask,
  reassignTask,
  updateTaskStatus,
} from "../lib/tasks";

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

export const TaskCard = ({ task, team, onUpdated, onDeleted }) => {
  const { token, user } = useAuth();

  const isCreator = task.createdBy._id === user._id;
  const isTeamOwner = team.owner._id === user._id;
  const isAdmin = user.role === "admin";
  const isAssignee = task.assignedTo._id === user._id;

  const canEdit = isCreator || isTeamOwner || isAdmin;
  const canDelete = isCreator || isAdmin;
  const canReassign = isTeamOwner || isAdmin;
  const canUpdateStatus = isAssignee || isAdmin;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(task.name);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const [reassignTo, setReassignTo] = useState("");
  const [reassigning, setReassigning] = useState(false);
  const [reassignError, setReassignError] = useState("");

  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError("");
    setSavingEdit(true);
    try {
      const updated = await updateTask(
        task._id,
        {
          name: editName,
          description: editDescription,
          priority: editPriority,
        },
        token,
      );
      onUpdated(updated);
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleReassign = async (e) => {
    e.preventDefault();
    setReassignError("");
    setReassigning(true);
    try {
      const updated = await reassignTask(task._id, reassignTo, token);
      onUpdated(updated);
      setReassignTo("");
    } catch (err) {
      setReassignError(err.message);
    } finally {
      setReassigning(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatusError("");
    setStatusSaving(true);
    try {
      const updated = await updateTaskStatus(task._id, newStatus, token);
      onUpdated(updated);
    } catch (err) {
      setStatusError(err.message);
    } finally {
      setStatusSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${task.name}"? This can't be undone.`)) return;
    setDeleteError("");
    setDeleting(true);
    try {
      await deleteTask(task._id, token);
      onDeleted(task._id);
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleEditSubmit}
        className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2"
      >
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          required
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          required
          rows={2}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={editPriority}
          onChange={(e) => setEditPriority(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>

        {editError && <p className="text-sm text-red-600">{editError}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={savingEdit}
            className="bg-blue-600 text-white rounded-md px-3 py-1.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {savingEdit ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-sm text-gray-600 px-3 py-1.5"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
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
        <span>Assigned to: {task.assignedTo.username}</span>
        <span>Created by: {task.createdBy.username}</span>
      </div>

      {canUpdateStatus && (
        <div className="mt-3">
          <select
            value={task.status}
            onChange={handleStatusChange}
            disabled={statusSaving}
            className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
          {statusError && (
            <p className="text-xs text-red-600 mt-1">{statusError}</p>
          )}
        </div>
      )}

      {canReassign && (
        <form onSubmit={handleReassign} className="flex gap-2 mt-3 items-start">
          <select
            value={reassignTo}
            onChange={(e) => setReassignTo(e.target.value)}
            required
            className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Reassign to...
            </option>
            {team.members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.username}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={reassigning}
            className="text-xs bg-gray-900 text-white rounded-md px-2 py-1 hover:bg-gray-800 disabled:opacity-50"
          >
            {reassigning ? "..." : "Reassign"}
          </button>
        </form>
      )}
      {reassignError && (
        <p className="text-xs text-red-600 mt-1">{reassignError}</p>
      )}

      <div className="flex gap-3 mt-3">
        {canEdit && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-blue-600 hover:underline"
          >
            Edit
          </button>
        )}
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs text-red-600 hover:underline disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
      {deleteError && (
        <p className="text-xs text-red-600 mt-1">{deleteError}</p>
      )}
    </div>
  );
};
