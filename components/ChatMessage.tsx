
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface MessageProps {
  message: {
    role: string;
    content: string;
    id: string;
  };
  index: number;
  darkMode: boolean;
}

interface LoadingDotProps {
  delay: number;
  darkMode: boolean;
}

const LoadingDot: React.FC<LoadingDotProps> = ({ delay, darkMode }) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        delay: delay,
      }}
      className={`inline-block w-2 h-2 mx-0.5 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}`}
    />
  );
};

export const ThinkingAnimation: React.FC<{darkMode: boolean}> = ({ darkMode }) => {
  return (
    <div className="flex items-center space-x-2 p-2">
      <div className="flex">
        <LoadingDot delay={0} darkMode={darkMode} />
        <LoadingDot delay={0.3} darkMode={darkMode} />
        <LoadingDot delay={0.6} darkMode={darkMode} />
      </div>
    </div>
  );
};

const ChatMessage: React.FC<MessageProps> = ({ message, index, darkMode }) => {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState<{[key: string]: boolean}>({});

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied({...copied, [id]: true});
    
    setTimeout(() => {
      setCopied({...copied, [id]: false});
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`mb-6 flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex items-start max-w-[85%] md:max-w-[75%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? "ml-3" : "mr-3"}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
            isUser 
              ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white" 
              : "bg-gradient-to-br from-purple-400 to-purple-600 text-white"
          }`}>
            {isUser ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M16.5 7.5h-9v9h9v-9z" />
                <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15H21a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3a.75.75 0 010-1.5h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75zM6 6.75A.75.75 0 016.75 6h10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
        
        {/* Message Content */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`relative rounded-2xl px-5 py-3.5 shadow-lg ${
            isUser
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              : darkMode 
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 text-gray-100" 
                : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 text-gray-800"
          }`}
        >
          <div className="prose dark:prose-invert prose-pre:p-0 prose-pre:m-0 max-w-none">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const code = String(children).replace(/\n$/, "");
                  const id = Math.random().toString(36).substring(7);
                  
                  if (!inline && match) {
                    return (
                      <div className="relative group my-4 overflow-hidden rounded-lg shadow-lg">
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 text-xs text-gray-200">
                          <span className="font-mono font-medium">{match[1]}</span>
                          <button
                            onClick={() => copyToClipboard(code, id)}
                            className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                            aria-label="Copy code"
                          >
                            {copied[id] ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                </svg>
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                  <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
                                  <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z" clipRule="evenodd" />
                                </svg>
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={darkMode ? atomDark : oneLight}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                          customStyle={{
                            margin: 0,
                            borderRadius: '0 0 0.5rem 0.5rem',
                            padding: '1rem',
                          }}
                        >
                          {code}
                        </SyntaxHighlighter>
                      </div>
                    );
                  } else if (inline) {
                    return (
                      <code className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono text-sm">
                        {children}
                      </code>
                    );
                  } else {
                    return (
                      <div className="relative group my-4 rounded-lg overflow-hidden shadow-lg">
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 text-xs text-gray-200">
                          <span className="font-mono font-medium">Code</span>
                          <button
                            onClick={() => copyToClipboard(code, id)}
                            className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                            aria-label="Copy code"
                          >
                            {copied[id] ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                </svg>
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                  <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
                                  <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z" clipRule="evenodd" />
                                </svg>
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={darkMode ? atomDark : oneLight}
                          language="text"
                          PreTag="div"
                          {...props}
                          customStyle={{
                            margin: 0,
                            borderRadius: '0 0 0.5rem 0.5rem',
                            padding: '1rem',
                          }}
                        >
                          {code}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          
          {/* Message time */}
          <div 
            className={`text-xs mt-2 ${
              isUser ? "text-blue-200" : "text-gray-500 dark:text-gray-400"
            } text-right font-medium`}
          >
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
