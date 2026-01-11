import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../config/api';
import { authUtils } from '../../utils/auth';
import NavBar from '../components/Navbar';

const Chatbot = () => {
  const initialMessage = {
    role: 'assistant',
    content: "Hi there! 👋 I'm your DevMeet AI Assistant.\n\nI'm here to help you with:\n\n• Programming concepts & debugging\n• Learning resources & study plans\n• Career guidance & interview tips\n• Project ideas & tech recommendations\n\nHow can I assist you today?",
    timestamp: new Date()
  };

  const [messages, setMessages] = useState([initialMessage]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatbotStatus, setChatbotStatus] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    checkChatbotStatus();
  }, []);

  useEffect(() => {
    scrollToBottom();
    handleScroll();
  }, [messages]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  };

  const checkChatbotStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/chatbot/status`);
      setChatbotStatus(res.data);
    } catch (error) {
      console.error('Error checking chatbot status:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('📋 Copied to clipboard!', { autoClose: 2000 });
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([initialMessage]);
      toast.info('🗑️ Chat cleared!');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/chatbot/message`,
        { message: userMessage.content },
        {
          withCredentials: true,
          headers: authUtils.getAuthHeaders()
        }
      );

      setIsTyping(false);

      if (res.data.success) {
        const aiMessage = {
          role: 'assistant',
          content: res.data.response.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      const errorMessage = {
        role: 'assistant',
        content: error.response?.data?.fallback || "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to get AI response', {
        position: 'top-right',
        autoClose: 3000
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const getRecommendations = async () => {
    if (loading) return;
    
    setLoading(true);
    setIsTyping(true);
    
    try {
      const res = await axios.get(`${API_BASE_URL}/chatbot/recommendations`, {
        withCredentials: true,
        headers: authUtils.getAuthHeaders()
      });

      setIsTyping(false);

      if (res.data.success) {
        const recMessage = {
          role: 'assistant',
          content: res.data.recommendations.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, recMessage]);
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setIsTyping(false);
      toast.error('Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  const formatMessage = (content) => {
    // Split message into paragraphs and format code blocks
    const lines = content.split('\n');
    const formatted = [];
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLang = '';

    lines.forEach((line, index) => {
      // Check for code block markers
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockLang = line.trim().substring(3) || 'code';
          codeBlockContent = '';
        } else {
          inCodeBlock = false;
          formatted.push(
            <div key={`code-${index}`} className="my-3">
              <div className="flex items-center justify-between bg-gray-900/80 px-4 py-2 rounded-t-lg border-b border-gray-700">
                <span className="text-xs font-mono text-gray-400">{codeBlockLang}</span>
                <button
                  onClick={() => copyToClipboard(codeBlockContent)}
                  className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              </div>
              <pre className="bg-gray-900/80 px-4 py-3 rounded-b-lg overflow-x-auto">
                <code className="text-sm font-mono text-gray-200 leading-relaxed">{codeBlockContent}</code>
              </pre>
            </div>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent += (codeBlockContent ? '\n' : '') + line;
        return;
      }

      // Handle inline code with backticks
      if (line.includes('`')) {
        const parts = line.split(/(`[^`]+`)/g);
        formatted.push(
          <p key={`line-${index}`} className="mb-2 leading-relaxed">
            {parts.map((part, i) => {
              if (part.startsWith('`') && part.endsWith('`')) {
                return (
                  <code key={i} className="px-1.5 py-0.5 bg-gray-900/60 text-purple-300 rounded text-sm font-mono">
                    {part.slice(1, -1)}
                  </code>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </p>
        );
      }
      // Handle bullet points
      else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        formatted.push(
          <div key={`bullet-${index}`} className="flex gap-2 mb-2 leading-relaxed">
            <span className="text-purple-400 mt-1">•</span>
            <span>{line.replace(/^[•-]\s*/, '')}</span>
          </div>
        );
      }
      // Handle numbered lists
      else if (/^\d+\./.test(line.trim())) {
        formatted.push(
          <div key={`number-${index}`} className="flex gap-2 mb-2 leading-relaxed">
            <span className="text-purple-400 font-semibold">{line.match(/^\d+\./)[0]}</span>
            <span>{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }
      // Regular paragraphs
      else if (line.trim()) {
        formatted.push(
          <p key={`para-${index}`} className="mb-2 leading-relaxed">
            {line}
          </p>
        );
      }
      // Empty lines for spacing
      else if (formatted.length > 0) {
        formatted.push(<div key={`space-${index}`} className="h-2" />);
      }
    });

    return <div className="text-[15px]">{formatted}</div>;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', {
      position: 'bottom-center',
      autoClose: 2000,
      hideProgressBar: true
    });
  };

  const quickQuestions = [
    { icon: "⚛️", text: "How do I start learning React?", gradient: "from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20" },
    { icon: "⚡", text: "Explain async/await in JavaScript", gradient: "from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20" },
    { icon: "🔌", text: "What are REST API best practices?", gradient: "from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20" },
    { icon: "💼", text: "How to prepare for technical interviews?", gradient: "from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20" },
    { icon: "🎯", text: "Recommend a full-stack learning path", gradient: "from-red-500/10 to-rose-500/10 hover:from-red-500/20 hover:to-rose-500/20" },
    { icon: "🐛", text: "How to debug code effectively?", gradient: "from-indigo-500/10 to-violet-500/10 hover:from-indigo-500/20 hover:to-violet-500/20" }
  ];

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-14 sm:pt-16 px-2 sm:px-4 pb-4 sm:pb-6">
        <div className="max-w-5xl mx-auto h-[calc(100vh-80px)] sm:h-[calc(100vh-120px)] flex flex-col">
          
          {/* Header */}
          <div className="text-center mb-3 sm:mb-6 pt-2 sm:pt-4">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-40"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-2 sm:p-3 rounded-2xl">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                AI Assistant
              </h1>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm font-medium">
              Your intelligent programming companion, always ready to help
            </p>
            {chatbotStatus && !chatbotStatus.available && (
              <div className="mt-2 sm:mt-3 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-[10px] sm:text-xs font-medium">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                AI service temporarily unavailable
              </div>
            )}
          </div>

          {/* Chat Container */}
          <div className="flex-1 bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 shadow-2xl flex flex-col overflow-hidden">
            
            {/* Chat Header */}
            <div className="px-3 sm:px-6 py-2.5 sm:py-4 border-b border-gray-700/60 bg-gray-800/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-200">AI Assistant</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">Online • Typically replies instantly</p>
                  </div>
                </div>
                <button
                  onClick={clearChat}
                  className="group flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] sm:text-xs rounded-md sm:rounded-lg transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="hidden sm:inline">Clear Chat</span>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-2 sm:px-4 py-3 sm:py-6 space-y-4 sm:space-y-6 custom-scrollbar"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-animation`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 mr-2 sm:mr-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-2xl px-3 py-2.5 sm:px-5 sm:py-3.5 shadow-lg ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-sm'
                          : msg.isError
                          ? 'bg-red-500/10 text-red-200 border border-red-500/20 rounded-tl-sm'
                        : 'bg-gray-800/80 backdrop-blur-sm text-gray-100 border border-gray-700/50 rounded-tl-sm'
                      }`}
                    >
                      {msg.role === 'assistant' && !msg.isError && (
                        <div className="flex items-center justify-between mb-2 sm:mb-3 pb-1.5 sm:pb-2 border-b border-gray-700/50">
                          <span className="text-[10px] sm:text-xs font-semibold text-purple-400 tracking-wide">AI RESPONSE</span>
                          <button
                            onClick={() => copyToClipboard(msg.content)}
                            className="text-gray-400 hover:text-white transition-colors p-1 sm:p-1.5 hover:bg-gray-700/50 rounded-lg"
                            title="Copy message"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      )}
                      
                      <div className="prose prose-invert max-w-none">
                        {msg.role === 'assistant' ? formatMessage(msg.content) : (
                          <p className="text-xs sm:text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 px-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[10px] sm:text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.role === 'user' && (
                        <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 ml-2 sm:ml-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start message-animation">
                  <div className="flex-shrink-0 mr-2 sm:mr-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl rounded-tl-sm px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-400 ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to Bottom Button */}
            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-24 sm:bottom-36 right-3 sm:right-8 bg-purple-600 hover:bg-purple-700 text-white p-2 sm:p-3 rounded-full shadow-lg transition-all z-10"
                title="Scroll to bottom"
              >
                <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            )}

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-2 sm:px-6 py-2 sm:py-4 border-t border-gray-700/60 bg-gray-800/60">
                <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                  <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-gray-300 text-[10px] sm:text-sm font-semibold">Quick Start</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2.5 mb-2 sm:mb-4">
                  {quickQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(question.text)}
                      disabled={loading}
                      className={`group text-left px-2 py-2 sm:px-3 sm:py-2.5 bg-gradient-to-br ${question.gradient} backdrop-blur-sm text-gray-200 text-[10px] sm:text-xs rounded-lg sm:rounded-xl transition-all duration-200 border border-gray-700/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-base sm:text-lg">{question.icon}</span>
                        <span className="group-hover:text-white transition-colors leading-snug line-clamp-2">{question.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={getRecommendations}
                  disabled={loading}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600 hover:to-blue-600 text-white text-[10px] sm:text-xs rounded-lg sm:rounded-xl transition-all duration-200 font-semibold border border-purple-500/30 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Get Personalized Recommendations
                </button>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="px-2 sm:px-6 py-2 sm:py-4 border-t border-gray-700/60 bg-gray-800/80 backdrop-blur-sm">
              <div className="flex gap-1.5 sm:gap-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full px-2.5 py-2 sm:px-5 sm:py-3 bg-gray-700/60 border border-gray-600/50 rounded-lg text-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    disabled={loading}
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  className="px-2.5 py-2 sm:px-4 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all disabled:opacity-50 font-semibold text-xs sm:text-sm flex items-center gap-1"
                  title="Send"
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Send</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
              <div className="mt-1.5 sm:mt-2 text-center">
                <span className="text-gray-500 text-[9px] sm:text-xs">
                  <span className="hidden sm:inline">Powered by </span>
                  <span className="font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Gemini AI</span>
                </span>
              </div>
            </form>
          </div>

          {/* Footer Info */}
          <div className="mt-2 sm:mt-4 text-center">
            <p className="text-gray-600 text-[10px] sm:text-xs flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Your conversations are private and secure</span>
              <span className="mx-2">•</span>
              <span>Always learning, always helpful</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
