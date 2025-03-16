
import { motion } from "framer-motion";
import React from "react";

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
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-white rounded-tr-none"
            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none"
        }`}
      >
        <pre className="whitespace-pre-wrap font-sans">
          <div className="prose dark:prose-invert">{message.content}</div>
        </pre>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
