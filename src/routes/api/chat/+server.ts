import { OpenAI } from '@ai-sdk/openai';
import { StreamingTextResponse, experimental_streamText } from 'ai';
import type { RequestHandler } from './$types';

import { OPENAI_API_KEY } from '$env/static/private'

// Create an OpenAI Provider instance
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY ?? '',
});

export const POST = (async ({ request }) => {
  // Extract the `prompt` from the body of the request
  const { messages } = await request.json();

  // Ask OpenAI for a streaming chat completion given the prompt
  const result = await experimental_streamText({
    model: openai.chat('gpt-3.5-turbo-0125'),
    messages,
  });

  // Respond with the stream
  return new StreamingTextResponse(result.toAIStream());
}) satisfies RequestHandler;
