// src/lib/generateImagePrompt.ts

import { imageInstructions } from '@/lib/system/imageInstructions';
import { systemInstructions } from '@/lib/system/systemInstructions';

let generateImagesEnabled = true; // Default: image generation is ON

export function toggleImageGeneration(enabled: boolean) {
  generateImagesEnabled = enabled;
}

export function isImageGenerationEnabled(): boolean {
  return generateImagesEnabled;
}

export function generateImagePrompt(post: string): string | null {
  if (!generateImagesEnabled) return null;

  return `${imageInstructions}

Post Context: ${post}

System Style:
${systemInstructions}`;
}
