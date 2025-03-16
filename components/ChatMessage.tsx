
import React from "react";
import { motion } from "framer-motion";
import { MessageType } from "../utils/groq-client";

interface ChatMessageProps {
  message: MessageType;
  userName: string;
  userImage: string;
  aiName: string;
  aiImage: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  userName, 
  userImage, 
  aiName, 
  aiImage 
}) => {
  const isUser = message.role === "user";

  const messageVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  // Format code blocks
  const formatContent = (content: string) => {
    // Check if the content contains code blocks (markdown style)
    if (content.includes("```")) {
      // Split by code blocks
      const parts = content.split(/```(?:(\w+))?/);
      return parts.map((part, index) => {
        // Even indices (0, 2, 4, ...) are regular text or language identifier
        // Odd indices (1, 3, 5, ...) are code blocks
        if (index % 2 === 0) {
          return <span key={index} className="whitespace-pre-wrap">{part}</span>;
        } else {
          // This is a code block
          return (
            <pre key={index} className="bg-gray-100 dark:bg-gray-800 p-2 my-2 rounded-md overflow-x-auto">
              <code>{parts[index + 1]}</code>
            </pre>
          );
        }
      });
    }

    // Just return the content if no code blocks
    return <span className="whitespace-pre-wrap">{content}</span>;
  };

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-3xl ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className={`flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}
        >
          <img
            src={isUser ? userImage : aiImage}
            alt={isUser ? "User" : "AI"}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = isUser 
                ? "https://ui-avatars.com/api/?name=User" 
                : "https://ui-avatars.com/api/?name=AI&background=5C6AC4&color=fff";
            }}
          />
        </motion.div>
        <div
          className={`mx-2 ${
            isUser ? "mr-2 text-right" : "ml-2 text-left"
          }`}
        >
          <div className="text-xs text-gray-500 mb-1">
            {isUser ? userName : aiName}
          </div>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`p-3 rounded-lg inline-block ${
              isUser
                ? "bg-primary text-white rounded-tr-none"
                : "bg-gray-200 dark:bg-gray-800 rounded-tl-none"
            }`}
          >
            <div className="prose dark:prose-invert max-w-none">
              {formatContent(message.content)}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
