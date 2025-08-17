import axios from "axios"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requesSlice";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config/api";
import { authUtils } from "../../utils/auth";

const Request = () => {

    const dispatch = useDispatch();
    const requests = useSelector((store) => store.requests);
    
const fetchRequests = async () => {
    try{
        const res = await axios.get(`${API_BASE_URL}/user/requests/received`, {
            withCredentials: true,
            headers: authUtils.getAuthHeaders()
        });
        dispatch(addRequests(res.data.data));
    }
    catch(error){
        console.log("request err: " + error)
    }
};

//handle the accept and reject req
const handleRequest = async (status, requestId) => {
    try {
        const res = await axios.post(
            `${API_BASE_URL}/request/review/${status}/${requestId}`,
            {},
            { 
                withCredentials: true,
                headers: authUtils.getAuthHeaders()
            }
        );
        
        // Remove the processed request from the list
        const updatedRequests = requests.filter(req => req._id !== requestId);
        dispatch(addRequests(updatedRequests));
        
        // Show success toast based on status
        if (status === "accepted") {
            toast.success("🎉 Request accepted successfully!");
        } else if (status === "rejected") {
            toast.success("✋ Request rejected successfully!");
        }
        
        console.log(res.data.message);
    } catch (error) {
        console.log("Error handling request: " + error);
        // Show error toast
        toast.error("❌ Failed to process request. Please try again!");
    }
};

useEffect(() => {
    fetchRequests();
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
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
          
          .card-animation {
            animation: fadeInUp 0.5s ease-out;
          }
          
          .loading-pulse {
            animation: pulse 2s infinite;
          }
        `
      }} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Connection Requests
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        
        {/* Loading State */}
        {!requests && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <h1 className="text-white text-xl loading-pulse">Loading requests...</h1>
          </div>
        )}
        
        {/* No Requests State */}
        {requests && requests.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-gray-600/50">
              <span className="text-4xl">💼</span>
            </div>
            <h1 className="text-white text-2xl font-semibold mb-2">No Requests Found</h1>
            <p className="text-gray-400">You're all caught up! No pending connection requests.</p>
          </div>
        )}
        
        {/* Requests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {requests && requests.map((request, index) => {
            const { _id, fromUserId } = request;
            const { firstname, lastname, photoUrl, age, gender, about } = fromUserId;
            return (
              <div
                key={_id}
                className="rounded-2xl p-6 shadow-2xl transition-all duration-300 card-animation"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  background: 'linear-gradient(135deg, #374151 0%, #1f2937 50%, #111827 100%)',
                  border: '2px solid transparent',
                  backgroundImage: 'linear-gradient(135deg, #374151 0%, #1f2937 50%, #111827 100%), linear-gradient(135deg, #4f46e5, #06b6d4, #10b981)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 35px 60px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(79, 70, 229, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)';
                }}
              >
                <div className="flex items-start space-x-6">
                  {/* Profile Image */}
                  <div className="relative flex-shrink-0">
                    <div 
                      className="w-20 h-20 rounded-full p-1 transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #4f46e5, #06b6d4, #10b981, #f59e0b)',
                        animation: 'gradient-shift 3s ease-in-out infinite'
                      }}
                    >
                      <img
                        alt="profile"
                        className="w-full h-full rounded-full object-cover"
                        src={photoUrl || "https://via.placeholder.com/80"}
                        style={{
                          border: '2px solid #1f2937'
                        }}
                      />
                    </div>
                    <div 
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        borderColor: '#1f2937',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                      }}
                    >
                      <span className="text-xs">👋</span>
                    </div>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-grow min-w-0">
                    <h2 className="text-white font-bold text-xl mb-2 truncate">
                      {firstname} {lastname}
                    </h2>
                    {age && gender && (
                      <div className="flex items-center mb-3">
                        <span 
                          className="px-3 py-1 text-sm font-medium text-white rounded-full"
                          style={{
                            background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          {age}, {gender}
                        </span>
                      </div>
                    )}
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {about || "No description available"}
                    </p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div 
                  className="flex space-x-3 mt-6 pt-4"
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <button 
                    className="flex-1 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669, #047857)',
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px) scale(1.05)';
                      e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.6)';
                      e.target.style.background = 'linear-gradient(135deg, #059669, #047857, #065f46)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                      e.target.style.background = 'linear-gradient(135deg, #10b981, #059669, #047857)';
                    }}
                    onClick={() => handleRequest("accepted", _id)}
                  >
                    ✓ Accept
                  </button>
                  <button 
                    className="flex-1 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
                      boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px) scale(1.05)';
                      e.target.style.boxShadow = '0 12px 35px rgba(239, 68, 68, 0.6)';
                      e.target.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c, #991b1b)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
                      e.target.style.background = 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)';
                    }}
                    onClick={() => handleRequest("rejected", _id)}
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Request