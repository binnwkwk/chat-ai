
import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

type MessageType = {
  role: "user" | "assistant";
  content: string;
  id: string;
};

interface ChatMessageProps {
  message: MessageType;
  index: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, index }) => {
  const isUser = message.role === "user";
  
  // Function to handle code copying
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    
    // Show a small toast or feedback (optional)
    const toast = document.createElement("div");
    toast.innerText = "Copied to clipboard!";
    toast.className = "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg";
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-white rounded-tr-none"
            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none"
        }`}
      >
        <div className="prose dark:prose-invert prose-sm w-full max-w-none">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                if (!inline && match) {
                  return (
                    <div className="relative">
                      <pre className="p-3 bg-gray-900 dark:bg-gray-950 rounded-md text-sm overflow-x-auto">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                      <button
                        onClick={() => copyCode(String(children))}
                        className="absolute top-2 right-2 p-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                        title="Copy code"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  );
                }
                return <code className={className} {...props}>{children}</code>;
              },
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
