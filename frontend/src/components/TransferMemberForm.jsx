import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchAllTeams, transferMember } from "../lib/teams";

export const TransferMemberForm = ({ team, onTransferred }) => {
  const { token } = useAuth();
  const [allTeams, setAllTeams] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [toTeamId, setToTeamId] = useState("");
  const [mode, setMode] = useState("move");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teams = await fetchAllTeams(token);
        setAllTeams(teams.filter((t) => t._id !== team._id));
      } catch {
        setAllTeams([]);
      }
    };

    loadTeams();
  }, [token, team._id]);

  const transferableMembers = team.members.filter(
    (m) => m._id !== team.owner._id,
  );

  const eligibleDestinations = allTeams.filter(
    (t) => !memberId || !t.members.some((m) => m._id === memberId),
  );

  useEffect(() => {
    if (toTeamId && !eligibleDestinations.some((t) => t._id === toTeamId)) {
      setToTeamId("");
    }
  }, [memberId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const memberUsername = transferableMembers.find(
        (m) => m._id === memberId,
      )?.username;
      const destTeamName = allTeams.find((t) => t._id === toTeamId)?.name;
      const result = await transferMember(
        team._id,
        memberId,
        toTeamId,
        mode,
        token,
      );
      onTransferred(result.fromTeam);
      setSuccess(
        mode === "move"
          ? `${memberUsername} moved to ${destTeamName}.`
          : `${memberUsername} added to ${destTeamName}.`,
      );
      setMemberId("");
      setToTeamId("");
      setMode("move");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (transferableMembers.length === 0) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 mt-3 border border-gray-200 rounded-lg p-3"
    >
      <p className="text-xs text-gray-500">Transfer member (admin only)</p>

      <select
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        required
        className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          Select member...
        </option>
        {transferableMembers.map((m) => (
          <option key={m._id} value={m._id}>
            {m.username}
          </option>
        ))}
      </select>

      <select
        value={toTeamId}
        onChange={(e) => setToTeamId(e.target.value)}
        required
        disabled={!memberId}
        className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
      >
        <option value="" disabled>
          {memberId ? "Select destination team..." : "Select a member first"}
        </option>
        {eligibleDestinations.map((t) => (
          <option key={t._id} value={t._id}>
            {t.name}
          </option>
        ))}
      </select>

      <div className="flex gap-4 text-sm text-gray-600">
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            checked={mode === "move"}
            onChange={() => setMode("move")}
          />
          Move (remove from this team)
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            checked={mode === "copy"}
            onChange={() => setMode("copy")}
          />
          Copy (keep in both)
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-gray-900 text-white rounded-md py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 w-fit px-4"
      >
        {loading ? "Transferring..." : "Transfer"}
      </button>
    </form>
  );
};
