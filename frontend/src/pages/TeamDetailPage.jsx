import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchTeamById } from "../lib/teams";
import { MemberList } from "../components/MemberList";

const TeamDetailPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTeam = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchTeamById(id, token);
        setTeam(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, [id, token]);

  if (loading)
    return (
      <p className="text-sm text-gray-500 mt-10 text-center">Loading team...</p>
    );
  if (error)
    return <p className="text-sm text-red-600 mt-10 text-center">{error}</p>;
  if (!team) return null;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← Back to Dashboard
      </Link>

      <h1 className="text-xl font-semibold text-gray-900 mt-4 mb-6">
        {team.name}
      </h1>

      <MemberList team={team} />
    </div>
  );
};

export default TeamDetailPage;
