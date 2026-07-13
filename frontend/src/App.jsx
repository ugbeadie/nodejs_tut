import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {/* routing goes here once we add pages */}
      </div>
    </AuthProvider>
  );
};

export default App;
