import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, sessionLoading } = useAuth();

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<div>Login page placeholder</div>} />
      <Route path="/register" element={<div>Register page placeholder</div>} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div>Dashboard placeholder</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teams/:id"
        element={
          <ProtectedRoute>
            <div>Team page placeholder</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-tasks"
        element={
          <ProtectedRoute>
            <div>My tasks placeholder</div>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App;
