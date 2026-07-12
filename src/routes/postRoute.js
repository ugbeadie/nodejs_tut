import express from "express";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getMyPosts,
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/create", protect, createPost);
router.get("/all", protect, getPosts);
router.get("/my-posts", protect, getMyPosts);
router.patch("/update/:id", protect, updatePost);
router.delete("/delete/:id", protect, authorizeRoles("admin"), deletePost);

export default router;
