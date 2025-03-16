
import { Groq } from "groq-sdk";

const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";

const groqClient = new Groq({
  apiKey,
});

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
};

export const generateChatResponse = async (messages: MessageType[]) => {
  if (!apiKey) {
    throw new Error("GROQ API key is not configured");
  }

  try {
    const chatMessages = messages.map(({ role, content }) => ({
      role,
      content,
    }));

    const completion = await groqClient.chat.completions.create({
      messages: chatMessages,
      model: "llama3-8b-8192",
    });

    return completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
};
