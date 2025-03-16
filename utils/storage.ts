
import { ConversationType, MessageType } from "./groq-client";

// Get conversations from localStorage
export const getConversations = (): ConversationType[] => {
  if (typeof window === "undefined") return [];
  
  const storedConversations = localStorage.getItem("conversations");
  if (storedConversations) {
    try {
      return JSON.parse(storedConversations);
    } catch (error) {
      console.error("Error parsing conversations:", error);
    }
  }
  return [];
};

// Save conversations to localStorage
export const saveConversations = (conversations: ConversationType[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("conversations", JSON.stringify(conversations));
};

// Get a single conversation by ID
export const getConversation = (id: string): ConversationType | undefined => {
  const conversations = getConversations();
  return conversations.find((conv) => conv.id === id);
};

// Save a single conversation
export const saveConversation = (conversation: ConversationType): void => {
  const conversations = getConversations();
  const existingIndex = conversations.findIndex((conv) => conv.id === conversation.id);
  
  if (existingIndex >= 0) {
    conversations[existingIndex] = conversation;
  } else {
    conversations.unshift(conversation);
  }
  
  saveConversations(conversations);
};

// Delete a conversation
export const deleteConversation = (id: string): void => {
  const conversations = getConversations();
  saveConversations(conversations.filter((conv) => conv.id !== id));
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
