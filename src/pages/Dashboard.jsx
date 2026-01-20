import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export const Dashboard = () => {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleStartSession = async (e) => {
        e.preventDefault();
        if (!topic.trim()) {
            setError("Please enter a topic");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const sessionData = await api.createSession({
                userId: user.id,
                topic: topic,
            });

            // Store session info if needed, or just navigate
            // Depending on how GroupDiscussion page works, we might need to pass this ID.
            // For now, let's assume navigating to /group-discussion is enough, 
            // but ideally we should pass state or use a SessionContext.
            // I'll pass it in state navigation.
            navigate("/group-discussion", { state: { session: sessionData.session } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <nav className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                        Group Discussion AI
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-300">Welcome, {user?.username}</span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
                    <h2 className="text-2xl font-bold mb-6">Start a New Session</h2>

                    <form onSubmit={handleStartSession} className="space-y-6">
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">
                                Discussion Topic
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., The Impact of AI on Future Job Markets"
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg py-4 px-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-400">
                                Enter a topic to start a simulated group discussion with AI participants.
                            </p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99]
                ${loading
                                    ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                                    : 'bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white shadow-lg shadow-pink-900/20'
                                }`}
                        >
                            {loading ? "Creating Session..." : "Start Discussion"}
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {/* Feature cards or instructions could go here */}
                    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50">
                        <div className="w-10 h-10 bg-pink-500/10 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Multi-Agent Simulation</h3>
                        <p className="text-gray-400 text-sm">Experience realistic discussions with AI agents representing different viewpoints.</p>
                    </div>
                    {/* Add more cards if needed */}
                </div>
            </div>
        </div>
    );
};
