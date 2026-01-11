import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config/api";
import { authUtils } from "../../utils/auth";
import { useState } from "react";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const isLoginPage = location.pathname === '/login';
  const requestCount = requests?.length || 0;

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/logout`, {}, {
        withCredentials: true,
        headers: authUtils.getAuthHeaders()
      });
      
      authUtils.clearToken();
      dispatch(removeUser());
      toast.success("Logout Successful! 🙄");
      
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
      toast.error("Logout failed! Please try again.");
    }
  };
   
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
     <div className="navbar bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 shadow-lg mx-auto relative z-[10000] px-3 sm:px-4 h-16">
  <div className="flex-none">
     <a href="/feed" className="group relative flex items-center py-2 px-2 sm:px-4">
       <div className="relative">
         <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
           Dev
         </span>
         <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
           Meet
         </span>
       </div>
     </a> 
  </div>

  <div className="flex-1"></div>

  {user && !isLoginPage && (
    <div className="flex-none hidden lg:flex items-center justify-center gap-2 xl:gap-3">
      <a href="/matches" className="group relative px-3 xl:px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-all hover:bg-gray-700/50">
        <span className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <span className="font-medium text-sm xl:text-base">Find Match</span>
        </span>
      </a>
      <a href="/alumni" className="group relative px-3 xl:px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-all hover:bg-gray-700/50">
        <span className="flex items-center gap-2">
          <span className="text-lg">👥</span>
          <span className="font-medium text-sm xl:text-base">Alumni</span>
        </span>
      </a>
      <a href="/ai-assistant" className="group relative px-3 xl:px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-all hover:bg-gray-700/50">
        <span className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="font-medium text-sm xl:text-base">AI Assistant</span>
        </span>
      </a>
    </div>
  )}

  <div className="flex-1"></div>

  <div className="flex-none flex items-center gap-2 sm:gap-3">
    {user && !isLoginPage ? (
      <>
      <p className="text-white font-semibold text-[10px] sm:text-sm lg:text-base text-center leading-none">
                <span className="hidden sm:inline">Welcome,&nbsp;</span>
                <span className="sm:hidden">Hi&nbsp;</span>
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-bold">
                  {user?.firstname || user?.firstName || user?.name || "User"}!
                </span>
              </p>
        <div className="lg:dropdown lg:dropdown-end">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost btn-sm btn-circle avatar hover:bg-gray-700/50 lg:cursor-pointer cursor-pointer"
            onClick={(e) => {
              // Only open sidebar on mobile (screens smaller than lg)
              if (window.innerWidth < 1024) {
                e.preventDefault();
                e.stopPropagation();
                toggleSidebar();
              }
            }}
          >
            <div className="w-11 sm:w-10 rounded-full ring-2 ring-purple-500/50 hover:ring-purple-400 transition-all">
              <img
                alt="User"
                src={user?.photoUrl || user?.profileImage || user?.avatar || "https://via.placeholder.com/40?text=U"} 
              />
            </div>
          </div>
         
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-gray-800/95 backdrop-blur-sm rounded-2xl z-[10001] mt-3 min-w-[198px] w-90p-3 shadow-2xl border border-gray-700/50 hidden lg:menu">
            <li>
              <a href="/Profile" className="justify-between text-white hover:bg-gray-700/70 rounded-xl px-4 py-2">
                👤 Update Profile
                <span className="badge bg-gradient-to-r from-green-400 to-blue-500 text-white border-none text-[9px]">New</span>
              </a>
            </li>
            <li><a href="/connection" className="text-white hover:bg-gray-700/70 rounded-xl px-4 py-2">🤝 Connections</a></li>
            <li><a href="/request" className="text-white hover:bg-gray-700/70 rounded-xl px-4 py-2 flex items-center justify-between">🚀 Requests {requestCount > 0 && <span className="badge badge-sm bg-red-500 text-white border-none">{requestCount}</span>}</a></li>
            <li><a onClick={handleLogout} className="text-white hover:bg-red-500/20 hover:text-red-400 rounded-xl px-4 py-2">🚪 Logout</a></li>
          </ul> 
        </div>
      </>
    ) : null}
  </div>
</div>

{user && !isLoginPage && (
  <>
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[10001] transition-opacity duration-300 lg:hidden ${
        isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={closeSidebar}
    />

    <div
      className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700/50 shadow-2xl z-[10002] transform transition-transform duration-300 ease-in-out lg:hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-purple-500/50">
            <img
              src={user?.photoUrl || user?.profileImage || user?.avatar || "https://via.placeholder.com/40?text=U"}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-white font-bold text-base">
              {user?.firstname || user?.firstName || user?.name || "User"}
            </p>
            <p className="text-gray-400 text-xs truncate w-36">{user?.email || "user@devmeet.com"}</p>
          </div>
        </div>
        <button
          onClick={closeSidebar}
          className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/70 transition-all"
          aria-label="Close sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-1 w-2" fill="none" viewBox="0 0 24 24" stroke="">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
        <a href="/feed" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all">
          <span className="text-xl">🏠</span>
          <span className="font-medium">Home Feed</span>
        </a>

        <a href="/Profile" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all">
          <span className="text-xl">👤</span>
          <span className="font-medium">My Profile</span>
          <span className="ml-auto badge badge-sm bg-gradient-to-r from-green-400 to-blue-500 text-white border-none">New</span>
        </a>

        <a href="/matches" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all">
          <span className="text-xl">🎯</span>
          <span className="font-medium">Find Matches</span>
        </a>

        <a href="/alumni" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all">
          <span className="text-xl">👥</span>
          <span className="font-medium">Alumni Explorer</span>
        </a>

        <a href="/ai-assistant" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all">
          <span className="text-xl">🤖</span>
          <span className="font-medium">AI Assistant</span>
        </a>

        <a href="/connection" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all">
          <span className="text-xl">🤝</span>
          <span className="font-medium">Connections</span>
        </a>

        <a href="/request" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all">
          <span className="text-xl">🚀</span>
          <span className="font-medium">Requests</span>
          {requestCount > 0 && (
            <span className="ml-auto px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
              {requestCount}
            </span>
          )}
        </a>

        <div className="border-t border-gray-700/50 my-4"></div>

        <button
          onClick={() => { handleLogout(); closeSidebar(); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50 bg-gray-900/50">
        <div className="text-center text-xs text-gray-500">
          <p className="mb-1">DevMeet v1.0</p>
          <p className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
            Connect • Learn • Grow
          </p>
        </div>
      </div>
    </div>
  </>
)}

</>
  )
}

export default NavBar
