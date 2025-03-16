
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import ChatHistory from "../components/ChatHistory";
import Settings from "../components/Settings";
import { 
  generateChatResponse, 
  ConversationType, 
  MessageType, 
  MODELS, 
  DEFAULT_SETTINGS,
  UserSettings
} from "../utils/groq-client";
import { 
  getConversations, 
  saveConversation, 
  generateId, 
  getConversation, 
  deleteConversation as deleteConversationStorage,
  getUserSettings,
  saveUserSettings
} from "../utils/storage";
import ModelSelector from "../components/ModelSelector";

interface HomeProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const Home: NextPage<HomeProps> = ({ darkMode, setDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("llama3-8b-8192");
  const [showSettings, setShowSettings] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations and settings from localStorage
  useEffect(() => {
    const loadedConversations = getConversations();
    setConversations(loadedConversations);
    
    // Set active conversation to the most recent one if it exists
    if (loadedConversations.length > 0) {
      setActiveConversation(loadedConversations[0].id);
      setMessages(loadedConversations[0].messages);
      setSelectedModel(loadedConversations[0].model || "llama3-8b-8192");
    }

    // Load user settings
    const settings = getUserSettings();
    setUserSettings(settings);
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    let currentConvId = activeConversation;
    let currentMessages = [...messages];

    // If no active conversation, create a new one
    if (!currentConvId) {
      currentConvId = generateId();
      setActiveConversation(currentConvId);
    }

    // Add user message
    const userMessage: MessageType = {
      role: "user",
      content,
      id: generateId(),
    };

    // Update state with new message
    const updatedMessages = [...currentMessages, userMessage];
    setMessages(updatedMessages);

    // Save conversation
    const conversation: ConversationType = {
      id: currentConvId,
      title: updatedMessages[0]?.content.slice(0, 30) || "New conversation",
      messages: updatedMessages,
      timestamp: Date.now(),
      model: selectedModel,
    };
    saveConversation(conversation);

    // Update conversations list
    const updatedConversations = [
      conversation,
      ...conversations.filter((conv) => conv.id !== currentConvId),
    ];
    setConversations(updatedConversations);

    // Generate AI response
    setIsLoading(true);
    try {
      const aiResponse = await generateChatResponse(
        updatedMessages, 
        selectedModel,
        userSettings.systemPrompt
      );

      const aiMessage: MessageType = {
        role: "assistant",
        content: aiResponse,
        id: generateId(),
      };

      // Update messages with AI response
      const messagesWithAiResponse = [...updatedMessages, aiMessage];
      setMessages(messagesWithAiResponse);

      // Save updated conversation
      const updatedConversation: ConversationType = {
        ...conversation,
        messages: messagesWithAiResponse,
      };
      saveConversation(updatedConversation);

      // Update conversations list
      const newConversations = [
        updatedConversation,
        ...updatedConversations.filter((conv) => conv.id !== currentConvId),
      ];
      setConversations(newConversations);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Add error message
      const errorMessage: MessageType = {
        role: "assistant",
        content: "Sorry, I couldn't generate a response. Please try again.",
        id: generateId(),
      };
      
      const messagesWithError = [...updatedMessages, errorMessage];
      setMessages(messagesWithError);
      
      // Save conversation with error
      const conversationWithError: ConversationType = {
        ...conversation,
        messages: messagesWithError,
      };
      saveConversation(conversationWithError);
      
      // Update conversations list
      const conversationsWithError = [
        conversationWithError,
        ...updatedConversations.filter((conv) => conv.id !== currentConvId),
      ];
      setConversations(conversationsWithError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setActiveConversation(null);
    setMessages([]);
    setShowSettings(false);
  };

  const handleSelectConversation = (id: string) => {
    const conversation = getConversation(id);
    if (conversation) {
      setActiveConversation(id);
      setMessages(conversation.messages);
      setSelectedModel(conversation.model || "llama3-8b-8192");
      setIsOpen(false); // Close sidebar on mobile
      setShowSettings(false);
    }
  };
  
  const handleDeleteConversation = (id: string) => {
    deleteConversationStorage(id);
    
    // Update conversations state
    const updatedConversations = conversations.filter(
      (conv) => conv.id !== id
    );
    setConversations(updatedConversations);
    
    // If the active conversation was deleted, set active to the most recent one
    if (activeConversation === id) {
      if (updatedConversations.length > 0) {
        setActiveConversation(updatedConversations[0].id);
        setMessages(updatedConversations[0].messages);
      } else {
        setActiveConversation(null);
        setMessages([]);
      }
    }
  };
  
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    
    // Update current conversation if there is one
    if (activeConversation) {
      const conversation = getConversation(activeConversation);
      if (conversation) {
        const updatedConversation: ConversationType = {
          ...conversation,
          model: modelId,
        };
        saveConversation(updatedConversation);
        
        // Update conversations list
        const updatedConversations = conversations.map((conv) =>
          conv.id === activeConversation ? updatedConversation : conv
        );
        setConversations(updatedConversations);
      }
    }
  };
  
  const handleSettingsUpdate = (settings: UserSettings) => {
    setUserSettings(settings);
    saveUserSettings(settings);
  };

  // Page animations
  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }
    },
  };
  
  const mainContentVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4 
      }
    },
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Head>
        <title>AI Chat</title>
        <meta name="description" content="Modern AI Chat interface" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b dark:border-gray-800">
        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </motion.button>
          <motion.h1 
            className="text-xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI Chat
          </motion.h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block w-40">
            <ModelSelector 
              models={MODELS} 
              selectedModel={selectedModel} 
              onSelectModel={handleModelChange}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.3 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {darkMode ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </motion.button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Mobile version with overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute top-0 left-0 w-3/4 h-full bg-white dark:bg-gray-900 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="h-full overflow-y-auto p-4">
                  {showSettings ? (
                    <Settings
                      settings={userSettings}
                      updateSettings={handleSettingsUpdate}
                      models={MODELS}
                      selectedModel={selectedModel}
                      onSelectModel={handleModelChange}
                      darkMode={darkMode}
                      setDarkMode={setDarkMode}
                    />
                  ) : (
                    <ChatHistory
                      conversations={conversations}
                      activeConversation={activeConversation}
                      onSelectConversation={handleSelectConversation}
                      onDeleteConversation={handleDeleteConversation}
                      onNewConversation={handleNewConversation}
                      darkMode={darkMode}
                      setDarkMode={setDarkMode}
                      showSettings={showSettings}
                      setShowSettings={setShowSettings}
                    />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar - Desktop version */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          className="hidden md:block w-72 border-r dark:border-gray-800 overflow-y-auto"
        >
          <div className="p-4 h-full">
            {showSettings ? (
              <Settings
                settings={userSettings}
                updateSettings={handleSettingsUpdate}
                models={MODELS}
                selectedModel={selectedModel}
                onSelectModel={handleModelChange}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            ) : (
              <ChatHistory
                conversations={conversations}
                activeConversation={activeConversation}
                onSelectConversation={handleSelectConversation}
                onDeleteConversation={handleDeleteConversation}
                onNewConversation={handleNewConversation}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
              />
            )}
          </div>
        </motion.div>

        {/* Main chat area */}
        <motion.div
          variants={mainContentVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col overflow-hidden"
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <motion.div
                className="h-full flex flex-col items-center justify-center text-center p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-primary bg-opacity-10 p-6 rounded-full mb-6">
                  <svg
                    className="w-12 h-12 text-primary mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to AI Chat!</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Start a conversation with our advanced AI. Ask questions, get creative
                  responses, or just chat about anything you're curious about.
                </p>
              </motion.div>
            ) : (
              <div>
                <AnimatePresence>
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      userName={userSettings.userName}
                      userImage={userSettings.userImage}
                      aiName={userSettings.aiName}
                      aiImage={userSettings.aiImage}
                    />
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t dark:border-gray-800">
            <div className="md:hidden mb-3">
              <ModelSelector 
                models={MODELS} 
                selectedModel={selectedModel} 
                onSelectModel={handleModelChange}
              />
            </div>
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
