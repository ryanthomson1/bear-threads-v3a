import { imageInstructions } from './system/imageInstructions';

export async function generateImageForPost(postText: string): Promise<string | undefined> {
  console.log('generateImageForPost function called');

  const basePrompt = imageInstructions; // Using imageInstructions as the base prompt
  const combinedPrompt = `${basePrompt}\n\nBased on the above instructions and the following text post, generate an image: "${postText}"`;

  // Truncate prompt if over 4000 characters (DALL-E 3 prompt limit)
  const dallePrompt = combinedPrompt.length > 4000 ? combinedPrompt.substring(0, 4000) : combinedPrompt;

  const apiKey = import.meta.env.VITE_DALLE_API_KEY;
  const API_URL = "https://api.openai.com/v1/images/generations";
  
  console.log("Using DALL-E API Key:", apiKey);
  console.log("DALL-E Prompt:", dallePrompt);

  try {

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: dallePrompt,
        n: 1, // Number of images to generate
        size: '1024x1024', // Image size
      }),
    });

    if (!response.ok) {
      throw new Error(`DALL-E API request failed with status ${response.status}`);
    }

    console.log("DALL-E API Response:", response);

    const data = await response.json();
    const imageUrl = data?.data?.[0]?.url;

    return imageUrl;

  } catch (error) {
    console.error('Error generating image with DALL-E:', error);
    return undefined; // Return undefined if image generation fails
  }
}