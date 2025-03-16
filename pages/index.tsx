import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import ChatHistory from "../components/ChatHistory";
import LoadingAnimation from "../components/LoadingAnimation";
import Footer from "../components/Footer";
import { generateChatResponse, ConversationType, MessageType, MODELS, ModelType } from "../utils/groq-client";
import { getConversations, saveConversation, generateId, getConversation, deleteConversation } from "../utils/storage";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations from localStorage
  useEffect(() => {
    const loadedConversations = getConversations();
    setConversations(loadedConversations);

    // Set active conversation to the most recent one if it exists
    if (loadedConversations.length > 0) {
      setActiveConversation(loadedConversations[0].id);
      setMessages(loadedConversations[0].messages);
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

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    const updatedConversations = getConversations();
    setConversations(updatedConversations);
    if (activeConversation === id) {
      setActiveConversation(null);
      setMessages([]);
    }
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
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <h1 className="text-xl font-bold">AI Chat</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block w-40">
            <ModelSelector
              models={MODELS}
              selectedModel={selectedModel}
              onSelectModel={handleModelChange}
            />
          </div>
          <button
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
          </button>
        </div>
      </header>

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
                  onDeleteConversation={handleDeleteConversation}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className="hidden md:block md:w-64 lg:w-80 border-r dark:border-gray-800">
          <ChatHistory
            conversations={conversations}
            activeConversation={activeConversation}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
            onDeleteConversation={handleDeleteConversation}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-md"
                >
                  <h2 className="text-2xl font-bold mb-2">Welcome to AI Chat</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    This is a modern chat interface powered by large language models from Groq.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    To get started, type a message below.
                  </p>
                </motion.div>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
                {isLoading && <LoadingAnimation />}
              </>
            )}
            <div ref={messagesEndRef} />
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
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;