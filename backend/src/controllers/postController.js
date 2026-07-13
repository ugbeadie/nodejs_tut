import { Post } from "../models/postModel.js";
import { Team } from "../models/teamModel.js";

const POST_POPULATE = [
  { path: "createdBy", select: "username email" },
  { path: "assignedTo", select: "username email" },
  { path: "team", select: "name" },
];

const createPost = async (req, res) => {
  try {
    const { name, description, age, teamId, assignedTo } = req.body;

    if (!name || !description || !age || !teamId || !assignedTo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.members.includes(req.user._id.toString())) {
      return res
        .status(403)
        .json({ message: "You are not a member of this team" });
    }

    const isSelfAssigning = assignedTo === req.user._id.toString();
    const isTeamOwner = team.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

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

    const post = await Post.create({
      name,
      description,
      age,
      createdBy: req.user._id,
      team: teamId,
      assignedTo,
    });

    const populatedPost = await Post.findById(post._id).populate(POST_POPULATE);

    res
      .status(201)
      .json({ message: "Post created successfully", post: populatedPost });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(POST_POPULATE);
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: req.user._id }).populate(
      POST_POPULATE,
    );
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: req.params.userId }).populate(
      POST_POPULATE,
    );
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTeamPosts = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.members.includes(req.user._id.toString())) {
      return res
        .status(403)
        .json({ message: "You are not a member of this team" });
    }

    const posts = await Post.find({ team: req.params.teamId }).populate(
      POST_POPULATE,
    );

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isOwner = post.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You do not have permission to edit this post" });
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate(POST_POPULATE);

    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const team = await Team.findById(post.team);

    if (!team) {
      return res.status(404).json({ message: "Associated team not found" });
    }

    const isCreator = post.createdBy.toString() === req.user._id.toString();
    const isTeamOwner = team.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isTeamOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
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

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const team = await Team.findById(post.team);

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

    post.assignedTo = assignedTo;
    await post.save();

    const populatedPost = await Post.findById(post._id).populate(POST_POPULATE);

    res
      .status(200)
      .json({ message: "Task reassigned successfully", post: populatedPost });
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

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.assignedTo.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the assigned user can update task status" });
    }

    post.status = status;
    await post.save();

    const populatedPost = await Post.findById(post._id).populate(POST_POPULATE);

    res
      .status(200)
      .json({ message: "Status updated successfully", post: populatedPost });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createPost,
  getPosts,
  getMyPosts,
  getPostsByUser,
  getTeamPosts,
  updatePost,
  deletePost,
  reassignTask,
  updateTaskStatus,
};
