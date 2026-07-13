import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchMyTeams, fetchAllTeams } from "../lib/teams";
import { TeamCard } from "../components/TeamCard";
import { CreateTeamForm } from "../components/CreateTeamForm";
import { LogoutButton } from "../components/LogoutButton";

const DashboardPage = () => {
  const { token, user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allTeamsLoading, setAllTeamsLoading] = useState(false);
  const [error, setError] = useState("");
  const [allTeamsError, setAllTeamsError] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await fetchMyTeams(token);
        setTeams(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, [token]);

  useEffect(() => {
    if (!isAdmin) return;

    const loadAllTeams = async () => {
      setAllTeamsLoading(true);
      try {
        const data = await fetchAllTeams(token);
        setAllTeams(data);
      } catch (err) {
        setAllTeamsError(err.message);
      } finally {
        setAllTeamsLoading(false);
      }
    };

    loadAllTeams();
  }, [token, isAdmin]);

  const handleTeamCreated = (newTeam) => {
    setTeams((prev) => [...prev, newTeam]);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">My Teams</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user?.username}</span>
          <LogoutButton />
        </div>
      </div>

      <div className="mb-6">
        <CreateTeamForm onCreated={handleTeamCreated} />
      </div>

      {loading && <p className="text-sm text-gray-500">Loading teams...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && teams.length === 0 && (
        <p className="text-sm text-gray-500">
          You're not part of any teams yet. Create one above.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {teams.map((team) => (
          <TeamCard key={team._id} team={team} />
        ))}
      </div>

      {isAdmin && (
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            All Teams (Admin)
          </h2>

          {allTeamsLoading && (
            <p className="text-sm text-gray-500">Loading all teams...</p>
          )}
          {allTeamsError && (
            <p className="text-sm text-red-600">{allTeamsError}</p>
          )}

          {!allTeamsLoading && !allTeamsError && allTeams.length === 0 && (
            <p className="text-sm text-gray-500">No teams exist yet.</p>
          )}

          <div className="flex flex-col gap-3">
            {allTeams.map((team) => (
              <TeamCard key={team._id} team={team} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
