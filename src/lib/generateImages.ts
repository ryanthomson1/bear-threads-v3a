// src/lib/generateImages.ts

import { imageInstructions } from '../lib/system/imageInstructions';

export type ImageService = 'dall-e-3' | 'leonardo-ai';
 
const API_URL = 'https://api.openai.com/v1/images/generations';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const LEONARDO_API_URL = import.meta.env.VITE_LEONARDO_API_URL;
const LEONARDO_API_KEY = import.meta.env.VITE_LEONARDO_API_KEY;

async function getLeonardoImages(generationId: string): Promise<any> {
  const url = `${LEONARDO_API_URL}/${generationId}`; // Assuming this is the correct endpoint
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${LEONARDO_API_KEY}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Leonardo.ai GET image error: ${response.status} ${response.statusText}`, errorText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('❌ Failed to fetch Leonardo.ai images:', error);
    return null;
  }
}
export async function generateImages(prompt: string, service: ImageService): Promise<string[]> {
  console.log('generateImages called with service:', service);
  if (service === 'leonardo-ai') {
    console.log('Checking Leonardo.ai API key and URL...');
    console.log('LEONARDO_API_KEY:', LEONARDO_API_KEY ? 'Loaded' : 'Missing');
    if (!LEONARDO_API_KEY || !LEONARDO_API_URL) {
      console.error('❌ Missing Leonardo.ai API key or URL');
      return [];
    }

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${LEONARDO_API_KEY}`,
      },
      body: JSON.stringify({
        alchemy: false,
        height: 768,
        modelId: 'b2614463-296c-462a-9586-aafdb8f00e36', // This might need to be configurable later
        num_images: 1,
        presetStyle: 'DYNAMIC',
        prompt: `${prompt}`,
        width: 768,
        guidance_scale: 7,
        num_inference_steps: 20,
        scheduler: 'EULER_DISCRETE', // This might need to be checked or adjusted based on Leonardo docs
        contrast: 3.5,
        userElements: [{userLoraId: 65483, weight: 0.9}, {userLoraId: 65490, weight: 0.7}]
      }),
    };

    console.log('Making fetch request to Leonardo.ai API...');
    console.log('Using Leonardo.ai API URL:', LEONARDO_API_URL);
    console.log('Using Leonardo.ai API Key (first 5 chars):', LEONARDO_API_KEY?.substring(0, 5) + '...');
    console.log('Leonardo.ai API options:', options);

    try {
      const response = await fetch(LEONARDO_API_URL, options);

      console.log(`Leonardo.ai API response status: ${response.status} ${response.statusText}`);
      console.log('Raw Leonardo.ai API response:', response);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Leonardo.ai API error details:', errorText);
        return [];
      }

      const data = await response.json();
      console.log('Raw Leonardo.ai response data:', data);

      const generationId = data?.sdGenerationJob?.generationId;
      console.log('Extracted Leonardo.ai generation ID:', generationId);

      if (!generationId) {
        console.error('❌ Failed to get generation ID from Leonardo.ai response.');
        return [];
      }

      // Poll for images
      const maxRetries = 15;
      const retryDelay = 5000; // 5 seconds

      for (let i = 0; i < maxRetries; i++) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        const imageData = await getLeonardoImages(generationId);
        if (imageData?.generations_by_pk?.status === 'COMPLETE') {
          const imageUrls = imageData?.generations_by_pk?.generated_images?.map((item: any) => item.url) || [];
          console.log('Extracted Leonardo.ai image URLs:', imageUrls);
          return imageUrls;
        }
        console.log(`Polling Leonardo.ai for images, attempt ${i + 1}/${maxRetries}. Status: ${imageData?.generations_by_pk?.status}`);
      }
      console.error(`❌ Leonardo.ai image generation did not complete after ${maxRetries} retries.`);
      return []; // Return empty array if images are not ready after retries
    } catch (error) {
      console.error('❌ Leonardo.ai image generation failed:', error);
      return [];
    }
  }
 else if (service === 'dall-e-3') {
    const fullPrompt = `${imageInstructions}\n\nTopic: ${prompt}`;

    if (!OPENAI_API_KEY) {
      console.error('❌ Missing OpenAI API key for DALL-E 3');
      return [];
    }

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
      return [];
    }
  }
 return []; // Add a default return in case service is neither
}
