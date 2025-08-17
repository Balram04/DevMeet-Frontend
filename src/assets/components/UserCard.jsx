import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUserFeed } from "../utils/feedSlice";
import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../../config/api";
import { authUtils } from "../../utils/auth";

const UserCard = ({ user }) => {
  console.log("Single user received:", user);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('');
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [dragDirection, setDragDirection] = useState('');

  if (!user) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2>Loading user...</h2>
        </div>
      </div>
    );
  }

  const { _id,firstname, lastname, photoUrl, age, gender, about,skills } = user;
  const dispatch =useDispatch();

  const handleSendRequest= async(status, userId)=>{
    // Prevent multiple clicks during animation
    if (isAnimating) return;
    
    // Start animation based on action
    const direction = status === "ignored" ? "left" : "right";
    setAnimationDirection(direction);
    setIsAnimating(true);

    // Start API call immediately (don't wait for animation)
    const apiCall = axios.post(
      `${API_BASE_URL}/request/send/${status}/${userId}` ,{},
      {
        withCredentials:true,
        headers: authUtils.getAuthHeaders()
      }
    );

    // Wait for animation to complete before removing from feed
    setTimeout(async () => {
      try{
        const res = await apiCall;
        
        // Only dispatch if the request was successful
        if (res.status === 200 || res.status === 201) {
          dispatch(removeUserFeed(userId));
          console.log(`Request ${status} sent successfully`);
        }
      }
      catch(err){
        console.error("Error sending request:", err);
        
        // If the connection already exists, remove the user from feed anyway
        if (err.response?.status === 400 && err.response?.data?.message?.includes("already")) {
          dispatch(removeUserFeed(userId));
          console.log("Connection already exists, removing user from feed");
        }
        // You might want to show a user-friendly error message here
      }
      finally {
        // Reset animation state
        setIsAnimating(false);
        setAnimationDirection('');
      }
    }, 150); // Reduced animation duration for better responsiveness
  }

  // Optimized drag handlers with useCallback for better performance
  const handleDragStart = useCallback((clientX, clientY) => {
    if (isAnimating) return;
    
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
    setDragOffset({ x: 0, y: 0 });
    setDragDirection('');
  }, [isAnimating]);

  const handleDragMove = useCallback((clientX, clientY) => {
    if (!isDragging || isAnimating) return;
    
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      const deltaX = clientX - startPos.x;
      const deltaY = clientY - startPos.y;
      
      setDragOffset({ x: deltaX, y: deltaY });
      
      // Determine drag direction and visual feedback (reduced threshold for quicker response)
      if (Math.abs(deltaX) > 15) { // Further reduced threshold for faster direction detection
        if (deltaX > 0) {
          setDragDirection('right');
        } else {
          setDragDirection('left');
        }
      } else {
        setDragDirection('');
      }
    });
  }, [isDragging, isAnimating, startPos]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging || isAnimating) return;
    
    const threshold = 50; // Further reduced threshold for easier swiping
    const { x } = dragOffset;
    
    if (Math.abs(x) > threshold) {
      // Add haptic feedback for mobile devices
      if (navigator.vibrate) {
        navigator.vibrate(30); // Shorter vibration for better performance
      }
      
      // Trigger appropriate action based on drag direction
      if (x > 0) {
        // Dragged right - interested
        handleSendRequest("interested", _id);
      } else {
        // Dragged left - ignored
        handleSendRequest("ignored", _id);
      }
    } else {
      // Reset card position smoothly if drag distance was insufficient
      setDragOffset({ x: 0, y: 0 });
      setDragDirection('');
    }
    
    setIsDragging(false);
  }, [isDragging, isAnimating, dragOffset, _id]);

  // Mouse event handlers
  const handleMouseDown = (e) => {
    // Don't start drag if clicking on a button or other interactive element
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    // Don't start drag if touching a button or other interactive element
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    // Don't prevent default to allow for better touch responsiveness
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent scrolling during swipe
    const touch = e.touches[0];
    if (touch) {
      handleDragMove(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleDragEnd();
  };

  // Add global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, startPos, dragOffset]);



  // Get the card style with animation and drag
  const getCardStyle = () => {
    let transform = '';
    let opacity = 1;
    let background = 'linear-gradient(135deg, #374151 0%, #1f2937 50%, #111827 100%)';
    let backgroundImage = 'linear-gradient(135deg, #374151 0%, #1f2937 50%, #111827 100%), linear-gradient(135deg, #4f46e5, #06b6d4, #10b981)';
    
    if (isAnimating) {
      if (animationDirection === 'left') {
        transform = 'translateX(-100vw) rotate(-30deg)';
        opacity = 0;
        background = 'linear-gradient(135deg, #7F1D1D, #991B1B, #B91C1C)'; // red gradient
        backgroundImage = 'linear-gradient(135deg, #7F1D1D, #991B1B, #B91C1C), linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)';
      } else if (animationDirection === 'right') {
        transform = 'translateX(100vw) rotate(30deg)';
        opacity = 0;
        background = 'linear-gradient(135deg, #14532D, #166534, #15803D)'; // green gradient
        backgroundImage = 'linear-gradient(135deg, #14532D, #166534, #15803D), linear-gradient(135deg, #10b981, #059669, #047857)';
      }
    } else if (isDragging) {
      // Apply drag transform
      const { x, y } = dragOffset;
      const rotation = x * 0.15; // More rotation based on horizontal movement
      const scale = 1 - Math.abs(x) * 0.0005; // Slight scale down during drag
      transform = `translateX(${x}px) translateY(${y * 0.5}px) rotate(${rotation}deg) scale(${Math.max(scale, 0.9)})`;
      
      // Adjust opacity based on drag distance
      const dragProgress = Math.min(Math.abs(x) / 200, 1);
      opacity = 1 - dragProgress * 0.4;
      
      // Change background based on drag direction
      if (dragDirection === 'left') {
        background = `linear-gradient(135deg, rgb(${120 + dragProgress * 30}, ${30 + dragProgress * 20}, ${30 + dragProgress * 20}), #7F1D1D, #991B1B)`;
        backgroundImage = `linear-gradient(135deg, rgb(${120 + dragProgress * 30}, ${30 + dragProgress * 20}, ${30 + dragProgress * 20}), #7F1D1D, #991B1B), linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)`;
      } else if (dragDirection === 'right') {
        background = `linear-gradient(135deg, rgb(${20 + dragProgress * 15}, ${85 + dragProgress * 30}, ${45 + dragProgress * 20}), #14532D, #166534)`;
        backgroundImage = `linear-gradient(135deg, rgb(${20 + dragProgress * 15}, ${85 + dragProgress * 30}, ${45 + dragProgress * 20}), #14532D, #166534), linear-gradient(135deg, #10b981, #059669, #047857)`;
      }
    }
    
    return {
      ...styles.card,
      background,
      backgroundImage,
      transform,
      opacity,
      transition: isAnimating ? 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 
                  isDragging ? 'none' : 'all 0.2s ease-out',
      cursor: isDragging ? 'grabbing' : 'grab',
      willChange: 'transform, opacity', // Optimize for animations
    };
  };

  // Add overlay for visual feedback
  const getOverlayStyle = () => {
    if (!isAnimating && !isDragging) return { display: 'none' };
    
    const baseStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '3rem',
      fontWeight: 'bold',
      zIndex: 10,
      borderRadius: '16px',
      transition: 'all 0.3s ease',
    };

    if (isAnimating) {
      if (animationDirection === 'left') {
        return {
          ...baseStyle,
          backgroundColor: 'rgba(255, 77, 77, 0.8)',
          color: '#fff',
        };
      } else if (animationDirection === 'right') {
        return {
          ...baseStyle,
          backgroundColor: 'rgba(76, 175, 80, 0.8)',
          color: '#fff',
        };
      }
    } else if (isDragging && dragDirection) {
      const dragProgress = Math.min(Math.abs(dragOffset.x) / 200, 1);
      const overlayOpacity = dragProgress * 0.8;
      
      if (dragDirection === 'left') {
        return {
          ...baseStyle,
          backgroundColor: `rgba(255, 77, 77, ${overlayOpacity})`,
          color: '#fff',
        };
      } else if (dragDirection === 'right') {
        return {
          ...baseStyle,
          backgroundColor: `rgba(76, 175, 80, ${overlayOpacity})`,
          color: '#fff',
        };
      }
    }
    
    return { ...baseStyle, display: 'none' };
  };

  return (
    <div style={styles.wrapper}>
      <div 
        style={getCardStyle()}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Action Overlay */}
        <div style={getOverlayStyle()}>
          {(isAnimating && animationDirection === 'left') || (isDragging && dragDirection === 'left') ? '❌ NOPE' : 
           (isAnimating && animationDirection === 'right') || (isDragging && dragDirection === 'right') ? '❤️ LIKE' : ''}
        </div>
        
        <div style={styles.imageContainer}>
          <div 
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              padding: "4px",
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4, #10b981, #f59e0b)',
              boxShadow: "0 8px 25px rgba(79, 70, 229, 0.4)"
            }}
          >
            <img
              src={photoUrl || "https://via.placeholder.com/150"}
              alt={`${firstname || "User"} ${lastname || ""}`}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #1f2937"
              }}
            />
          </div>
        </div>
        <h2 style={styles.name}>
          {firstname || "No Name"} {lastname || ""}
        </h2>
        <div style={styles.infoGroup}>
          <p><span>Age:</span> {age || "Not specified"}</p>
          <p><span>Gender:</span> {gender || "Not specified"}</p>
        </div>
        <p style={styles.about}><span>About:</span> {about || "No description available"}</p>

        <div style={styles.buttonContainer}>
          <button 
            style={{ 
              ...styles.button, 
              background: isAnimating && animationDirection === 'left' ? 
                "linear-gradient(135deg, #dc2626, #b91c1c, #991b1b)" : 
                "linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)",
              boxShadow: "0 8px 25px rgba(239, 68, 68, 0.4)",
              transform: isAnimating && animationDirection === 'left' ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.3s ease',
              opacity: 1,
              pointerEvents: 'auto'
            }} 
            onClick={()=>handleSendRequest("ignored",_id)}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
              e.target.style.boxShadow = '0 5px 12px rgba(239, 68, 68, 0.6)';
              e.target.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c, #991b1b)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
              e.target.style.background = 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)';
            }}
            disabled={isAnimating}
          >
            <span className="hidden sm:inline">👎 Ignore</span>
            <span className="sm:hidden">👎</span>
          </button>
          <button 
            style={{ 
              ...styles.button, 
              background: isAnimating && animationDirection === 'right' ? 
                "linear-gradient(135deg, #059669, #047857, #065f46)" : 
                "linear-gradient(135deg, #10b981, #059669, #047857)",
              boxShadow: "0 0px 0px rgba(16, 185, 129, 0.4)",
              transform: isAnimating && animationDirection === 'right' ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.3s ease',
              opacity: 1,
              pointerEvents: 'auto'
            }} 
            onClick={()=>handleSendRequest("interested",_id)}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
              e.target.style.boxShadow = '0 5px px rgba(16, 185, 129, 0.6)';
              e.target.style.background = 'linear-gradient(135deg, #059669, #047857, #065f46)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
              e.target.style.background = 'linear-gradient(135deg, #10b981, #059669, #047857)';
            }}
            disabled={isAnimating}
          >
            <span className="hidden sm:inline">👍 Interested</span>
            <span className="sm:hidden">👍</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0",
    
  },
  card: {
    background: 'linear-gradient(135deg, #374151 0%, #1f2937 50%, #111827 100%)',
    color: "#fff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)",
    textAlign: "center",
    width: "100%",
    maxWidth: "350px",
    height: "auto",
    minHeight: "500px",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    border: "2px solid transparent",
    backgroundImage: 'linear-gradient(135deg, #374151 0%, #1f2937 50%, #111827 100%), linear-gradient(135deg, #4f46e5, #06b6d4, #10b981)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    userSelect: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    backdropFilter: "blur(10px)",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px"
  },
  name: {
    marginBottom: "12px",
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  infoGroup: {
    marginBottom: "12px",
    fontSize: "0.95rem",
    color: "#E5E7EB", // gray-200
  },
  about: {
    fontSize: "0.95rem",
    color: "#F3F4F6", // gray-100
    marginBottom: "20px",
    padding: "0 10px",
    lineHeight: "1.5"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
    gap: "15px",
    marginTop: "auto",
    padding: "16px 0",
    position: "relative",
    zIndex: 20,
    borderTop: "1px solid rgba(255, 255, 255, 0.1)"
  },
  button: {
    padding: "8px 12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.875rem",
    color: "#fff",
    transition: "all 0.3s ease",
    minWidth: "60px",
    flex: 1,
    maxWidth: "120px",
    position: "relative",
    zIndex: 21,
    "&:hover": {
      transform: "translateY(-2px) scale(1.05)",
    },
    "&:disabled": {
      opacity: 0.7,
      cursor: "not-allowed",
    }
  },
};

export default UserCard;
