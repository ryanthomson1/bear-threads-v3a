// src/lib/generateImagePrompt.ts

import { imageInstructions } from './system/imageInstructions';

let generateImagesEnabled = true; // Default: image generation is ON

export function toggleImageGeneration(enabled: boolean) {
  generateImagesEnabled = enabled;
}

export function isImageGenerationEnabled(): boolean {
  return generateImagesEnabled;
}

export async function generateImagePrompt(post: string): Promise<string | null> {
  if (!generateImagesEnabled) return null;

  const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY; // Assuming you have this in your .env
  const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const payload = {
    system_instruction: {
      parts: [{ text: imageInstructions }] // Use imageInstructions as system instructions for Gemini
    },
    contents: [
      {
        parts: [
          {
            text: `Based on the following post, generate a single, image prompt that captures the tone and setting of the post visually:\n\nPost: "${post}"` // Use post text as user input
          }
        ],
      },
    ],
    // Add any other necessary parameters for your Gemini API call (e.g., safety settings, etc.)
 };

  try {
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Gemini API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const generatedPrompt = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (generatedPrompt) {
      // Basic cleaning of the generated prompt (remove potential markdown or quotes)
      const cleanedPrompt = generatedPrompt.replace(/^["']|["']$/g, '').trim();
      console.log("Generated DALL-E Prompt (from Gemini):", cleanedPrompt);
      return cleanedPrompt;
    } else {
      console.warn("Gemini did not return a prompt.");
      return null;
    }

  } catch (error) {
    console.error('Error generating image prompt with Gemini:', error);
    return null;
  }
}
