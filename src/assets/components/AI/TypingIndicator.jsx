import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 sm:gap-2.5 mb-3 sm:mb-4 message-animation">
      {/* Avatar */}
      <div className="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Typing dots */}
      <div className="flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-800/80 backdrop-blur-sm rounded-2xl rounded-tl-sm border border-gray-700/50 shadow-lg w-fit">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500 rounded-full animate-bounce"></div>
        <span className="text-xs sm:text-sm text-gray-400 ml-1 sm:ml-2 whitespace-nowrap">AI is thinking...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
