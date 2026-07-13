import { Team } from "../models/teamModel.js";

const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    const team = await Team.create({
      name,
      owner: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json({ message: "Team created successfully", team });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user._id });
    res.status(200).json({ teams });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isOwner = team.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Only the team owner or admin can add members" });
    }

    if (team.members.includes(userId)) {
      return res.status(409).json({ message: "User is already a member" });
    }

    team.members.push(userId);
    await team.save();

    res.status(200).json({ message: "Member added successfully", team });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isOwner = team.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Only the team owner or admin can remove members" });
    }

    if (userId === team.owner.toString()) {
      return res.status(400).json({ message: "Cannot remove the team owner" });
    }

    team.members = team.members.filter((id) => id.toString() !== userId);
    await team.save();

    res.status(200).json({ message: "Member removed successfully", team });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { createTeam, getMyTeams, addMember, removeMember };
