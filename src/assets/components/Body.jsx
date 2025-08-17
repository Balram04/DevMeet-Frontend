import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar"
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { API_BASE_URL } from "../../config/api";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/view`, {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
      
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
      }
      console.log(err);
    }
  };

  useEffect(() => {
    if (!userData) {
      fetchUser();
    }
  }, []); 

  return (
 <div style={{ overflowX: 'hidden', maxWidth: '100vw' }}>
  <NavBar/>
  <div style={{ overflowX: 'hidden' }}> 
    <Outlet/>
  </div>
  <Footer/>
 </div>
  )
}

export default Body;