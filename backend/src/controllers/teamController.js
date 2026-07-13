import { Team } from "../models/teamModel.js";
import { User } from "../models/UserModel.js";

const TEAM_POPULATE = [
  { path: "owner", select: "username email" },
  { path: "members", select: "username email" },
];

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

    const populatedTeam = await Team.findById(team._id).populate(TEAM_POPULATE);

    res
      .status(201)
      .json({ message: "Team created successfully", team: populatedTeam });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user._id }).populate(
      TEAM_POPULATE,
    );
    res.status(200).json({ teams });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate(TEAM_POPULATE);
    res.status(200).json({ teams });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate(TEAM_POPULATE);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isMember = team.members.some(
      (member) => member._id.toString() === req.user._id.toString(),
    );
    const isAdmin = req.user.role === "admin";

    if (!isMember && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not a member of this team" });
    }

    res.status(200).json({ team });
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

    const userExists = await User.findById(userId);

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    if (team.members.includes(userId)) {
      return res.status(409).json({ message: "User is already a member" });
    }

    team.members.push(userId);
    await team.save();

    const populatedTeam = await Team.findById(team._id).populate(TEAM_POPULATE);

    res
      .status(200)
      .json({ message: "Member added successfully", team: populatedTeam });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeMember = async (req, res) => {
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
        .json({ message: "Only the team owner or admin can remove members" });
    }

    if (userId === team.owner.toString()) {
      return res.status(400).json({ message: "Cannot remove the team owner" });
    }

    team.members = team.members.filter((id) => id.toString() !== userId);
    await team.save();

    const populatedTeam = await Team.findById(team._id).populate(TEAM_POPULATE);

    res
      .status(200)
      .json({ message: "Member removed successfully", team: populatedTeam });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createTeam,
  getMyTeams,
  getAllTeams,
  getTeamById,
  addMember,
  removeMember,
};
