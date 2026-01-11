import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Role } from '../../../types';
import { User } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const isUser = message.role === Role.User;
  const isError = message.isError;

  // Icon component for AI
  const BotIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const AlertIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );

  return (
    <div className={`flex w-full mb-4 sm:mb-6 message-animation ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[92%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 sm:gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg
          ${isUser ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : isError ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-gradient-to-br from-purple-600 to-blue-600'} text-white`}>
          {isUser ? <User size={14} className="sm:w-[18px] sm:h-[18px]" /> : isError ? <AlertIcon /> : <BotIcon />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0`}>
          <div
            className={`px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-lg text-sm sm:text-sm leading-relaxed overflow-hidden break-words
              ${isUser 
                ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-sm' 
                : isError
                  ? 'bg-red-500/10 text-red-200 border border-red-500/20 rounded-tl-sm'
                  : 'bg-gray-800/80 backdrop-blur-sm text-gray-100 border border-gray-700/50 rounded-tl-sm'
              }`}
          >
            {isError ? (
               <p className="break-words">{message.content}</p>
            ) : (
              <div className={`markdown-content prose prose-sm sm:prose-base max-w-none ${isUser ? 'prose-invert' : 'prose-neutral'}`}>
                <ReactMarkdown
                  components={{
                    // Override link to open in new tab
                    a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-purple-300 break-words" {...props} />,
                    // Style code blocks
                    code: ({ node, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const isInline = !match && !String(children).includes('\n');
                      return isInline ? (
                        <code className={`${isUser ? 'bg-purple-700/50' : 'bg-gray-900/60'} px-1.5 py-0.5 rounded text-purple-300 text-xs sm:text-sm font-mono break-words`} {...props}>
                          {children}
                        </code>
                      ) : (
                        <div className="relative my-2 sm:my-3 rounded-lg overflow-x-auto bg-gray-900/80 text-gray-100 p-3 sm:p-4 text-xs sm:text-sm font-mono border border-gray-700/50">
                           <code className="block" {...props}>{children}</code>
                        </div>
                      );
                    },
                    // Style paragraphs
                    p: ({ children }) => <p className="mb-2 last:mb-0 break-words">{children}</p>,
                    // Style lists
                    ul: ({ children }) => <ul className="list-disc ml-4 sm:ml-5 mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 sm:ml-5 mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="mb-1 break-words">{children}</li>,
                    // Style headings
                    h1: ({ children }) => <h1 className="text-base sm:text-lg font-bold mb-2 mt-3 break-words">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-sm sm:text-base font-bold mb-2 mt-3 break-words">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-bold mb-2 mt-2 break-words">{children}</h3>,
                    // Style blockquotes
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-purple-500/50 pl-3 sm:pl-4 py-1 my-2 italic text-gray-300">{children}</blockquote>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
          <div className={`flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
            <span className="text-[10px] sm:text-[11px] text-gray-500 whitespace-nowrap">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isUser && (
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
