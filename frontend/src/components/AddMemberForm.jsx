import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addMember } from "../lib/teams";

export const AddMemberForm = ({ teamId, onMemberAdded }) => {
  const { token } = useAuth();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const updatedTeam = await addMember(teamId, userId, token);
      setUserId("");
      onMemberAdded(updatedTeam);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start mt-3">
      <div className="flex-1">
        <input
          type="text"
          placeholder="User ID to add (temporary — search coming later)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Member"}
      </button>
    </form>
  );
};
