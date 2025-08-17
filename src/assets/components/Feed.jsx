import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice'; // Update the path as needed
import { useEffect, useState } from 'react';
import UserCard from './UserCard';
import { API_BASE_URL } from "../../config/api";
import { authUtils } from "../../utils/auth";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const getFeed = async (forceRefresh = false) => {
    if (feed && !forceRefresh) return;

    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/feed`, { 
        withCredentials: true,
        headers: authUtils.getAuthHeaders()
      });
      dispatch(addFeed(res.data));
    }
    catch (err) {
      console.log("API Error:", err);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleRefreshFeed = () => {
    getFeed(true);
  };

  useEffect(() => {
    getFeed();
    
  }, []);


  if (!feed || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-white text-xl">Loading feed...</h2>
      </div>
    );
  }

  if (!feed.users || !Array.isArray(feed.users) || feed.users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col justify-center items-center">
        <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-gray-600/50">
          <span className="text-4xl">🔍</span>
        </div>
        <h2 className="text-white text-2xl font-semibold mb-4">No more users available</h2>
        <p className="text-gray-400 mb-6">Check back later for new connections!</p>
        <button 
          onClick={handleRefreshFeed}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
        >
          🔄 Refresh Feed
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col justify-center items-center p-5 static overflow-hidden">
      {/* Instructions - Show only for the very first card (when all users are present) */}
      {feed.users.length === (feed.totalUsers || feed.users.length) && (
        <span className=" mt-18 absolute top-1 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs sm:text-sm text-center bg-gray-800/80 backdrop-blur-sm px-2 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-gray-700/50 max-w-xs sm:max-w-none">
          <p className="whitespace-nowrap sm:whitespace-normal">
            <span className="hidden sm:inline">🖱️ Drag left to ignore 😐Drag right to like ❤️</span>
            <span className="sm:hidden">👈 Swipe to Ignore | Swipe to Like 👉</span>
          </p>
          </span>
      )}

      {/* Card Stack - Show up to 3 cards for preview effect */}
      <div style={styles.cardStack}>
        {feed.users.slice(0, 3).map((user, index) => (
          <div 
            key={user._id} 
            style={{
              ...styles.cardLayer,
              zIndex: 3 - index,
              transform: `scale(${1 - index * 0.05}) translateY(${index * 8}px)`,
              opacity: index === 0 ? 1 : 0.7 - index * 0.2,
              pointerEvents: index === 0 ? 'auto' : 'none',
            }}
          >
            <UserCard user={user} />
          </div>
        ))}
        
        {/* Show card count indicator */}
        {feed.users.length > 1 && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm text-center">
            {feed.users.length} Users remaining
          </div>
        )}
        
        {/* Auto-refresh when low on cards */}
        {feed.users.length <= 2 && !isLoading && (
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center w-48">
            <p className="text-yellow-400 mb-3">
              ⚠️ Few users left!
            </p>
           
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  cardStack: {
    position: 'relative',
    width: '100%',
    maxWidth: '400px',
    height: '600px',
     // Prevent cards from overflowing during animation
  },
  cardLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  }
};

export default Feed;