/// <reference types="node" />
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const deepseek = createOpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export const config = {
  runtime: 'edge',
};

export default async function req(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: deepseek('deepseek-chat'),
    system: "You are Goatino, a highly advanced, ultra-modern AI music assistant. You help users generate beats, remix tracks, and answer questions. Keep your answers concise, engaging, and highly intelligent. Do not format your text in a way that breaks standard Markdown (but do use lists and bolding when appropriate).",
    messages,
  });

  return result.toTextStreamResponse();
}
