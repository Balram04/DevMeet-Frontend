import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config/api";
import "./LoginForm.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
  });
  const navigate = useNavigate();

  // Validate token exists (only check once on mount)
  useEffect(() => {
    if (!token || token.trim() === "") {
      toast.error("Invalid reset link");
      navigate("/login");
    }
  }, []); // Empty dependency array - only run once on mount

  // Calculate password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength({ score: 0, label: "", color: "" });
      return;
    }

    let score = 0;
    
    // Length check
    if (newPassword.length >= 8) score++;
    if (newPassword.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(newPassword)) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;

    let label = "";
    let color = "";

    if (score <= 2) {
      label = "Weak";
      color = "#ef4444";
    } else if (score <= 4) {
      label = "Medium";
      color = "#f59e0b";
    } else {
      label = "Strong";
      color = "#10b981";
    }

    setPasswordStrength({ score, label, color });
  }, [newPassword]);

  const validatePassword = () => {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return false;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your password");
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/reset-password`,
        {
          token,
          newPassword,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Reset password error:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to reset password. Please try again.";
      toast.error(errorMessage);

      // If token is invalid/expired, redirect to forgot password
      if (err.response?.status === 400) {
        setTimeout(() => {
          navigate("/forgot-password");
        }, 2000);
      }
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
      background: 'radial-gradient(circle at 20% 50%, rgba(88, 166, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(35, 134, 54, 0.1) 0%, transparent 50%), linear-gradient(135deg, #0a0e14 0%, #0d1117 50%, #161b22 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(88, 166, 255, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '15%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(35, 134, 54, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
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
        maxWidth: '450px',
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
            🔐
          </div>
          <h1 style={{ 
            color: '#c9d1d9',
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>Reset Your Password</h1>
          <p style={{ 
            color: '#8b949e',
            fontSize: '13px',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Create a new secure password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* New Password Input */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{
              display: 'block',
              color: '#8b949e',
              fontSize: '12px',
              marginBottom: '6px',
              fontWeight: '500'
            }}>New Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={passwordVisible ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={isLoading}
                autoFocus
                required
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 15px',
                  background: '#0d1117',
                  border: '1.5px solid #30363d',
                  borderRadius: '12px',
                  color: '#c9d1d9',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
                onBlur={(e) => e.target.style.borderColor = '#30363d'}
              />
              <span
                onClick={() => setPasswordVisible(!passwordVisible)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  userSelect: "none",
                  fontSize: '20px',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-50%) scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(-50%) scale(1)'}
              >
                {passwordVisible ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {newPassword && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{
                height: "5px",
                background: "#0d1117",
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: '6px',
                border: '1px solid #30363d'
              }}>
                <div style={{
                  height: "100%",
                  width: `${(passwordStrength.score / 6) * 100}%`,
                  background: `linear-gradient(90deg, ${passwordStrength.color}, ${passwordStrength.color}dd)`,
                  transition: "all 0.4s ease",
                  boxShadow: `0 0 10px ${passwordStrength.color}66`
                }}/>
              </div>
              <p style={{
                fontSize: "12px",
                margin: 0,
                color: passwordStrength.color,
                fontWeight: "600",
                textAlign: 'center'
              }}>
                Password Strength: {passwordStrength.label}
              </p>
            </div>
          )}

          {/* Confirm Password Input */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{
              display: 'block',
              color: '#8b949e',
              fontSize: '12px',
              marginBottom: '6px',
              fontWeight: '500'
            }}>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                disabled={isLoading}
                required
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 14px',
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
              <span
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  userSelect: "none",
                  fontSize: '20px',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-50%) scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(-50%) scale(1)'}
              >
                {confirmPasswordVisible ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
          </div>

          {/* Match Indicator */}
          {confirmPassword && (
            <div style={{
              padding: '8px 12px',
              borderRadius: '8px',
              marginBottom: '14px',
              background: newPassword === confirmPassword ? 'rgba(35, 134, 54, 0.1)' : 'rgba(248, 81, 73, 0.1)',
              border: `1px solid ${newPassword === confirmPassword ? 'rgba(35, 134, 54, 0.3)' : 'rgba(248, 81, 73, 0.3)'}`,
            }}>
              <p style={{
                fontSize: "13px",
                margin: 0,
                color: newPassword === confirmPassword ? "#238636" : "#f85149",
                fontWeight: "500",
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '16px' }}>
                  {newPassword === confirmPassword ? "✓" : "✗"}
                </span>
                {newPassword === confirmPassword ? "Passwords match perfectly" : "Passwords don't match"}
              </p>
            </div>
          )}

          {/* Password Requirements */}
          <div style={{
            background: 'rgba(13, 17, 23, 0.6)',
            border: '1px solid rgba(48, 54, 61, 0.8)',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '18px',
          }}>
            <p style={{ 
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '10px',
              color: '#8b949e',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '14px' }}>🛡️</span>
              Password Requirements
            </p>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '11px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                color: newPassword.length >= 6 ? '#238636' : '#6b7280',
                transition: 'color 0.3s'
              }}>
                <span style={{ fontSize: '14px' }}>
                  {newPassword.length >= 6 ? '✓' : '○'}
                </span>
                <span>6+ characters</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                color: /[A-Z]/.test(newPassword) ? '#238636' : '#6b7280',
                transition: 'color 0.3s'
              }}>
                <span style={{ fontSize: '14px' }}>
                  {/[A-Z]/.test(newPassword) ? '✓' : '○'}
                </span>
                <span>Uppercase</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                color: /[a-z]/.test(newPassword) ? '#238636' : '#6b7280',
                transition: 'color 0.3s'
              }}>
                <span style={{ fontSize: '14px' }}>
                  {/[a-z]/.test(newPassword) ? '✓' : '○'}
                </span>
                <span>Lowercase</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                color: /[0-9]/.test(newPassword) ? '#238636' : '#6b7280',
                transition: 'color 0.3s'
              }}>
                <span style={{ fontSize: '14px' }}>
                  {/[0-9]/.test(newPassword) ? '✓' : '○'}
                </span>
                <span>Number</span>
              </div>
            </div>
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
            {isLoading ? "🔄 Resetting Password..." : "🔐 Reset Password"}
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

        {/* Security tip footer */}
        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: 'rgba(88, 166, 255, 0.05)',
          borderRadius: '10px',
          border: '1px solid rgba(88, 166, 255, 0.1)',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '11px',
            color: '#8b949e',
            margin: 0,
            lineHeight: '1.5'
          }}>
            💡 <strong style={{ color: '#c9d1d9' }}>Tip:</strong> Use a unique password and consider a password manager.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
