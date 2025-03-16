
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  onDeleteConversation: (id: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);

  const handleDeleteAll = () => {
    if (conversations.length > 0) {
      conversations.forEach(conv => onDeleteConversation(conv.id));
      setDeleteAllConfirm(false);
    }
  };

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
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Recent Chats</h3>
          {conversations.length > 0 && (
            <button
              onClick={() => setDeleteAllConfirm(true)}
              className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
            >
              Clear All
            </button>
          )}
        </div>
        
        {/* Delete all confirmation */}
        <AnimatePresence>
          {deleteAllConfirm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-2 bg-red-100 dark:bg-red-900/30 p-2 rounded-lg"
            >
              <p className="text-xs text-red-700 dark:text-red-400 mb-2">Delete all conversations?</p>
              <div className="flex space-x-2">
                <button
                  onClick={handleDeleteAll}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                >
                  Yes, delete all
                </button>
                <button
                  onClick={() => setDeleteAllConfirm(false)}
                  className="text-xs bg-gray-300 dark:bg-gray-700 px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {conversations.length > 0 ? (
          <ul className="space-y-1">
            {conversations.map((conversation) => (
              <motion.li
                key={conversation.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
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
                
                {deleteConfirmId === conversation.id ? (
                  <div className="absolute right-2 top-2 flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                        setDeleteConfirmId(null);
                      }}
                      className="p-1 rounded-full bg-red-500 text-white"
                      aria-label="Confirm delete"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(null);
                      }}
                      className="p-1 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      aria-label="Cancel delete"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(conversation.id);
                    }}
                    className="absolute right-2 top-2 p-1 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900 transition-colors"
                    aria-label="Delete conversation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                )}
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
