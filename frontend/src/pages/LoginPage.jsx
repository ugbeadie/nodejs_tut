import { useNavigate, Link } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <AuthForm mode="login" onSuccess={() => navigate("/")} />
      <p className="text-center text-sm text-gray-500 mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
