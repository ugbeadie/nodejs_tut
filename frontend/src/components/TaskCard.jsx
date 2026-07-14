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

export const TaskCard = ({ task }) => {
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
    </div>
  );
};
