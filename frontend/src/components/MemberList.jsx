import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { removeMember } from "../lib/teams";

export const MemberList = ({ team, onMemberRemoved, canManage }) => {
  const { token, user } = useAuth();
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  const handleRemove = async (memberId, username) => {
    if (!confirm(`Remove ${username} from this team?`)) return;
    setError("");
    setRemovingId(memberId);
    try {
      const updatedTeam = await removeMember(team._id, memberId, token);
      onMemberRemoved(updatedTeam);
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  const sortedMembers = [
    ...team.members.filter((m) => m._id === team.owner._id),
    ...team.members.filter((m) => m._id !== team.owner._id).reverse(),
  ];

  return (
    <div>
      <h2 className="text-sm font-medium text-gray-700 mb-2">Members</h2>
      <ul className="flex flex-col gap-1">
        {sortedMembers.map((member) => (
          <li
            key={member._id}
            className="text-sm text-gray-600 flex items-center gap-2"
          >
            {member.username}
            {member._id === team.owner._id && (
              <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                Owner
              </span>
            )}
            {canManage && member._id !== team.owner._id && (
              <button
                onClick={() => handleRemove(member._id, member.username)}
                disabled={removingId === member._id}
                className="text-xs text-red-600 hover:underline disabled:opacity-50"
              >
                {removingId === member._id ? "Removing..." : "Remove"}
              </button>
            )}
          </li>
        ))}
      </ul>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
};
