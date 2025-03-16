
import type { NextApiRequest, NextApiResponse } from 'next';
import { Groq } from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY || "";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type RequestData = {
  messages: Message[];
};

type ResponseData = {
  content: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ content: '', error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body as RequestData;

    if (!apiKey) {
      return res.status(500).json({ content: '', error: 'GROQ API key is not configured' });
    }

    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      messages,
      model: "llama3-8b-8192",
    });

    const content = completion.choices[0]?.message?.content || "";
    return res.status(200).json({ content });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return res.status(500).json({ 
      content: '', 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}
