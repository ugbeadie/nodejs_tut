import { TaskCard } from "./TaskCard";

export const TaskList = ({ tasks, team, onUpdated, onDeleted }) => {
  if (tasks.length === 0) {
    return <p className="text-sm text-gray-500">No tasks yet for this team.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          team={team}
          onUpdated={onUpdated}
          onDeleted={onDeleted}
        />
      ))}
    </div>
  );
};
