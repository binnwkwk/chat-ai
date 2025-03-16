
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
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        duration: 1.2,
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
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? "bg-primary text-white" 
              : "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
          }`}>
            {isUser ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            )}
          </div>
        </div>
        
        {/* Message Content */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`relative rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? "bg-primary bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
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
                      <div className="relative group my-4 overflow-hidden rounded-lg">
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 text-xs text-gray-200">
                          <span>{match[1]}</span>
                          <button
                            onClick={() => copyToClipboard(code, id)}
                            className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                            aria-label="Copy code"
                          >
                            {copied[id] ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                                </svg>
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
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
                            borderRadius: '0 0 0.375rem 0.375rem',
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
                      <div className="relative group my-4 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 text-xs text-gray-200">
                          <span>Code</span>
                          <button
                            onClick={() => copyToClipboard(code, id)}
                            className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                            aria-label="Copy code"
                          >
                            {copied[id] ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                                </svg>
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
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
                            borderRadius: '0 0 0.375rem 0.375rem',
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
            className={`text-xs mt-1 ${
              isUser ? "text-blue-200" : "text-gray-500 dark:text-gray-400"
            } text-right`}
          >
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
