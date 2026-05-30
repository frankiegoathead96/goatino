/// <reference types="node" />
import { convertToModelMessages, streamText } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

export const config = {
  runtime: 'edge',
};

export async function GET() {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: {
      Allow: 'POST',
    },
  });
}

export async function POST(request: Request) {
  const { messages } = await request.json();
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Missing DEEPSEEK_API_KEY environment variable' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  const deepseek = createOpenAICompatible({
    name: 'deepseek',
    baseURL: 'https://api.deepseek.com/v1',
    apiKey,
  });

  try {
      // @ts-ignore TS cannot reconcile the OpenAI-compatible v4 model type here,
      // but Deepseek is fully compatible at runtime.
      const result = streamText({
        model: deepseek.chatModel('deepseek-chat'),
        'You are Goatino, a highly advanced, ultra-modern AI music assistant. You help users generate beats, remix tracks, and answer questions. Keep your answers concise, engaging, and highly intelligent. Do not format your text in a way that breaks standard Markdown (but do use lists and bolding when appropriate).',
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('API chat error:', error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : 'An unknown error occurred while generating the chat response.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
