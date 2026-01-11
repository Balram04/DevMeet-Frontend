import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSend(input);
    setInput('');
    
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const SparklesIcon = () => (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );

  return (
    <div className="border-t border-gray-700/60 bg-gray-800/80 backdrop-blur-md sticky bottom-0 left-0 right-0 px-3 sm:px-4 py-3 sm:py-4 z-10 safe-area-bottom">
      <div className="max-w-3xl mx-auto relative">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-gray-700/60 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-600/50 focus-within:border-purple-500/50 focus-within:bg-gray-700/80 focus-within:shadow-lg focus-within:shadow-purple-500/20 transition-all duration-300">
         

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Gemini anything..."
            disabled={isLoading}
            className="w-full bg-transparent border-none outline-none resize-none py-2 sm:py-2 text-base sm:text-base text-white placeholder-gray-400 max-h-[100px] sm:max-h-[120px] overflow-y-auto leading-relaxed"
            rows={1}
            style={{ minHeight: '28px', fontSize: '16px' }}
          />
          
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-2.5 sm:p-2.5 rounded-full flex-shrink-0 transition-all duration-200 flex items-center justify-center min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px]
              ${!input.trim() || isLoading 
                ? 'bg-gray-600/50 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white active:scale-95 shadow-lg hover:shadow-purple-500/50'}`}
          >
            <Send size={18} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default ChatInput;
