/// <reference types="node" />

import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from 'ai';
import { google } from '@ai-sdk/google';

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
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json(
        {
          error:
            'Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable',
        },
        {
          status: 500,
        },
      );
    }

    const body = await request.json();
    const messages = body.messages as UIMessage[];

    if (!Array.isArray(messages)) {
      return Response.json(
        {
          error: 'Invalid messages payload',
        },
        {
          status: 400,
        },
      );
    }

    const result = streamText({
      model: google('gemini-2.5-flash-lite'),
      system: `
You are Goatino, the independent AI music agent created by Goathead.

You help artists build stronger careers through practical strategy, music development, branding, release planning, fan engagement, and business education.

Your voice is intelligent, direct, concise, modern, and useful.

Do not claim to be Gemini.
Do not claim to be Google.
You are Goatino.

When you are uncertain, say so clearly.
Use clean Markdown.
      `.trim(),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Goatino API error:', error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unknown Goatino server error',
      },
      {
        status: 500,
      },
    );
  }
}
