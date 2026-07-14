import { Team } from "../models/teamModel.js";
import { User } from "../models/UserModel.js";
import { Task } from "../models/taskModel.js";

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

const transferMember = async (req, res) => {
  try {
    const { userId, toTeamId, mode } = req.body;

    if (!userId || !toTeamId || !mode) {
      return res
        .status(400)
        .json({ message: "userId, toTeamId, and mode are required" });
    }

    if (!["move", "copy"].includes(mode)) {
      return res.status(400).json({ message: "mode must be 'move' or 'copy'" });
    }

    const fromTeam = await Team.findById(req.params.id);

    if (!fromTeam) {
      return res.status(404).json({ message: "Source team not found" });
    }

    const toTeam = await Team.findById(toTeamId);

    if (!toTeam) {
      return res.status(404).json({ message: "Destination team not found" });
    }

    if (fromTeam._id.toString() === toTeam._id.toString()) {
      return res
        .status(400)
        .json({ message: "Source and destination teams must be different" });
    }

    if (!fromTeam.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is not a member of the source team" });
    }

    if (userId === fromTeam.owner.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot transfer the team owner" });
    }

    if (toTeam.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is already a member of the destination team" });
    }

    if (mode === "move") {
      const activeTasks = await Task.find({
        team: fromTeam._id,
        assignedTo: userId,
        status: { $ne: "completed" },
      });

      if (activeTasks.length > 0) {
        return res.status(400).json({
          message:
            "Cannot move this member — they have unfinished tasks in the source team",
        });
      }
    }

    toTeam.members.push(userId);
    await toTeam.save();

    if (mode === "move") {
      fromTeam.members = fromTeam.members.filter(
        (id) => id.toString() !== userId,
      );
      await fromTeam.save();
    }

    const populatedFromTeam = await Team.findById(fromTeam._id).populate(
      TEAM_POPULATE,
    );
    const populatedToTeam = await Team.findById(toTeam._id).populate(
      TEAM_POPULATE,
    );

    res.status(200).json({
      message:
        mode === "move"
          ? "Member moved successfully"
          : "Member added to destination team",
      fromTeam: populatedFromTeam,
      toTeam: populatedToTeam,
    });
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
  transferMember,
};
