
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model = 'llama3-8b-8192' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Format messages for Groq API
    const formattedMessages = messages.map(({ role, content }: Message) => ({
      role,
      content
    }));

    // Call Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    return res.status(200).json({ content });
  } catch (error) {
    console.error('Error calling Groq API:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
