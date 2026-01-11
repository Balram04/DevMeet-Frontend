import { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "./UserCard";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PhotoUpload from "./PhotoUpload";
import { API_BASE_URL } from "../../config/api";
import { authUtils } from "../../utils/auth";

const EditProfile = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    about: "",
    wantsToLearn: "",
    canTeach: "",
    photoUrl: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const Navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/profile/view`, {
          withCredentials: true,
        });
        const user = res.data;

        setFormData({
          firstname: user.firstname || "",
          lastname: user.lastname || "",
          about: user.about || "",
          wantsToLearn: user.wantsToLearn?.join(", ") || "",
          canTeach: user.canTeach?.join(", ") || "",
          photoUrl: user.photoUrl || "",
        });
        setLoading(false);
      } catch (err) {
        setMessage("❌ Failed to load user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProfile = async () => {
    const updatedData = {
      ...formData,
      wantsToLearn: formData.wantsToLearn.split(",").map((s) => s.trim()).filter(Boolean),
      canTeach: formData.canTeach.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      const res = await axios.patch(
        `${API_BASE_URL}/profile/edit`,
        updatedData,
        { 
          withCredentials: true,
          headers: authUtils.getAuthHeaders()
        }
      );
      
      setMessage("✅ Profile updated successfully!");
      toast.success(`${res.data.user.firstname} profile updated Successfully! 🎉`);
      Navigate("/feed")
      
      
      const updatedUser = res.data.user;
      setFormData({
        firstname: updatedUser.firstname || "",
        lastname: updatedUser.lastname || "",
        about: updatedUser.about || "",
        wantsToLearn: updatedUser.wantsToLearn?.join(", ") || "",
        canTeach: updatedUser.canTeach?.join(", ") || "",
        photoUrl: updatedUser.photoUrl || "",
      });
      dispatch(addUser(updatedUser));
    } catch (err) {
      setMessage("❌ Failed to update profile: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex justify-center items-center">
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Loading Profile...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      ...styles.mainWrapper,
      backgroundColor: "transparent",
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'center' : 'flex-start',
    }}>
      <div style={styles.wrapper}>
        <form onSubmit={handleSubmit} style={styles.card}>
          <h2 style={styles.heading}>Edit Profile</h2>
          
          {/* Photo Upload at the top */}
          <PhotoUpload
            currentPhotoUrl={formData.photoUrl}
            onPhotoChange={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))}
            disabled={loading}
          />
          
          <input 
            type="text" 
            name="firstname" 
            value={formData.firstname} 
            onChange={handleChange} 
            placeholder="First Name" 
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
            onBlur={(e) => e.target.style.borderColor = '#374151'}
          />
          <input 
            type="text" 
            name="lastname" 
            value={formData.lastname} 
            onChange={handleChange} 
            placeholder="Last Name" 
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
            onBlur={(e) => e.target.style.borderColor = '#374151'}
          />
          
          <textarea 
            name="about" 
            value={formData.about} 
            onChange={handleChange} 
            placeholder="About You (max 150 characters)" 
            style={styles.textarea}
            maxLength={150}
            onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
            onBlur={(e) => e.target.style.borderColor = '#374151'}
          />
          <div style={{fontSize: '12px', color: '#9ca3af', marginTop: '-12px', marginBottom: '12px', textAlign: 'right'}}>
            {formData.about.length}/150
          </div>

          <input 
            type="text" 
            name="wantsToLearn" 
            value={formData.wantsToLearn} 
            onChange={handleChange} 
            placeholder="Want to Learn (comma-separated)" 
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
            onBlur={(e) => e.target.style.borderColor = '#374151'}
          />
          
          <input 
            type="text" 
            name="canTeach" 
            value={formData.canTeach} 
            onChange={handleChange} 
            placeholder="Skills Can Teach (comma-separated)" 
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
            onBlur={(e) => e.target.style.borderColor = '#374151'}
          />
          
          <button 
            type="submit" 
            className="px-6 py-3 text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
            style={{
              background: 'linear-gradient(90deg, #3486e4, #126322, #d85650)',
              backgroundSize: isMobile ? '% 100%' : '200% 100%',
              transition: 'all 0.3s ease',
              backgroundPosition: '0% 0',
              width: '100%',
               paddingBottom: isMobile ? '35px' : '10px',

            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.target.style.backgroundPosition = '100% 0';
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.target.style.backgroundPosition = '0% 0';
              }
            }}
          >
            💾 Save
             Profile
          </button>
        
          {message && <p style={styles.message}>{message}</p>}
        </form>
      </div>

      <div style={{
        ...styles.previewWrapper,
        position: isMobile ? 'static' : 'sticky',
        marginTop: isMobile ? '20px' : '0',
      }}>
        <div style={styles.userCardContainer}>
          <UserCard user={{
            firstname: formData.firstname,
            lastname: formData.lastname,
            photoUrl: formData.photoUrl || "",
            about: formData.about,
            wantsToLearn: formData.wantsToLearn.split(",").map((s) => s.trim()).filter(Boolean),
            canTeach: formData.canTeach.split(",").map((s) => s.trim()).filter(Boolean)
          }} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  mainWrapper: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #111827 0%, #1f2937 50%, #000000 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: window.innerWidth < 768 ? "10px" : "20px", // Less padding on mobile
    gap: window.innerWidth < 768 ? "20px" : "30px", // Less gap on mobile
    overflow: "auto",
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    maxWidth: "380px",
  },
  previewWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    maxWidth: "380px",
    position: "sticky",
    top: "20px",
  },
  card: {
    background: "rgba(31, 41, 55, 0.85)", // Increased opacity for better text visibility
    backdropFilter: "blur(12px)",
    padding: "24px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "350px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    border: "1px solid rgba(55, 65, 81, 0.5)",
    maxHeight: window.innerWidth < 768 ? "90vh" : "85vh", // More height on mobile
    overflowY: "auto",
    paddingBottom: window.innerWidth < 768 ? "80px" : "24px", // Extra bottom padding on mobile
  },
  heading: {
  fontSize: "1.5rem",
  textAlign: "center",
  background: "linear-gradient(to right, #60a5fa, #a78bfa, #f472b6)",
  WebkitBackgroundClip: "text",   // ✅ mobile fix
  WebkitTextFillColor: "transparent", // ✅ mobile fix
  backgroundClip: "text",
  color: "transparent",
  fontWeight: "600",
  },

  input: {
    padding: "12px 16px",
    marginBottom: "16px",
    borderRadius: "12px",
    border: "1px solid #374151",
    backgroundColor: "rgba(55, 65, 81, 0.5)",
    color: "#f9fafb",
    outline: "none",
    width: "100%",
    fontSize: "14px",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  textarea: {
    padding: "12px 16px",
    marginBottom: "16px",
    borderRadius: "12px",
    border: "1px solid #374151",
    backgroundColor: "rgba(55, 65, 81, 0.5)",
    color: "#f9fafb",
    resize: "vertical",
    minHeight: "80px",
    outline: "none",
    width: "100%",
    fontSize: "14px",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  button: {
    padding: "12px",
    backgroundColor: "#ff5722",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "0.9rem",
    marginTop: "8px",
    width: "100%",
    ":hover": {
      backgroundColor: "#e64a19",
      transform: "translateY(-1px)",
    }
  },
  message: {
    marginTop: "16px",
    textAlign: "center",
    fontWeight: "600",
    color: "#34d399",
    padding: "12px",
    borderRadius: "12px",
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    fontSize: "14px",
    border: "1px solid rgba(52, 211, 153, 0.2)",
  },
  userCardContainer: {
    width: "100%",
    maxWidth: "350px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "flex-start", 
  },
};

export default EditProfile;
