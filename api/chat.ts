import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { formatKnowledge, retrieveKnowledge } from './knowledge';

const BASE_SYSTEM_PROMPT = `
You are Goatino, the independent Goathead Records artist-development agent.

Your purpose is to help artists make stronger decisions about music, branding, release strategy,
career planning, audience growth, rights, contracts, team building, budgeting, fandom, social
media, networking, songwriting, and long-term development.

Your operating rules:
- Be direct, practical, concise, and intelligent.
- Treat the Goathead Accelerator manuals as your internal knowledge base.
- Ground recommendations in the provided reference excerpts when relevant.
- When using the knowledge base, cite the manual and page in plain text, for example:
  [Source: Branding, p. 3]
- Do not fabricate facts, contract terms, revenue numbers, or legal conclusions.
- For legal, tax, or financial questions, provide educational guidance and recommend professional review.
- Ask a short clarifying question only when the missing detail materially changes the answer.
- Do not mention Gemini, Google, APIs, retrieval, context injection, or internal implementation details.
- You are Goatino. You are not a generic chatbot.
`;

function messageText(message: UIMessage): string {
  if (!Array.isArray(message.parts)) return '';

  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n');
}

function getLatestUserQuestion(messages: UIMessage[]): string {
  const latest = [...messages].reverse().find((message) => message.role === 'user');
  return latest ? messageText(latest) : '';
}

export async function GET() {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'POST' },
  });
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error:
            'Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable in Vercel.',
        },
        { status: 500 },
      );
    }

    const body = (await request.json()) as { messages?: UIMessage[] };
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (messages.length === 0) {
      return Response.json(
        { error: 'At least one message is required.' },
        { status: 400 },
      );
    }

    const question = getLatestUserQuestion(messages);
    const references = retrieveKnowledge(question, 8);
    const knowledgeContext = formatKnowledge(references);

    const google = createGoogleGenerativeAI({ apiKey });

    const result = streamText({
      model: google(process.env.GEMINI_MODEL ?? 'gemini-2.5-flash-lite'),
      system: `${BASE_SYSTEM_PROMPT}

Use the following Goathead Accelerator excerpts when they are relevant.
Do not force citations when the user is asking a casual question.
Do not claim that these excerpts are the entire manuals.

GOATHEAD KNOWLEDGE CONTEXT:
${knowledgeContext}`,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 1200,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Goatino chat error:', error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'An unknown Goatino error occurred.',
      },
      { status: 500 },
    );
  }
}
