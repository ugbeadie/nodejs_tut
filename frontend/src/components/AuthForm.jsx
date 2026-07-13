import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const AuthForm = ({ mode, onSuccess }) => {
  const isLogin = mode === "login";
  const { login, register, authLoading, authError } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = isLogin
      ? await login(email, password)
      : await register(username, email, password);
    if (success) onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-16 flex flex-col gap-4 p-6 border border-gray-200 rounded-lg"
    >
      <h1 className="text-xl font-semibold text-gray-900">
        {isLogin ? "Log in" : "Create an account"}
      </h1>

      {!isLogin && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {authError && <p className="text-sm text-red-600">{authError}</p>}

      <button
        type="submit"
        disabled={authLoading}
        className="bg-blue-600 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {authLoading ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
      </button>
    </form>
  );
};
