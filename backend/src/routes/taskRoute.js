import express from "express";
import {
  createTask,
  getTasks,
  getMyTasks,
  getTasksByUser,
  getTeamTasks,
  updateTask,
  deleteTask,
  reassignTask,
  updateTaskStatus,
} from "../controllers/taskController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/create", protect, createTask);
router.get("/all", protect, getTasks);
router.get("/my-tasks", protect, getMyTasks);
router.patch("/update/:id", protect, updateTask);
router.get("/user/:userId", protect, authorizeRoles("admin"), getTasksByUser);
router.delete("/delete/:id", protect, deleteTask);
router.get("/team/:teamId", protect, getTeamTasks);
router.patch("/:id/reassign", protect, reassignTask);
router.patch("/:id/status", protect, updateTaskStatus);

export default router;
