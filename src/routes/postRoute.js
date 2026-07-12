import express from "express";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getMyPosts,
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createPost);
router.get("/all", protect, getPosts);
router.patch("/update/:id", protect, updatePost);
router.delete("/delete/:id", protect, deletePost);
router.get("/my-posts", protect, getMyPosts);

export default router;
