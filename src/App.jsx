import { Loader } from "@react-three/drei";
import { Leva } from "leva";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { GroupDiscussion } from "./pages/GroupDiscussion";
import { InterviewDashboard } from "./pages/InterviewDashboard";
import { InterviewHistory } from "./pages/InterviewHistory";
import { Login } from "./pages/Login";
import { Selection } from "./pages/Selection";
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
            path="/selection"
            element={
              <ProtectedRoute>
                <Selection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/dashboard"
            element={
              <ProtectedRoute>
                <InterviewDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/history"
            element={
              <ProtectedRoute>
                <InterviewHistory />
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
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <SystemDesignInterview />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/selection" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
