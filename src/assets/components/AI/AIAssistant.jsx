import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../config/api';
import { authUtils } from '../../../utils/auth';
import { Role } from '../../../types';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const streamingMessageRef = useRef('');
  const shouldAutoScrollRef = useRef(true);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      role: Role.Assistant,
      content: "Hello! I'm your DevMeet AI Assistant powered by Gemini. I can help you with programming questions, learning resources, career guidance, and more. What would you like to know?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Check if user is near bottom before auto-scrolling
  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollToBottom();
    }
  }, [messages, isStreaming]);

  // Track scroll position to determine if user has scrolled up
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      shouldAutoScrollRef.current = isNearBottom;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (userInput) => {
    const userMessage = {
      role: Role.User,
      content: userInput.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsStreaming(true);
    streamingMessageRef.current = '';

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        },
        credentials: 'include',
        body: JSON.stringify({ message: userInput })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Create a placeholder message for streaming
      const streamingMessageId = Date.now();
      setMessages(prev => [...prev, {
        id: streamingMessageId,
        role: Role.Assistant,
        content: '',
        timestamp: new Date(),
        isStreaming: true
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              // Streaming complete
              setIsStreaming(false);
              setMessages(prev => prev.map(msg => 
                msg.id === streamingMessageId 
                  ? { ...msg, isStreaming: false }
                  : msg
              ));
              break;
            }

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.error) throw new Error(parsed.error);

              if (parsed.chunk) {
                streamingMessageRef.current += parsed.chunk;
                setMessages(prev => prev.map(msg => 
                  msg.id === streamingMessageId 
                    ? { ...msg, content: streamingMessageRef.current }
                    : msg
                ));
              }
            } catch (parseError) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      setIsStreaming(false);
      
      const errorMessage = {
        role: Role.Assistant,
        content: error.message || "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isStreaming);
        return [...filtered, errorMessage];
      });
      
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all messages? This will reset your conversation.')) {
      fetch(`${API_BASE_URL}/api/ai/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authUtils.getAuthHeaders()
        },
        credentials: 'include'
      });

      const welcomeMessage = {
        role: Role.Assistant,
        content: "Hello! I'm your DevMeet AI Assistant. I can help you with programming questions, learning resources, career guidance, and more. What would you like to know?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      toast.info('Chat cleared');
    }
  };

  return (
    <>
      {/* Background Overlay - Fixed positioning to prevent main scroll movement */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-0 sm:p-4 md:p-8 z-50 overflow-hidden pt-16 sm:pt-4">
        {/* Chat Container - Elevated Card */}
        <div className="w-full h-full sm:w-[95vw] sm:max-w-4xl sm:h-[90vh] md:h-[85vh] sm:mt-0 flex flex-col bg-gray-900/95 backdrop-blur-xl rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border border-gray-700/50 overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="border-b border-gray-700/60 bg-gray-800/90 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between flex-shrink-0 min-h-[52px] sm:min-h-[60px]">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-base sm:text-lg font-semibold text-white leading-tight">
                  Dev-AI 
                </h1>
              </div>
            </div>
            <button
              onClick={handleClearChat}
              disabled={isLoading}
              className="text-sm px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex-shrink-0 max-w-[80px]  sm:max-w-none overflow-hidden"
            >
              Clear
            </button>
          </div>

          {/* Messages Container */}
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="px-3 sm:px-6 py-4 sm:py-6 min-h-full">
              {messages.map((msg, idx) => (
                <MessageBubble key={msg.id || idx} message={msg} />
              ))}
              {isStreaming && messages[messages.length - 1]?.content === '' && (
                <TypingIndicator />
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>

          {/* Input Container */}
          <div className="flex-shrink-0">
            <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Add slide-up animation and custom scrollbar */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        /* Custom Scrollbar Styles */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.3) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
        
        /* Mobile-specific optimizations */
        @media (max-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 3px;
          }
        }
        
        /* Prevent zoom on input focus on iOS */
        @media screen and (max-width: 640px) {
          input, textarea, select {
            font-size: 16px !important;
          }
        }
      `}</style>
    </>
  );
};

export default AIAssistant;
