import { useNavigate, Link } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <AuthForm mode="register" onSuccess={() => navigate("/")} />
      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
