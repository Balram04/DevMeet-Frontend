import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config/api";
import "./LoginForm.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/forgot-password`,
        { email },
        { withCredentials: true }
      );

      if (res.data.success) {
        setEmailSent(true);
        toast.success(res.data.message);

        // In development mode, show the reset link
        if (res.data.devMode && res.data.resetUrl) {
          console.log("🔑 Password Reset URL (Dev Mode):", res.data.resetUrl);
          toast.info("Check console for reset link (dev mode)", {
            autoClose: 5000,
          });
        }
      }
    } catch (err) {
      console.error("Forgot password error:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to process request. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at 80% 20%, rgba(88, 166, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(35, 134, 54, 0.1) 0%, transparent 50%), linear-gradient(135deg, #0a0e14 0%, #0d1117 50%, #161b22 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '10%',
        width: '280px',
        height: '280px',
        background: 'radial-gradient(circle, rgba(88, 166, 255, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 7s ease-in-out infinite',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '12%',
        width: '220px',
        height: '220px',
        background: 'radial-gradient(circle, rgba(35, 134, 54, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 9s ease-in-out infinite reverse',
        pointerEvents: 'none'
      }}></div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div style={{ 
        maxWidth: '440px',
        width: '100%',
        background: 'rgba(22, 27, 34, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(88, 166, 255, 0.1)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(88, 166, 255, 0.05)',
        padding: '35px 35px 30px',
        animation: 'slideIn 0.6s ease-out',
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

        {!emailSent ? (
          <>
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 15px',
                background: 'linear-gradient(135deg, rgba(88, 166, 255, 0.2) 0%, rgba(35, 134, 54, 0.2) 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                border: '2px solid rgba(88, 166, 255, 0.3)',
                boxShadow: '0 8px 24px rgba(88, 166, 255, 0.15)'
              }}>
                🔑
              </div>
              <h1 style={{ 
                color: '#c9d1d9',
                margin: '0 0 8px 0',
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '-0.5px'
              }}>Forgot Password?</h1>
              <p style={{ 
                color: '#8b949e',
                fontSize: '13px',
                margin: 0,
                lineHeight: '1.5'
              }}>
                No worries! We'll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{
                  display: 'block',
                  color: '#8b949e',
                  fontSize: '12px',
                  marginBottom: '6px',
                  fontWeight: '500'
                }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#0d1117',
                    border: '1.5px solid #30363d',
                    borderRadius: '10px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
                  onBlur={(e) => e.target.style.borderColor = '#30363d'}
                />
              </div>

              {/* Info Box */}
              <div style={{
                background: 'rgba(88, 166, 255, 0.05)',
                border: '1px solid rgba(88, 166, 255, 0.15)',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '20px',
              }}>
                <p style={{ 
                  fontSize: '11px',
                  margin: 0,
                  color: '#8b949e',
                  lineHeight: '1.6',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '14px', flexShrink: 0 }}>ℹ️</span>
                  <span>We'll send a secure reset link to your email. Link expires in 1 hour.</span>
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: isLoading ? '#30363d' : 'linear-gradient(135deg, #238636 0%, #2ea043 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isLoading ? 'none' : '0 4px 12px rgba(35, 134, 54, 0.3)',
                  opacity: isLoading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(35, 134, 54, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(35, 134, 54, 0.3)';
                  }
                }}
              >
                {isLoading ? "🔄 Sending..." : "📧 Send Reset Link"}
              </button>

              {/* Back to Login */}
              <div style={{ textAlign: 'center', marginTop: '18px' }}>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#58a6ff',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    padding: '6px 12px',
                    borderRadius: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(88, 166, 255, 0.1)';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* Success State */}
            <div style={{ textAlign: 'center' }}>
              {/* Success Icon */}
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                background: 'linear-gradient(135deg, rgba(35, 134, 54, 0.2) 0%, rgba(88, 166, 255, 0.2) 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(35, 134, 54, 0.3)',
                boxShadow: '0 8px 24px rgba(35, 134, 54, 0.15)'
              }}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#238636"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>

              <h1 style={{ 
                color: '#c9d1d9',
                margin: '0 0 10px 0',
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '-0.5px'
              }}>Check Your Email!</h1>
              
              <p style={{ 
                color: '#8b949e',
                fontSize: '13px',
                margin: '0 0 8px 0',
                lineHeight: '1.5'
              }}>
                We've sent a password reset link to
              </p>
              
              <p style={{
                color: '#58a6ff',
                fontSize: '14px',
                fontWeight: '600',
                margin: '0 0 25px 0',
                wordBreak: 'break-all'
              }}>
                {email}
              </p>

              {/* Info Cards */}
              <div style={{
                background: 'rgba(13, 17, 23, 0.6)',
                border: '1px solid rgba(48, 54, 61, 0.8)',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '18px',
                textAlign: 'left'
              }}>
                <p style={{ 
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  color: '#c9d1d9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '14px' }}>📨</span>
                  Didn't receive the email?
                </p>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '20px', 
                  fontSize: '11px', 
                  color: '#8b949e', 
                  lineHeight: '1.8'
                }}>
                  <li>Check your spam/junk folder</li>
                  <li>Verify you entered the correct email</li>
                  <li>Wait a few minutes for delivery</li>
                </ul>
              </div>

              {/* Security Notice */}
              <div style={{
                background: 'rgba(88, 166, 255, 0.05)',
                border: '1px solid rgba(88, 166, 255, 0.1)',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '20px',
              }}>
                <p style={{
                  fontSize: '11px',
                  color: '#8b949e',
                  margin: 0,
                  lineHeight: '1.5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '14px' }}>🔒</span>
                  <span>Link expires in <strong style={{ color: '#c9d1d9' }}>1 hour</strong> for your security</span>
                </p>
              </div>

              {/* Back Button */}
              <button
                onClick={() => navigate("/login")}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #58a6ff 0%, #4a93e0 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(88, 166, 255, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(88, 166, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(88, 166, 255, 0.3)';
                }}
              >
                ← Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
