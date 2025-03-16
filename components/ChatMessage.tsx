
import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface MessageProps {
  message: {
    role: string;
    content: string;
    id: string;
  };
  index: number;
}

interface LoadingDotProps {
  delay: number;
}

const LoadingDot: React.FC<LoadingDotProps> = ({ delay }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        delay: delay,
      }}
      className="inline-block w-2 h-2 mx-0.5 rounded-full bg-gray-500"
    />
  );
};

export const ThinkingAnimation: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 p-2">
      <div className="flex">
        <LoadingDot delay={0} />
        <LoadingDot delay={0.3} />
        <LoadingDot delay={0.6} />
      </div>
    </div>
  );
};

const ChatMessage: React.FC<MessageProps> = ({ message, index }) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`relative max-w-3xl rounded-lg px-4 py-3 ${
          isUser
            ? "bg-primary text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
        }`}
      >
        <div className="prose dark:prose-invert prose-pre:p-0 prose-pre:m-0 max-w-none">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const code = String(children).replace(/\n$/, "");
                
                if (!inline && match) {
                  return (
                    <div className="relative group">
                      <button
                        onClick={() => navigator.clipboard.writeText(code)}
                        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy code"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                        customStyle={{
                          borderRadius: '0.375rem',
                          padding: '1rem',
                          margin: '0.5rem 0',
                        }}
                      >
                        {code}
                      </SyntaxHighlighter>
                    </div>
                  );
                } else if (inline) {
                  return (
                    <code className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
                      {children}
                    </code>
                  );
                } else {
                  return (
                    <div className="relative group">
                      <button
                        onClick={() => navigator.clipboard.writeText(code)}
                        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy code"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <SyntaxHighlighter
                        style={atomDark}
                        language="text"
                        PreTag="div"
                        {...props}
                        customStyle={{
                          borderRadius: '0.375rem',
                          padding: '1rem',
                          margin: '0.5rem 0',
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
      </motion.div>
    </motion.div>
  );
};

export default ChatMessage;
