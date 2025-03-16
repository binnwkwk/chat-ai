
import type { NextApiRequest, NextApiResponse } from 'next';
import { Groq } from 'groq-sdk';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, model = 'llama3-8b-8192' } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required and must be an array' });
  }

  // Get API key from environment variable
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ API key is not configured' });
  }

  try {
    const groqClient = new Groq({ apiKey });

    const chatMessages = messages.map(({ role, content }) => ({
      role,
      content,
    }));

    const completion = await groqClient.chat.completions.create({
      messages: chatMessages,
      model,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseContent = completion.choices[0]?.message?.content || 
      "Sorry, I couldn't generate a response.";

    res.status(200).json({ content: responseContent });
  } catch (error: any) {
    console.error('Error calling Groq API:', error);
    res.status(500).json({ 
      error: 'Failed to generate response', 
      details: error.message 
    });
  }
}
