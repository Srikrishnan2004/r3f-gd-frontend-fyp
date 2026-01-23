import { useNavigate } from "react-router-dom";

export const Selection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
      <h1 className="text-4xl font-bold text-white mb-12 text-center">
        Choose Your Mode
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* System Design Interview Card */}
        <div 
          onClick={() => navigate("/interview/dashboard")}
          className="group relative bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-pink-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/20"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-pink-400 transition-colors">
            System Design Interview
          </h2>
          <p className="text-gray-400 mb-6">
            Practice 1-on-1 coding and system design interviews with our AI interviewer. Get real-time feedback and improve your skills.
          </p>
          
          <button className="flex items-center text-pink-500 font-semibold group-hover:translate-x-2 transition-transform duration-300">
            Start Interview <span className="ml-2">→</span>
          </button>
        </div>

        {/* Group Discussion Card */}
        <div 
          onClick={() => navigate("/group-discussion")}
          className="group relative bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
            Group Discussion
          </h2>
          <p className="text-gray-400 mb-6">
            Join a room with other candidates and practice group discussions on trending topics. Enhance your communication and teamwork.
          </p>
          
          <button className="flex items-center text-purple-500 font-semibold group-hover:translate-x-2 transition-transform duration-300">
            Join Discussion <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
