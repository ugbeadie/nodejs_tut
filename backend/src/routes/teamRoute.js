import express from "express";
import {
  createTeam,
  getMyTeams,
  getAllTeams,
  getTeamById,
  addMember,
  removeMember,
  transferMember,
} from "../controllers/teamController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/create", protect, createTeam);
router.get("/my-teams", protect, getMyTeams);
router.get("/all", protect, authorizeRoles("admin"), getAllTeams);
router.get("/:id", protect, getTeamById);
router.post("/:id/add-member", protect, addMember);
router.post("/:id/remove-member", protect, removeMember);
router.post(
  "/:id/transfer-member",
  protect,
  authorizeRoles("admin"),
  transferMember,
);

export default router;
