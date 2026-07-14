import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { addMember } from "../lib/teams";
import { searchUsers } from "../lib/users";

export const AddMemberForm = ({ teamId, onMemberAdded }) => {
  const { token } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    if (selectedUser || query.trim().length < 2) {
      setResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const users = await searchUsers(query.trim(), token);
        setResults(users);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, token, selectedUser]);

  const handleSelect = (user) => {
    setSelectedUser(user);
    setQuery(user.username);
    setResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setError("");
    setAdding(true);
    try {
      const updatedTeam = await addMember(teamId, selectedUser._id, token);
      setQuery("");
      setSelectedUser(null);
      onMemberAdded(updatedTeam);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 relative">
      <div className="flex gap-2 items-start">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by username or email"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedUser(null);
            }}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {query.trim().length >= 2 && !selectedUser && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-sm max-h-48 overflow-y-auto">
              {searching && (
                <p className="text-sm text-gray-400 px-3 py-2">Searching...</p>
              )}
              {!searching && results.length === 0 && (
                <p className="text-sm text-gray-400 px-3 py-2">
                  No users found
                </p>
              )}
              {!searching &&
                results.map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => handleSelect(user)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    <span className="text-gray-900">{user.username}</span>{" "}
                    <span className="text-gray-400">{user.email}</span>
                  </button>
                ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={adding || !selectedUser}
          className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add Member"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </form>
  );
};
