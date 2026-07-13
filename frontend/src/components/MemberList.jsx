export const MemberList = ({ team }) => {
  return (
    <div>
      <h2 className="text-sm font-medium text-gray-700 mb-2">Members</h2>
      <ul className="flex flex-col gap-1">
        {team.members.map((member) => (
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
          </li>
        ))}
      </ul>
    </div>
  );
};
