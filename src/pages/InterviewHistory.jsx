import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { interviewService } from "../services/interviewService";

export const InterviewHistory = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            try {
                const data = await interviewService.getFeedbackHistory(user.id);
                if (data.success) {
                    setHistory(data.feedbacks || []);
                }
            } catch (err) {
                console.error("Failed to fetch history:", err);
                setError("Failed to load interview history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
                Loading history...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate("/interview/dashboard")}
                        className="text-gray-400 hover:text-white flex items-center transition-colors"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-white">Interview History</h1>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                        {error}
                    </div>
                )}

                {history.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No interview history found.</p>
                        <button
                            onClick={() => navigate("/interview/dashboard")}
                            className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors"
                        >
                            Start an Interview
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {history.map((session) => (
                            <div
                                key={session.feedback_id}
                                className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg"
                            >
                                <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            {session.topic}
                                        </h3>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Code: {session.session_code}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-400">
                                            {new Date(session.session_date).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(session.session_date).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                                            Your Response
                                        </h4>
                                        <p className="text-gray-400 text-sm bg-gray-900/50 p-4 rounded-lg italic">
                                            "{session.user_response_text}"
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-pink-400 mb-2 uppercase tracking-wider">
                                            AI Feedback
                                        </h4>
                                        <div className="text-gray-300 text-sm bg-gray-900/50 p-4 rounded-lg whitespace-pre-wrap">
                                            {session.ai_feedback}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
