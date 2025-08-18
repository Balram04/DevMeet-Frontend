import React, { useState } from "react";
import "./LoginForm.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Toast import
import { API_BASE_URL } from "../../config/api";
import { authUtils } from "../../utils/auth";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    skills: []
  });

  const dispatch = useDispatch();

  const handlelogin = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      // Handle token storage for production
      if (res.data.token) {
        authUtils.setToken(res.data.token);
      }

      dispatch(addUser(res.data.user));
      toast.success(`${res.data.user.firstname} Login Successful! 🎉`);

      setTimeout(() => {
        const user = res.data.user;
        if (user.photoUrl === "" || user.isFirstTime) {
          navigate("/Profile");
        } else {
          navigate("/feed");
        }
      }, 500); // Wait a bit so user sees the toast
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      
      // Handle detailed error responses from backend
      const errorData = err.response?.data;
      
      if (errorData?.toast) {
        // Use the toast-friendly message from backend
        toast.error(errorData.toast);
      } else if (errorData?.message) {
        // Use the main error message
        toast.error(errorData.message);
      } else {
        // Fallback to generic message
        toast.error("Login failed! Please check your credentials.");
      }

      // Log detailed error info for debugging
      if (errorData?.requirements && errorData.requirements.length > 0) {
        console.log("Password requirements missing:", errorData.requirements);
      }
    }
  };

  const handleSignup = async () => {
    try {
      // Basic validation
      if (!signupData.firstname || !signupData.lastname || !signupData.email || !signupData.password) {
        toast.error("Please fill in all required fields!");
        return;
      }

      if (signupData.password.length < 6) {
        toast.error("Password must be at least 6 characters long!");
        return;
      }

      const res = await axios.post(
        `${API_BASE_URL}/signup`,
        signupData,
        { withCredentials: true }
      );

      toast.success("Account created successfully! 🎉");
      
      // Auto-login after successful signup
      setTimeout(() => {
        setIsSignUp(false); // Switch to login form
        setEmail(signupData.email);
        setPassword(signupData.password);
      }, 1000);
      
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      
      // Handle detailed error responses from backend
      const errorData = err.response?.data;
      
      if (errorData?.toast) {
        // Use the toast-friendly message from backend
        toast.error(errorData.toast);
      } else if (errorData?.message) {
        // Use the main error message
        toast.error(errorData.message);
      } else {
        // Fallback to generic message
        toast.error("Signup failed! Please use Uppercase , Lowercase , Numbers and Special Characters.");
      }
    }
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
    

      {/* Mobile-only welcome banner with centered logo */}
      <div className="block sm:hidden relative">
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm border-b border-gray-700/20 py-3 px-4 z-1">
          <div className="text-center">
            
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl">🌟</span>
              <h3 className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Hey Developer!
              </h3>
              <span className="text-2xl">🚀</span>
            </div>
            
            <p className="text-blue-300 text-xs font-semibold mt-1">
              Let's connect and grow together! 🤝
            </p>
            <p className="text-purple-300 text-xs font-bold mt-1 animate-pulse">
              Hurry up - Join thousands of developers! ⚡
            </p>
            <div className="flex justify-center gap-2 mt-2">
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></span>
              <span className="inline-block w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-150"></span>
            </div>
          </div>
        </div>
      </div>
    
    <div   className={ `auth-container${isSignUp ? " right-panel-active" : ""}`}>
      {/* Sign Up */}
      <div className="form-container sign-up-container">
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
        }}>
          <h1>Create Account</h1>
          
          <input 
            type="text" 
            name="firstname"
            placeholder="First Name" 
            value={signupData.firstname}
            onChange={handleSignupChange}
            required 
          />
          
          <input 
            type="text" 
            name="lastname"
            placeholder="Last Name" 
            value={signupData.lastname}
            onChange={handleSignupChange}
            required 
          />
          
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            value={signupData.email}
            onChange={handleSignupChange}
            required 
          />
          
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={signupData.password}
            onChange={handleSignupChange}
            required 
          />
          <p className="password-hint">
            Use at least 6 characters with uppercase, lowercase, number & special character
          </p>

          <p className="mobile-toggle">
            Already have an account?{" "}
            <span onClick={() => setIsSignUp(false)}>Sign In</span>
          </p>

          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Sign In */}
      <div className="form-container sign-in-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlelogin();
          }}
        >
          <h1>Sign in</h1>

          <input
            value={email}
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            value={password}
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <a href="" className="forgot">
            Forgot password?
          </a>

          <p className="mobile-toggle">
            Don’t have an account?{" "}
            <span onClick={() => setIsSignUp(true)}>Sign Up</span>
          </p>

          <button type="submit">Sign In</button>
        </form>
      </div>

      {/* Overlay */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button
              className="ghost"
              onClick={() => setIsSignUp(false)}
              type="button"
            >
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Developer! 😎</h1>
            <p>Join our community of developers and start your learning journey with us!</p>
            <button
              className="ghost"
              onClick={() => setIsSignUp(true)}
              type="button"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
