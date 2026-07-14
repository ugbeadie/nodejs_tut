import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  searchUsers,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.get("/users", protect, searchUsers);

export default router;
