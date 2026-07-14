import { Task } from "../models/taskModel.js";
import { Team } from "../models/teamModel.js";

const TASK_POPULATE = [
  { path: "createdBy", select: "username email" },
  { path: "assignedTo", select: "username email" },
  { path: "team", select: "name" },
];

const createTask = async (req, res) => {
  try {
    const { name, description, priority, teamId, assignedTo } = req.body;

    if (!name || !description || !teamId || !assignedTo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isMember = team.members.includes(req.user._id.toString());

    if (!isMember && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not a member of this team" });
    }

    const isSelfAssigning = assignedTo === req.user._id.toString();
    const isTeamOwner = team.owner.toString() === req.user._id.toString();

    if (!isSelfAssigning && !isTeamOwner && !isAdmin) {
      return res.status(403).json({
        message:
          "You can only assign tasks to yourself unless you are the team owner or an admin",
      });
    }

    if (!team.members.includes(assignedTo)) {
      return res
        .status(400)
        .json({ message: "assignedTo must be a member of this team" });
    }

    const task = await Task.create({
      name,
      description,
      priority,
      createdBy: req.user._id,
      team: teamId,
      assignedTo,
    });

    const populatedTask = await Task.findById(task._id).populate(TASK_POPULATE);

    res
      .status(201)
      .json({ message: "Task created successfully", task: populatedTask });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate(TASK_POPULATE);
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate(
      TASK_POPULATE,
    );
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTasksByUser = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.params.userId }).populate(
      TASK_POPULATE,
    );
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTeamTasks = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isMember = team.members.includes(req.user._id.toString());

    if (!isMember && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not a member of this team" });
    }

    const tasks = await Task.find({ team: req.params.teamId }).populate(
      TASK_POPULATE,
    );

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTask = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isOwner = task.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You do not have permission to edit this task" });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate(TASK_POPULATE);

    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const team = await Team.findById(task.team);

    if (!team) {
      return res.status(404).json({ message: "Associated team not found" });
    }

    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isTeamOwner = team.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isTeamOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this task" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const reassignTask = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({ message: "assignedTo is required" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const team = await Team.findById(task.team);

    if (!team) {
      return res.status(404).json({ message: "Associated team not found" });
    }

    const isTeamOwner = team.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isTeamOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Only the team owner or admin can reassign tasks" });
    }

    if (!team.members.includes(assignedTo)) {
      return res
        .status(400)
        .json({ message: "assignedTo must be a member of this team" });
    }

    task.assignedTo = assignedTo;
    await task.save();

    const populatedTask = await Task.findById(task._id).populate(TASK_POPULATE);

    res
      .status(200)
      .json({ message: "Task reassigned successfully", task: populatedTask });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "in-progress", "completed"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Valid status is required" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAssignee = task.assignedTo.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isAssignee && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Only the assigned user can update task status" });
    }

    task.status = status;
    await task.save();

    const populatedTask = await Task.findById(task._id).populate(TASK_POPULATE);

    res
      .status(200)
      .json({ message: "Status updated successfully", task: populatedTask });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createTask,
  getTasks,
  getMyTasks,
  getTasksByUser,
  getTeamTasks,
  updateTask,
  deleteTask,
  reassignTask,
  updateTaskStatus,
};
