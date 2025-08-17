import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config/api";
import { authUtils } from "../../utils/auth";
const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on the login page
  const isLoginPage = location.pathname === '/login';

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/logout`, {}, {
        withCredentials: true,
        headers: authUtils.getAuthHeaders()
      });
      
      // Clear the token from localStorage
      authUtils.clearToken();
      
      dispatch(removeUser());
      toast.success("Logout Successful! 🙄");
      
      setTimeout(() => {
        navigate("/login");
      }, 1000); // Wait a bit so user sees the toast
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
      toast.error("Logout failed! Please try again.");
    }
  };
   
  return (
    <>
     <div className="navbar bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 shadow-lg mx-auto relative z-[10000]">
  <div className={`flex-1 sm:flex-1 flex ${isLoginPage ? 'justify-center sm:justify-center' : 'justify-start sm:justify-start'}`}>
     <a  href="/feed" className="btn btn-ghost text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 rounded-xl">✨DevMeet</a> 
  </div>
  <div className={`flex gap-4 ${isLoginPage ? 'absolute right-4 sm:absolute sm:right-4' : 'absolute right-4 sm:relative sm:right-auto'}`}>
          
    {user ? (
      <div className="dropdown dropdown-end flex justify-between gap-4 ">
        <div className="mt-1.5 bg-gradient-to-r from-amber-200/30 to-yellow-100/10 rounded-lg sm:rounded-xl px-1 sm:px-2 md:px-4 py-0.5 sm:py-1 md:py-2 border-0 sm:border border-gray-700/50 shadow flex items-center justify-center h-6 sm:h-8 md:h-10">
              <p className=" text-white font-semibold text-xs sm:text-sm md:text-base text-center leading-none">
                <span className="hidden sm:inline">Welcome,&nbsp;</span>
                <span className="sm:hidden">Hi&nbsp;</span>
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-bold">
                  {user?.firstname || user?.firstName || user?.name || "User"} !
                </span>
                 
              </p>
            </div>
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar mr-5">
          <div className="w-15  rounded-full ring-2 ring-blue-500/50">
            <img
              alt="User Avatar"
              src={user?.photoUrl || user?.profileImage || user?.avatar || "https://via.placeholder.com/40?text=U"} />
          </div>
        </div>
       
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-gray-800/95 backdrop-blur-sm rounded-2xl z-[10001] mt-3 w-56 p-3 shadow-2xl border border-gray-700/50">
          <li>
            <a href="/Profile" className="justify-between text-white hover:bg-gray-700/70 rounded-xl px-4 py-2">
              👤Update-Profile
              <span className="badge bg-gradient-to-r from-green-400 to-blue-500 text-white border-none">New</span>
            </a>
          </li>
          <li><a href="/connection" className="text-white hover:bg-gray-700/70 rounded-xl px-4 py-2">🤝 Connection</a></li>
          <li><a href="/request" className="text-white hover:bg-gray-700/70 rounded-xl px-4 py-2">🚀 Requests</a></li>
          <li><a onClick={handleLogout} className="text-white hover:bg-red-500/20 hover:text-red-400 rounded-xl px-4 py-2">🚪 Logout</a></li>
        </ul>
      </div>
    ) : (
      <div className="flex gap-2">
       
      </div>
    )}
  </div>
</div>

</>
  )
}

export default NavBar