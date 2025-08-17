import { useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react';
import { socketConnection } from '../utils/Socket';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from "../../config/api";

const Chat = () => {
    const targetUserId = useParams().toUserId;
    const user = useSelector((store) => store.user);
    const userId = user?._id;
    const [socket, setSocket] = useState(null); // Store socket instance
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [targetUser, setTargetUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Scroll to bottom when new messages arrive - only scroll the messages container
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    // Fetch target user details
    useEffect(() => {
        const fetchTargetUser = async () => {
            try {
                setLoading(true);
                setError(null);
                
                
                const response = await axios.get(`${API_BASE_URL}/feed/user/${targetUserId}`, {
                    withCredentials: true
                });
                
                console.log('API Response:', response.data);
                
                const userData = response.data.user || response.data;
                setTargetUser({
                    ...userData,
                    isOnline: Math.random() > 0.5 // Random online status for demo
                });
                
                console.log('Target user set:', userData);
            } catch (err) {
                console.error('Error fetching target user:', err);
                console.error('Error details:', err.response?.data || err.message);
                
                setError('Failed to load user details');
                // Fallback to basic info
                setTargetUser({
                    _id: targetUserId,
                    firstname: "Unknown",
                    lastname: "User",
                    photoUrl: "https://via.placeholder.com/50?text=User",
                    isOnline: false,
                });
                
                console.log('Using fallback user data');
            } finally {
                setLoading(false);
            }
        };

        if (targetUserId) {
            fetchTargetUser();
        }
    }, [targetUserId]);

    useEffect(() => {
        if (!userId || !targetUserId) return;
        
        const socketInstance = socketConnection();
        setSocket(socketInstance);
        
        socketInstance.on('connect', () => {
            console.log('Connected to server');
            socketInstance.emit("joinRoom", {userId, targetUserId});
        });

        // Listen for incoming messages
        socketInstance.on('receiveMessage', (messageData) => {
            console.log('Received message:', messageData);
            setChatMessages(prev => {
                const newMessages = [...prev, {
                    id: Date.now(),
                    sender: messageData.senderId === userId ? "me" : "other",
                    text: messageData.text,
                    timestamp: messageData.timestamp,
                    senderId: messageData.senderId
                }];
                // Scroll to bottom after updating messages with a slight delay for DOM update
                setTimeout(scrollToBottom, 50);
                return newMessages;
            });
        });

        // Listen for typing events
        socketInstance.on('userTyping', ({ userId: typingUserId, isTyping: typing }) => {
            if (typingUserId !== userId) {
                setIsTyping(typing);
                if (typing) {
                    setTimeout(scrollToBottom, 50);
                }
            }
        });
        
        
        
        // Return cleanup function from useEffect
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            socketInstance.off('receiveMessage');
            socketInstance.off('userTyping');
            socketInstance.disconnect();
        };
    }, [userId, targetUserId]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, isTyping]);

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
        
        if (socket && e.target.value.trim()) {
            // User is typing
            socket.emit('typing', { userId, targetUserId, isTyping: true });
            
            // Clear existing timeout
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            
            // Set new timeout to stop typing indicator after 2 seconds of inactivity
            const timeout = setTimeout(() => {
                socket.emit('typing', { userId, targetUserId, isTyping: false });
            }, 2000);
            
            setTypingTimeout(timeout);
        } else if (socket) {
            // User stopped typing
            socket.emit('typing', { userId, targetUserId, isTyping: false });
            if (typingTimeout) {
                clearTimeout(typingTimeout);
                setTypingTimeout(null);
            }
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        const messageData = {
            senderId: userId,
            receiverId: targetUserId,
            text: newMessage.trim(),
            timestamp: new Date().toISOString()
        };

        // Send message through socket
        socket.emit('sendMessage', messageData);

        // Clear typing indicator when sending message
        if (typingTimeout) {
            clearTimeout(typingTimeout);
            setTypingTimeout(null);
        }
        socket.emit('typing', { userId, targetUserId, isTyping: false });

        // Don't add message to local state here - wait for receiveMessage event
        // This ensures proper synchronization between users
        setNewMessage('');
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                        <h2 className="text-white text-xl">Loading Chat...</h2>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !targetUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-red-700/50 p-8 shadow-2xl">
                    <div className="flex flex-col items-center">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-white text-xl mb-2">Error Loading Chat</h2>
                        <p className="text-gray-400 text-center">{error}</p>
                        <button 
                            onClick={() => window.history.back()}
                            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-2 sm:p-4 flex items-center justify-center chat-container">
            <div className="w-full max-w-6xl h-[95vh] sm:h-[85vh] bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 flex flex-col shadow-2xl">
                
                {/* Custom Styles */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes fadeInUp {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        
                        @keyframes bounce {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-6px); }
                        }
                        
                        .message-animation {
                            animation: fadeInUp 0.3s ease-out;
                        }
                        
                        .bounce-dot {
                            animation: bounce 1.4s infinite ease-in-out both;
                        }
                        
                        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
                        .scrollbar-thin::-webkit-scrollbar-track { background: rgba(55, 65, 81, 0.3); border-radius: 10px; }
                        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.5); border-radius: 10px; }
                        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.8); }
                        
                        /* Prevent scroll overflow */
                        .chat-container {
                            overscroll-behavior: none;
                        }
                        
                        .messages-container {
                            overscroll-behavior-y: contain;
                        }
                    `
                }} />

                {/* Chat Header - Responsive */}
                <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 px-3 sm:px-6 py-3 sm:py-4 rounded-t-xl sm:rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                                <div className="relative flex-shrink-0">
                                    <img 
                                        src={targetUser?.photoUrl || targetUser?.image || "https://via.placeholder.com/50?text=User"} 
                                        alt={`${targetUser?.firstname || 'User'} profile`}
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-blue-500/50 hover:ring-blue-400/70 transition-all duration-300"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/50?text=User";
                                        }}
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-white font-semibold text-base sm:text-lg truncate">
                                        {targetUser ? 
                                            `${targetUser.firstname || targetUser.firstName || 'Unknown'} ${targetUser.lastname || targetUser.lastName || ''}`.trim() || 'Unknown User'
                                            : 'Loading...'}
                                    </h2>
                                    <div className="flex items-center">
                                        {targetUser?.isOnline ? (
                                            <span className="px-2 py-0.5 text-xs font-medium text-green-300 bg-green-500/20 ring-1 ring-green-400/30 rounded-full">
                                                Online
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 text-xs font-medium text-gray-400 bg-gray-600/30 ring-1 ring-gray-500/40 rounded-full">
                                                Offline
                                            </span>
                                        )}
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center  space-x-2 flex-shrink-0">
                            <button  
                                onClick={() => window.history.back()} 
                                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-all duration-300 group text-xs sm:text-sm"
                            >
                                <span className="hidden sm:inline">Back</span>
                                <span className="sm:hidden  flex align-self-center">←</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Additional user info for mobile */}
                    
                </div>

                {/* Messages Container - Responsive with controlled scrolling */}
                <div 
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-gray-900/20 scrollbar-thin messages-container"
                    style={{ 
                        scrollBehavior: 'smooth',
                        overscrollBehavior: 'contain' // Prevents scroll from bubbling to parent
                    }}
                >
                    {chatMessages.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10 sm:mt-20 px-4">
                            <div className="text-4xl sm:text-6xl mb-4">💬</div>
                            <p className="text-sm sm:text-lg">No messages yet. Start the conversation!</p>
                           
                        </div>
                    ) : (
                        chatMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} message-animation`}
                            >
                                <div className={`flex max-w-[85%] sm:max-w-xs lg:max-w-md xl:max-w-lg ${message.sender === 'me' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} items-end space-x-2`}>
                                    {message.sender === 'other' && (
                                        <img 
                                            src={targetUser?.photoUrl || "https://via.placeholder.com/40"} 
                                            alt="Avatar" 
                                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-blue-500/30 flex-shrink-0"
                                        />
                                    )}
                                    <div className="group">
                                        <div className={`relative px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl ${
                                            message.sender === 'me' 
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-2 rounded-br-md' 
                                                : 'bg-gray-700/80 text-gray-100 mr-2 rounded-bl-md'
                                        } shadow-lg backdrop-blur-sm`}>
                                            <p className="text-xs sm:text-sm leading-relaxed break-words">{message.text}</p>
                                        </div>
                                        <div className={`text-xs text-gray-400 mt-1 ${message.sender === 'me' ? 'text-right mr-2' : 'text-left ml-2'}`}>
                                            {formatTime(message.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    
                    {/* Typing Indicator - Responsive */}
                    {isTyping && (
                        <div className="flex justify-start message-animation">
                            <div className="flex items-end space-x-2">
                                <img 
                                    src={targetUser?.photoUrl || "https://via.placeholder.com/40"} 
                                    alt="Avatar" 
                                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-blue-500/30 flex-shrink-0"
                                />
                                <div className="bg-gray-700/80 backdrop-blur-sm px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-2xl rounded-bl-md mr-2 shadow-lg">
                                    <div className="flex space-x-1.5">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full bounce-dot" style={{ animationDelay: '0s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full bounce-dot" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full bounce-dot" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input - Responsive */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700 px-3 sm:px-6 py-3 sm:py-4 rounded-b-xl sm:rounded-b-2xl shadow-inner">
                    <form 
                        onSubmit={handleSendMessage} 
                        className="flex items-center space-x-2 sm:space-x-4 w-full"
                        style={{ backgroundColor: 'transparent' }}
                    >
                        {/* Input Field */}
                        <input 
                            type="text" 
                            value={newMessage} 
                            onChange={handleInputChange} 
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 sm:px-5 sm:py-3 bg-white text-gray-900 placeholder-gray-500 rounded-full border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-md text-sm sm:text-base"
                            required
                        />

                        {/* Send Button */}
                        <button 
                            type="submit" 
                            disabled={!newMessage.trim()}
                            className="px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 hover:brightness-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                            <span className="hidden sm:inline">Send</span>
                            <span className="sm:hidden">→</span>
                        </button>
                    </form>
                </div>


            </div>
        </div>
    );
};

export default Chat;