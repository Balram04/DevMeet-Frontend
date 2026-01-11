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
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
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

      // Password strength validation
      const password = signupData.password;
      
      if (password.length < 8) {
        toast.error("Password must be at least 6 characters long!");
        return;
      }

      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!hasUppercase) {
        toast.error("Password must include at least one uppercase letter!");
        return;
      }

      if (!hasLowercase) {
        toast.error("Password must include at least one lowercase letter!");
        return;
      }

      if (!hasNumber) {
        toast.error("Password must include at least one number!");
        return;
      }

      if (!hasSymbol) {
        toast.error("Password must include at least one special character (!@#$%^&*...)!");
        return;
      }

      const res = await axios.post(
        `${API_BASE_URL}/signup`,
        signupData,
        { withCredentials: true }
      );

      if (res.data.requiresVerification) {
        toast.success("OTP sent to your email! Please verify. 📧");
        setOtpEmail(signupData.email);
        setShowOTPVerification(true);
        
        // Show OTP in console for development
        if (res.data.devMode && res.data.otp) {
          toast.info(`Dev Mode - OTP: ${res.data.otp}`, { autoClose: 10000 });
        }
      } else {
        toast.success("Account created successfully! 🎉");
        setTimeout(() => {
          setIsSignUp(false);
          setEmail(signupData.email);
          setPassword(signupData.password);
        }, 1000);
      }
      
    } catch (err) {
      
      // Handle detailed error responses from backend
      const errorData = err.response?.data;
      
      if (errorData?.error) {
        // Show the specific error from backend validator
        toast.error(errorData.error);
      } else if (errorData?.toast) {
        // Use the toast-friendly message from backend
        toast.error(errorData.toast);
      } else if (errorData?.message) {
        // Use the main error message
        toast.error(errorData.message);
      } else {
        // Fallback to generic message
        toast.error("Signup failed! Please try again.");
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/verify-otp`, {
        email: otpEmail,
        otp
      });

      if (res.data.success) {
        toast.success('Email verified successfully! 🎉');
        setShowOTPVerification(false);
        setOtp("");
        // Auto-fill login credentials
        setTimeout(() => {
          setIsSignUp(false);
          setEmail(otpEmail);
          setPassword(signupData.password);
          toast.info('You can now log in!');
        }, 1000);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Verification failed';
      toast.error(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/resend-otp`, { 
        email: otpEmail 
      });
      
      if (res.data.success) {
        toast.success('OTP resent successfully! Check your email. 📧');
        
        // Show OTP in console for development
        if (res.data.devMode && res.data.otp) {
          toast.info(`Dev Mode - OTP: ${res.data.otp}`, { autoClose: 10000 });
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP';
      toast.error(message);
    } finally {
      setIsResending(false);
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
    
      {/* OTP Verification Modal */}
      {showOTPVerification && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}
          </style>

          <div style={{
            maxWidth: '420px',
            width: '100%',
            background: 'rgba(22, 27, 34, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(88, 166, 255, 0.15)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 100px rgba(88, 166, 255, 0.08)',
            padding: '35px 35px 30px',
            animation: 'slideUp 0.4s ease-out',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Top accent border */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #58a6ff 0%, #238636 100%)',
            }}></div>

            {/* Close button */}
            <button
              onClick={() => {
                setShowOTPVerification(false);
                setOtp("");
              }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(48, 54, 61, 0.5)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#8b949e',
                transition: 'all 0.2s',
                padding: 0
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(248, 81, 73, 0.2)';
                e.target.style.color = '#f85149';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(48, 54, 61, 0.5)';
                e.target.style.color = '#8b949e';
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{
                width: '70px',
                height: '70px',
                margin: '0 auto 15px',
                background: 'linear-gradient(135deg, rgba(88, 166, 255, 0.2) 0%, rgba(35, 134, 54, 0.2) 100%)',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                border: '2px solid rgba(88, 166, 255, 0.3)',
                boxShadow: '0 8px 24px rgba(88, 166, 255, 0.15)'
              }}>
                📧
              </div>
              <h2 style={{
                color: '#c9d1d9',
                margin: '0 0 8px 0',
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '-0.5px'
              }}>
                Verify Your Email
              </h2>
              <p style={{
                color: '#8b949e',
                fontSize: '13px',
                margin: '0 0 5px 0',
                lineHeight: '1.5'
              }}>
                We sent a 6-digit code to
              </p>
              <p style={{
                color: '#58a6ff',
                fontSize: '14px',
                fontWeight: '600',
                margin: 0,
                wordBreak: 'break-all'
              }}>
                {otpEmail}
              </p>
            </div>

            {/* OTP Input Form */}
            <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{
                  display: 'block',
                  color: '#8b949e',
                  fontSize: '12px',
                  marginBottom: '8px',
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#0d1117',
                    border: '1.5px solid #30363d',
                    borderRadius: '10px',
                    color: '#c9d1d9',
                    textAlign: 'center',
                    fontSize: '28px',
                    letterSpacing: '8px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#58a6ff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(88, 166, 255, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#30363d';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <p style={{
                  color: '#6b7280',
                  fontSize: '11px',
                  marginTop: '8px',
                  textAlign: 'center',
                  lineHeight: '1.5'
                }}>
                  Check your email inbox and spam folder
                </p>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isVerifying || otp.length !== 6}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: (isVerifying || otp.length !== 6) ? '#30363d' : 'linear-gradient(135deg, #238636 0%, #2ea043 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: (isVerifying || otp.length !== 6) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: (isVerifying || otp.length !== 6) ? 'none' : '0 4px 12px rgba(35, 134, 54, 0.3)',
                  opacity: (isVerifying || otp.length !== 6) ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!isVerifying && otp.length === 6) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(35, 134, 54, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isVerifying && otp.length === 6) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(35, 134, 54, 0.3)';
                  }
                }}
              >
                {isVerifying ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                      <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  '✓ Verify Email'
                )}
              </button>

              {/* Resend OTP */}
              <div style={{ textAlign: 'center', marginTop: '18px' }}>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#58a6ff',
                    fontSize: '13px',
                    cursor: isResending ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    opacity: isResending ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isResending) {
                      e.target.style.background = 'rgba(88, 166, 255, 0.1)';
                      e.target.style.textDecoration = 'underline';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isResending) {
                      e.target.style.background = 'transparent';
                      e.target.style.textDecoration = 'none';
                    }
                  }}
                >
                  {isResending ? '⏳ Sending...' : "Didn't receive? Resend OTP"}
                </button>
              </div>

              {/* Timer info */}
              <div style={{
                marginTop: '18px',
                padding: '10px',
                background: 'rgba(88, 166, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(88, 166, 255, 0.1)',
                textAlign: 'center'
              }}>
                <p style={{
                  color: '#8b949e',
                  fontSize: '11px',
                  margin: 0,
                  lineHeight: '1.5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '13px' }}>⏱️</span>
                  <span>OTP expires in <strong style={{ color: '#c9d1d9' }}>10 minutes</strong></span>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

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

          <a 
            onClick={() => navigate("/forgot-password")}
            className="forgot"
            style={{ cursor: "pointer" }}
          >
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
