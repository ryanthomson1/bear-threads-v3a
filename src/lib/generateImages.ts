// src/lib/generateImages.ts

import { imageInstructions } from '@/lib/system/imageInstructions';

const API_URL = 'https://api.openai.com/v1/images/generations';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function generateImages(prompt: string): Promise<string[]> {
  if (!OPENAI_API_KEY) {
    console.error('❌ Missing OpenAI API key');
    return [];
  }

  const fullPrompt = `${imageInstructions}\n\nTopic: ${prompt}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: fullPrompt,
        n: 1,
        size: '512x512',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ DALL·E API error: ${response.status} ${response.statusText}`, errorText);
      return [];
    }

    const data = await response.json();

    console.log('Raw DALL·E response data:', data); // Log the raw data

    if (!data?.data || !Array.isArray(data.data)) {
      console.error('❌ Invalid DALL·E response format: Expected data.data to be an array.', data);
      return [];
    }

    return data.data.map((item: any) => item.url);
  } catch (error) {
    console.error('❌ DALL·E image generation failed:', error);
    return []; // Add return statement here
  }
}
