
import React from "react";
import { motion } from "framer-motion";

type ConversationType = {
  id: string;
  title: string;
  timestamp: number;
};

interface ChatHistoryProps {
  conversations: ConversationType[];
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
  onNewConversation,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full p-4 bg-gray-50 dark:bg-gray-900"
    >
      <button
        onClick={onNewConversation}
        className="flex items-center justify-center gap-2 mb-4 p-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        New Chat
      </button>
      
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Recent Chats</h3>
        {conversations.length > 0 ? (
          <ul className="space-y-1">
            {conversations.map((conversation) => (
              <motion.li
                key={conversation.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full text-left p-2 rounded-lg truncate ${
                    activeConversation === conversation.id
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                    <span className="truncate">{conversation.title}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(conversation.timestamp).toLocaleDateString()}
                  </div>
                </button>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No chat history yet
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatHistory;
