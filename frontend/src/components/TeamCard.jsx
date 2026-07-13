import { Link } from "react-router-dom";

export const TeamCard = ({ team }) => {
  return (
    <Link
      to={`/teams/${team._id}`}
      className="block border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition"
    >
      <h3 className="font-medium text-gray-900">{team.name}</h3>
      <p className="text-sm text-gray-500 mt-1">
        {team.members.length} member{team.members.length !== 1 ? "s" : ""}
      </p>
      <p className="text-sm text-gray-400 mt-1">Owner: {team.owner.username}</p>
    </Link>
  );
};
