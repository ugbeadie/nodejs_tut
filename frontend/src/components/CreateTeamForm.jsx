import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createTeam } from "../lib/teams";

export const CreateTeamForm = ({ onCreated }) => {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const team = await createTeam(name, token);
      setName("");
      onCreated(team);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start">
      <div className="flex-1">
        <input
          type="text"
          placeholder="New team name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Team"}
      </button>
    </form>
  );
};
