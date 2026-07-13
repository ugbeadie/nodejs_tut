import express from "express";
import {
  createTeam,
  getMyTeams,
  addMember,
  removeMember,
} from "../controllers/teamController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createTeam);
router.get("/my-teams", protect, getMyTeams);
router.post("/:id/add-member", protect, addMember);
router.post("/:id/remove-member", protect, removeMember);

export default router;
