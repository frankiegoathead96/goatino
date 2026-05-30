/// <reference types="node" />

import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from 'ai';
import { createDeepSeek } from '@ai-sdk/deepseek';

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
});

export async function GET() {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: {
      Allow: 'POST',
    },
  });
}

export async function POST(request: Request) {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      return Response.json(
        { error: 'Missing DEEPSEEK_API_KEY environment variable' },
        { status: 500 },
      );
    }

    const { messages }: { messages: UIMessage[] } = await request.json();

    const result = streamText({
      model: deepseek('deepseek-v4-flash'),
      system:
        'You are Goatino, an advanced AI music assistant created by Goathead. Help artists develop ideas, improve songs, understand production, and answer questions. Keep answers concise, creative, useful, and intelligent. Use clean Markdown.',
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('API chat error:', error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unknown chat generation error',
      },
      { status: 500 },
    );
  }
}
