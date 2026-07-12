import express from "express";
import {
  createPost,
  getPosts,
  getMyPosts,
  getPostsByUser,
  getTeamPosts,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/create", protect, createPost);
router.get("/all", protect, getPosts);
router.get("/my-posts", protect, getMyPosts);
router.patch("/update/:id", protect, updatePost);
router.get("/user/:userId", protect, authorizeRoles("admin"), getPostsByUser);
router.delete("/delete/:id", protect, deletePost);
router.get("/team/:teamId", protect, getTeamPosts);

export default router;
