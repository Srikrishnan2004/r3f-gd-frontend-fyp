import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { interviewService } from "../services/interviewService";

const questions = [
  // Easy
  {
    id: 1,
    title: "Full Stack Todo App",
    difficulty: "Easy",
    description: "Design a simple Todo application with real-time updates across multiple devices.",
    color: "green"
  },
  {
    id: 2,
    title: "Blogging Platform",
    difficulty: "Easy",
    description: "Design a basic blogging platform where users can create, read, update, and delete posts.",
    color: "green"
  },
  {
    id: 3,
    title: "Real-time Chat App",
    difficulty: "Easy",
    description: "Design a 1-on-1 chat application using WebSockets for instant messaging.",
    color: "green"
  },
  // Medium
  {
    id: 4,
    title: "E-commerce Platform",
    difficulty: "Medium",
    description: "Design an online store with product catalog, shopping cart, and order processing system.",
    color: "yellow"
  },
  {
    id: 5,
    title: "Social Media Feed",
    difficulty: "Medium",
    description: "Design a scalable social media feed system like Twitter or Instagram showing posts from followed users.",
    color: "yellow"
  },
  // Hard
  {
    id: 6,
    title: "Airbnb System Design",
    difficulty: "Hard",
    description: "Design a global booking system like Airbnb handling property listings, searching, and bookings.",
    color: "red"
  }
];

export const InterviewDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStartInterview = async (topic) => {
    try {
      setLoading(true);
      setError("");
      
      const data = await interviewService.createSession(user.id, topic);
      
      if (data.success && data.session) {
        // Navigate to the interview page
        // We might want to pass session info via state if needed by the Interview component
        navigate("/interview", { 
          state: { 
            sessionId: data.session.id,
            sessionCode: data.session.session_code,
            topic: data.session.topic
          } 
        });
      }
    } catch (err) {
      console.error("Failed to start session:", err);
      setError(err.message || "Failed to start interview session");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
     return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
             <div className="text-white text-xl">Creating Session...</div>
        </div>
     )
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
            <div>
                <button 
                  onClick={() => navigate("/selection")}
                  className="text-gray-400 hover:text-white mb-4 flex items-center transition-colors"
                >
                  ← Back to Mode Selection
                </button>
                <h1 className="text-4xl font-bold text-white">
                  System Design Interview Questions
                </h1>
                <p className="mt-2 text-gray-400">
                  Select a problem statement to begin your interview session.
                </p>
            </div>
            <button
                onClick={() => navigate("/interview/history")}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-gray-500 transition-colors"
            >
                View History
            </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {questions.map((q) => (
            <div 
              key={q.id}
              onClick={() => handleStartInterview(q.title)}
              className="group bg-gray-800 rounded-xl border border-gray-700 p-6 cursor-pointer hover:border-gray-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                  q.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 ring-green-500/20' :
                  q.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20' :
                  'bg-red-500/10 text-red-400 ring-red-500/20'
                }`}>
                  {q.difficulty}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-pink-400 transition-colors">
                {q.title}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {q.description}
              </p>
              
              <div className="flex items-center justify-end">
                <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors flex items-center">
                  Start Session <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
