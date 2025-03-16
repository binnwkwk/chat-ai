
import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  message: {
    role: string;
    content: string;
    id: string;
  };
  index: number;
}

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
        className={`max-w-3xl rounded-lg px-4 py-3 ${
          isUser
            ? "bg-primary text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
        }`}
      >
        <div className="prose dark:prose-invert">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatMessage;
