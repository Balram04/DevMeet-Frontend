import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { API_BASE_URL } from "../../config/api";

const Connection = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      dispatch(addConnection(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-3 sm:p-6">
      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          
          .card-animation {
            animation: fadeInUp 0.5s ease-out;
          }
          
          .loading-pulse {
            animation: pulse 2s infinite;
          }
          
          .float-animation {
            animation: float 3s ease-in-out infinite;
          }
        `
      }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            My Connections
          </h1>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-2 sm:mt-4 text-sm sm:text-base">Connect and chat with your network</p>
        </div>

        {/* No Connections State */}
        {connections.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <div className="w-16 sm:w-24 h-16 sm:h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 backdrop-blur-sm border border-gray-600/50 float-animation">
              <span className="text-2xl sm:text-4xl">🤝</span>
            </div>
            <h1 className="text-white text-xl sm:text-2xl font-semibold mb-2">No Connections Yet</h1>
            <p className="text-gray-400 text-sm sm:text-base px-4">Start connecting with people to build your network!</p>
          </div>
        )}

        {/* Connections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {connections.map((connectionObj, index) => {
            const user = connectionObj.user;
            const { _id, firstname, lastname, photoUrl, age, gender, about } = user;

            return (
              <div
                key={_id}
                className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:border-gray-600/70 hover:-translate-y-2 card-animation group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Profile Section */}
                <div className="text-center mb-3 sm:mb-4">
                  <div className="relative inline-block">
                    <img
                      alt="profile"
                      className="w-16 sm:w-20 h-16 sm:h-20 rounded-full object-cover ring-2 sm:ring-4 ring-blue-500/30 group-hover:ring-blue-400/50 transition-all duration-300 mx-auto"
                      src={photoUrl || "https://via.placeholder.com/150"}
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 sm:w-6 h-5 sm:h-6 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <h2 className="text-white font-bold text-base sm:text-lg mt-2 sm:mt-3 group-hover:text-blue-300 transition-colors duration-300">
                    {firstname} {lastname}
                  </h2>
                  
                  {age && gender && (
                    <div className="mt-1 sm:mt-2">
                      <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-blue-300 bg-blue-500/20 ring-1 ring-blue-400/30 rounded-full">
                        {age}, {gender}
                      </span>
                    </div>
                  )}
                </div>

                {/* About Section */}
                <div className="mb-4 sm:mb-6">
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed text-center line-clamp-2 sm:line-clamp-3 px-1">
                    {about || "No description available"}
                  </p>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => (window.location.href = `chat/${_id}`)}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg sm:rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 group-hover:shadow-purple-500/25 text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">💬 Start Chat</span>
                    <span className="sm:hidden">💬 Chat</span>
                  </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Connection Stats */}
        {connections.length > 0 && (
          <div className="mt-8 sm:mt-12 text-center">
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-700/50">
              <span className="text-gray-400 text-xs sm:text-sm">
                Total Connections: 
              </span>
              <span className="ml-2 text-white font-semibold text-sm sm:text-base">
                {connections.length}
              </span>
              <span className="ml-2 text-blue-400">
                🔗
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connection;
