
import axios from "axios";

export type MessageType = {
  role: "user" | "assistant" | "system";
  content: string;
  id: string;
};

export type ConversationType = {
  id: string;
  title: string;
  messages: MessageType[];
  timestamp: number;
  model?: string;
};

export type ModelType = {
  id: string;
  name: string;
};

export type UserSettings = {
  userName: string;
  userImage: string;
  aiName: string;
  aiImage: string;
  systemPrompt: string;
};

export const DEFAULT_SETTINGS: UserSettings = {
  userName: "User",
  userImage: "/avatars/avatar1.png",
  aiName: "AI Assistant",
  aiImage: "/avatars/ai-avatar.png",
  systemPrompt: "You are a helpful, creative, and friendly AI assistant."
};

export const MODELS: ModelType[] = [
  { id: "llama3-8b-8192", name: "Llama 3 8B" },
  { id: "llama3-70b-8192", name: "Llama 3 70B" },
  { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
  { id: "gemma-7b-it", name: "Gemma 7B" },
  { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" },
  { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet" }
];

export const generateChatResponse = async (
  messages: MessageType[], 
  model: string = "llama3-8b-8192",
  systemPrompt?: string
) => {
  try {
    const messagesToSend = [...messages];
    
    // Add system prompt if provided
    if (systemPrompt) {
      messagesToSend.unshift({
        role: "system",
        content: systemPrompt,
        id: "system-prompt"
      });
    }
    
    const response = await axios.post('/api/chat', {
      messages: messagesToSend,
      model
    });
    
    return response.data.content;
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
};
