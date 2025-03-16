
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage, { ThinkingAnimation } from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import ChatHistory from "../components/ChatHistory";
import { generateChatResponse, ConversationType, MessageType, MODELS, ModelType } from "../utils/groq-client";
import { getConversations, saveConversation, generateId, getConversation } from "../utils/storage";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations from localStorage
  useEffect(() => {
    const loadedConversations = getConversations();
    setConversations(loadedConversations);
    
    // Set active conversation to the most recent one if it exists
    if (loadedConversations.length > 0) {
      setActiveConversation(loadedConversations[0].id);
      setMessages(loadedConversations[0].messages);
      setSelectedModel(loadedConversations[0].model || "llama3-8b-8192");
    }
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

    const updatedMessages = [...currentMessages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Generate AI response
      const aiResponse = await generateChatResponse(updatedMessages, selectedModel);
      
      // Add AI message
      const aiMessage: MessageType = {
        role: "assistant",
        content: aiResponse,
        id: generateId(),
      };
      
      // Update messages
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      
      // Create or update conversation
      const existingConv = getConversation(currentConvId);
      const conversationTitle = existingConv?.title || content.substring(0, 30);
      
      const updatedConversation: ConversationType = {
        id: currentConvId,
        title: conversationTitle,
        messages: finalMessages,
        timestamp: Date.now(),
        model: selectedModel,
      };
      
      // Save to storage
      saveConversation(updatedConversation);
      
      // Update conversations list
      const updatedConversations = getConversations();
      setConversations(updatedConversations);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      const errorMessage: MessageType = {
        role: "assistant",
        content: "Sorry, there was an error processing your request. Please try again.",
        id: generateId(),
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setActiveConversation(null);
    setMessages([]);
  };

  const handleSelectConversation = (id: string) => {
    const conversation = getConversation(id);
    if (conversation) {
      setActiveConversation(id);
      setMessages(conversation.messages);
      setSelectedModel(conversation.model || "llama3-8b-8192");
      setIsOpen(false); // Close sidebar on mobile
    }
  };
  
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };

  // Empty state suggestions
  const suggestions = [
    "Explain quantum computing in simple terms",
    "Write a short story about a robot who discovers emotions",
    "How do I improve my coding skills?",
    "What are the best practices for web accessibility?"
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Head>
        <title>AI Chat</title>
        <meta name="description" content="Modern AI Chat interface" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect py-3 px-4 flex items-center justify-between z-10"
      >
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-500 text-white mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">AI Chat</h1>
          </motion.div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
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
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 md:hidden"
            >
              <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}></div>
              <div className="absolute left-0 top-0 h-full w-4/5 max-w-xs bg-white dark:bg-gray-900 shadow-lg">
                <ChatHistory
                  conversations={conversations}
                  activeConversation={activeConversation}
                  onSelectConversation={handleSelectConversation}
                  onNewConversation={handleNewConversation}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className="hidden md:block md:w-72 lg:w-80 border-r dark:border-gray-800 bg-white dark:bg-gray-900">
          <ChatHistory
            conversations={conversations}
            activeConversation={activeConversation}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto message-area">
            <div className="max-w-4xl mx-auto">
              {messages.length > 0 ? (
                <>
                  {messages.map((message, index) => (
                    <ChatMessage key={message.id} message={message} index={index} darkMode={darkMode} />
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start mb-4"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                            </svg>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
                          <ThinkingAnimation darkMode={darkMode} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col items-center justify-center min-h-[80vh]"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center max-w-lg bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
                  >
                    <motion.div 
                      className="text-7xl mb-6 mx-auto"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      💬
                    </motion.div>
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Welcome to AI Chat</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                      Powered by Groq and Llama models, this AI assistant can help answer questions, generate content, and more.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Try asking:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {suggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSendMessage(suggestion)}
                            className="block w-full p-3 text-left rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
            <div className="max-w-4xl mx-auto">
              <ChatInput 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
                models={MODELS}
                selectedModel={selectedModel}
                onSelectModel={handleModelChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
