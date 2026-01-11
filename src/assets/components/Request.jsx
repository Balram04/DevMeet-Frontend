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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {requests && requests.map((request, index) => {
            const { _id, fromUserId } = request;
            const { firstname, lastname, photoUrl, wantsToLearn, canTeach } = fromUserId;
            return (
              <div
                key={_id}
                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border-2 border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 card-animation hover:shadow-2xl hover:shadow-cyan-500/30 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Profile Section */}
                <div className="flex flex-col items-center mb-6 transition-all duration-300">
                  <div className="relative mb-4 transition-transform duration-300 group-hover:scale-95">
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500">
                      <img
                        alt={`${firstname} ${lastname}`}
                        className="w-full h-full rounded-full object-cover border-4 border-gray-900"
                        src={photoUrl || "https://via.placeholder.com/96"}
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                      <span className="text-sm">👋</span>
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-xl text-center">
                    {firstname} {lastname}
                  </h3>
                </div>

                {/* Skills Section - Hidden initially, shown on hover */}
                <div className="space-y-4 mb-6 transition-all duration-500 overflow-hidden">
                  {/* Want to Learn */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-400 text-sm">🎯</span>
                      <h4 className="text-blue-400 font-semibold text-sm">Wants to Learn</h4>
                    </div>
                    {wantsToLearn && wantsToLearn.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {wantsToLearn.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-xs font-medium text-white bg-blue-500/20 border border-blue-500/30 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {wantsToLearn.length > 3 && (
                          <span className="px-3 py-1 text-xs font-medium text-blue-400">
                            +{wantsToLearn.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs italic">Not specified</p>
                    )}
                  </div>

                  {/* Can Teach */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-400 text-sm">🎓</span>
                      <h4 className="text-green-400 font-semibold text-sm">Can Teach</h4>
                    </div>
                    {canTeach && canTeach.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {canTeach.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-xs font-medium text-white bg-green-500/20 border border-green-500/30 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {canTeach.length > 3 && (
                          <span className="px-3 py-1 text-xs font-medium text-green-400">
                            +{canTeach.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs italic">Not specified</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3">
                  <button 
                    className="px-2 py-1.5 bg-green-600 hover:bg-green-700 sm:bg-emerald-600/90 sm:hover:bg-emerald-500 text-white text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-all duration-200 sm:hover:scale-105 active:scale-95 sm:shadow-lg sm:shadow-emerald-900/50 sm:hover:shadow-emerald-500/50 sm:border sm:border-emerald-500/30 sm:backdrop-blur-sm"
                    onClick={() => handleRequest("accepted", _id)}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg className="w-2 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Accept</span>
                    </span>
                  </button>
                  <button 
                    className="px-2 py-1.5 bg-gray-600 hover:bg-gray-700 sm:bg-gray-700/90 sm:hover:bg-gray-600 text-white text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-all duration-200 sm:hover:scale-105 active:scale-95 sm:shadow-lg sm:shadow-gray-900/50 sm:hover:shadow-gray-500/30 sm:border sm:border-gray-600/30 sm:backdrop-blur-sm"
                    onClick={() => handleRequest("rejected", _id)}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg className="w-2 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Reject</span>
                    </span>
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