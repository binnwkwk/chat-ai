
import axios from "axios";

export type MessageType = {
  role: "user" | "assistant";
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

export const MODELS: ModelType[] = [
  { id: "llama3-8b-8192", name: "Llama 3 8B" },
  { id: "llama3-70b-8192", name: "Llama 3 70B" },
  { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
  { id: "gemma-7b-it", name: "Gemma 7B" }
];

export const generateChatResponse = async (messages: MessageType[], model: string = "llama3-8b-8192") => {
  try {
    const response = await axios.post('/api/chat', {
      messages,
      model
    });
    
    return response.data.content;
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
};
