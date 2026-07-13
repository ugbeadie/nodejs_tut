import { createContext, useContext, useState } from "react";
import { apiRequest } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const login = async (email, password) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setUser(data.user);
      setToken(data.token);
      return true;
    } catch (error) {
      setAuthError(error.message);
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });
      setUser(data.user);
      setToken(data.token);
      return true;
    } catch (error) {
      setAuthError(error.message);
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, authLoading, authError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
