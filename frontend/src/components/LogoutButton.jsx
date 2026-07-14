import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="text-sm text-gray-600 underline">
      Logout
    </button>
  );
};
