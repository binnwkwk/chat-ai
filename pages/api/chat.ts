
import type { NextApiRequest, NextApiResponse } from 'next';
import { Groq } from "groq-sdk";
import axios from 'axios';

type Message = {
  role: string;
  content: string;
  id?: string;
};

type ResponseData = {
  content: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Extract messages without IDs for the API
    const formattedMessages = messages.map((msg: Message) => ({
      role: msg.role,
      content: msg.content
    }));

    // Use direct API call with axios
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return res.status(500).json({ error: 'GROQ API key is not configured' });
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: model || 'llama3-8b-8192',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const completion = response.data.choices[0].message.content;
    return res.status(200).json({ content: completion });

  } catch (error: any) {
    console.error('Error calling Groq API:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: error.response?.data?.error?.message || 'Failed to generate response' 
    });
  }
}
