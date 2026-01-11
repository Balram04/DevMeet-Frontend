import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../config/api';
import { authUtils } from '../../utils/auth';


const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/matches`, {
        withCredentials: true,
        headers: authUtils.getAuthHeaders()
      });

      if (res.data.success) {
        setMatches(res.data.matches);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const getMatchPercentage = (score) => {
    // Simple calculation: max realistic score is around 10
    return Math.min(Math.round((score / 10) * 100), 100);
  };

  const sendConnectionRequest = async (userId, firstname) => {
    try {
      setSendingRequest(userId);
      const res = await axios.post(
        `${API_BASE_URL}/request/send/interested/${userId}`,
        {},
        {
          withCredentials: true,
          headers: authUtils.getAuthHeaders()
        }
      );
      
      toast.success(`🎉 Connection request sent to ${firstname}!`);
      // Remove from matches list
      setMatches(matches.filter(m => m._id !== userId));
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error(error.response?.data?.message || 'Failed to send connection request');
    } finally {
      setSendingRequest(null);
    }
  };

  if (loading) {
    return (
      <>
        
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
            <div className="text-white text-xl animate-pulse">Finding your perfect matches...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-20 px-4 pb-10">
        {/* Animated Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center gap-3 px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30 backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-cyan-400 text-sm font-medium">AI-Powered Matching</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
               Find Your Perfect Match
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover peers who complement your skills and accelerate your learning journey together
            </p>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
            <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">👥</div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{matches.length}</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-400">Available Matches</div>
              </div>
            </div>
            <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🌟</div>
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                  {matches.length > 0 ? getMatchPercentage(matches[0].matchScore) : 0}%
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-400">Best Match Score</div>
              </div>
            </div>
            <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">📚</div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {matches.flatMap(m => m.commonLearn || []).length}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-400">Learning Opportunities</div>
              </div>
            </div>
          </div>

          {/* Matches Grid */}
          {matches.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 border-2 border-gray-700/50">
                <div className="text-7xl mb-6 animate-bounce">🔍</div>
                <h3 className="text-3xl font-bold text-white mb-4">No Matches Yet</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Update your skills and interests to discover developers who complement your learning path
                </p>
                <a
                  href="/profile"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Update Profile
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* Match Count Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Recommended Matches <span className="text-cyan-400">({matches.length})</span>
                </h2>
                <div className="flex gap-2">
                  <button className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gray-800/80 border border-gray-700 rounded-md sm:rounded-lg text-gray-300 hover:bg-gray-700/80 transition-all text-xs sm:text-sm">
                    Best Match
                  </button>
                  <button className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gray-800/50 border border-gray-700/50 rounded-md sm:rounded-lg text-gray-400 hover:bg-gray-700/50 transition-all text-xs sm:text-sm">
                    Newest
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {matches.map((match, index) => (
                  <div
                    key={match._id}
                    className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/30 cursor-pointer relative overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Match Badge */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-10">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 blur-sm sm:blur-md opacity-50"></div>
                        <div className="relative px-2 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full">
                          <div className="text-white font-bold text-xs sm:text-sm">
                            {getMatchPercentage(match.matchScore)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10">
                      {/* Profile Section */}
                      <div className="flex items-start mb-3 sm:mb-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-sm sm:blur-md opacity-50"></div>
                          <img
                            src={match.photoUrl || `https://ui-avatars.com/api/?name=${match.firstname}+${match.lastname}&background=random`}
                            alt={match.firstname}
                            className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-cyan-500 object-cover"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                        </div>
                        <div className="ml-3 sm:ml-4 flex-1">
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {match.firstname} {match.lastname}
                          </h3>
                          <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-1">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {match.college || 'Student'}
                            {match.year && ` • ${match.year}`}
                          </p>
                        </div>
                      </div>

                      {/* Bio */}
                      {match.bio && (
                        <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                          {match.bio}
                        </p>
                      )}

                      {/* Skill Match Indicators */}
                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
                        {/* You can learn from them */}
                        {match.commonLearn && match.commonLearn.length > 0 && (
                          <div className="bg-green-500/10 border border-green-500/30 rounded-lg sm:rounded-xl p-2 sm:p-3">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                                <span className="text-xs sm:text-sm">📚</span>
                              </div>
                              <span className="text-[10px] sm:text-xs text-green-400 font-semibold">They can teach you:</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {match.commonLearn.slice(0, 3).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 sm:px-3 sm:py-1 bg-green-500/20 border border-green-500/30 text-green-300 text-[10px] sm:text-xs rounded-full font-medium hover:bg-green-500/30 transition-colors"
                                >
                                  {skill}
                                </span>
                              ))}
                              {match.commonLearn.length > 3 && (
                                <span className="px-2 py-0.5 sm:px-3 sm:py-1 text-green-400 text-[10px] sm:text-xs font-medium">
                                  +{match.commonLearn.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* You can teach them */}
                        {match.commonTeach && match.commonTeach.length > 0 && (
                          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg sm:rounded-xl p-2 sm:p-3">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <span className="text-xs sm:text-sm">🎓</span>
                              </div>
                              <span className="text-[10px] sm:text-xs text-blue-400 font-semibold">You can teach them:</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {match.commonTeach.slice(0, 3).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] sm:text-xs rounded-full font-medium hover:bg-blue-500/30 transition-colors"
                                >
                                  {skill}
                                </span>
                              ))}
                              {match.commonTeach.length > 3 && (
                                <span className="px-3 py-1 text-blue-400 text-xs font-medium">
                                  +{match.commonTeach.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Connect Button */}
                      <button 
                        onClick={() => sendConnectionRequest(match._id, match.firstname)}
                        disabled={sendingRequest === match._id}
                        className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 sm:py-2.5 md:py-3 sm:bg-gradient-to-r sm:from-cyan-600 sm:to-blue-600 sm:hover:from-cyan-500 sm:hover:to-blue-500 text-white rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm font-bold sm:hover:shadow-lg sm:hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2 group"
                      >
                        {sendingRequest === match._id ? (
                          <>
                            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="text-xs sm:text-sm">Sending...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-xs sm:text-sm">Connect Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Tips Section - Only show when there are matches */}
          {matches.length > 0 && (
            <div className="mt-12 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl p-8 border border-cyan-500/30">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💡</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Pro Tips for Better Connections
                  </h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>Send personalized messages mentioning the skills you want to learn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>Higher match scores mean better skill compatibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>Update your profile regularly to discover new matches</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* AI Chatbot Suggestion - Show when no matches or at bottom */}
          <div className="mt-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-purple-500/30 text-center hover:border-purple-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="text-6xl mb-4 animate-bounce">🤖</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Need Learning Guidance?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Chat with our AI assistant to get personalized learning paths, skill recommendations, and career advice
            </p>
            <a
              href="/ai-assistant"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 sm:gap-2 sm:px-8 sm:py-4 sm:bg-gradient-to-r sm:from-purple-600 sm:to-pink-600 sm:hover:from-purple-500 sm:hover:to-pink-500 text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 sm:hover:shadow-lg sm:hover:shadow-purple-500/50 font-bold text-xs sm:text-base"
            >
              <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Chat with AI Assistant
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Matches;
