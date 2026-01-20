import { Loader } from "@react-three/drei";
import { Leva } from "leva";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { GroupDiscussion } from "./pages/GroupDiscussion";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { SystemDesignInterview } from "./pages/SystemDesignInterview";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Or a loading spinner
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Loader />
        <Leva hidden />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/group-discussion"
            element={
              <ProtectedRoute>
                <GroupDiscussion />
              </ProtectedRoute>
            }
          />
          <Route path="/interview" element={<SystemDesignInterview />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
