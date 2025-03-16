
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConversationType } from "../utils/groq-client";

interface ChatHistoryProps {
  conversations: ConversationType[];
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewConversation: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
  showSettings,
  setShowSettings,
}) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chats' | 'settings'>(showSettings ? 'settings' : 'chats');

  // Update local active tab when settings visibility changes
  React.useEffect(() => {
    setActiveTab(showSettings ? 'settings' : 'chats');
  }, [showSettings]);

  const handleTabChange = (tab: 'chats' | 'settings') => {
    setActiveTab(tab);
    setShowSettings(tab === 'settings');
  };

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b dark:border-gray-800 mb-2">
        <motion.button
          whileHover={{ backgroundColor: "rgba(92, 106, 196, 0.1)" }}
          onClick={() => handleTabChange('chats')}
          className={`flex-1 py-3 font-medium ${
            activeTab === 'chats'
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
          }`}
        >
          Chats
        </motion.button>
        <motion.button
          whileHover={{ backgroundColor: "rgba(92, 106, 196, 0.1)" }}
          onClick={() => handleTabChange('settings')}
          className={`flex-1 py-3 font-medium ${
            activeTab === 'settings'
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
          }`}
        >
          Settings
        </motion.button>
      </div>

      {/* New Chat Button */}
      {activeTab === 'chats' && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewConversation}
          className="mb-4 py-2 px-4 bg-primary text-white rounded-lg shadow hover:shadow-md transition-all w-full flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          New Chat
        </motion.button>
      )}

      {/* Conversations List */}
      {activeTab === 'chats' && (
        <div className="flex-grow overflow-y-auto">
          <AnimatePresence>
            {conversations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 mt-8 p-4"
              >
                No conversations yet. Start a new chat!
              </motion.div>
            ) : (
              <motion.ul
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="space-y-2"
              >
                {conversations.map((conversation) => (
                  <motion.li
                    key={conversation.id}
                    variants={itemVariants}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div
                      className={`relative group rounded-lg overflow-hidden ${
                        activeConversation === conversation.id
                          ? "bg-gray-200 dark:bg-gray-800"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {confirmDelete === conversation.id ? (
                        <div className="p-3 flex justify-between items-center">
                          <span className="text-sm text-red-500">
                            Delete this chat?
                          </span>
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                onDeleteConversation(conversation.id);
                                setConfirmDelete(null);
                              }}
                              className="text-xs px-2 py-1 bg-red-500 text-white rounded"
                            >
                              Yes
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setConfirmDelete(null)}
                              className="text-xs px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded"
                            >
                              No
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectConversation(conversation.id)}
                            className="w-full text-left p-3 pr-10"
                          >
                            <div className="font-medium truncate">
                              {conversation.title || "New conversation"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex justify-between">
                              <span>{formatDate(conversation.timestamp)}</span>
                              {conversation.model && (
                                <span className="text-primary text-xs">
                                  {conversation.model.split('-')[0]}
                                </span>
                              )}
                            </div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setConfirmDelete(conversation.id)}
                            className="absolute right-2 top-2 p-1 rounded-full opacity-0 group-hover:opacity-100"
                          >
                            <svg
                              className="w-4 h-4 text-gray-500 hover:text-red-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              ></path>
                            </svg>
                          </motion.button>
                        </>
                      )}
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
