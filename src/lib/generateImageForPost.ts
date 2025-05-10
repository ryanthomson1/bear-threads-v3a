import { generateImages, type ImageService } from './generateImages';

export async function generateImageForPost(imagePrompt: string, service: ImageService): Promise<string | undefined> {
 console.log('generateImageForPost function called with prompt:', imagePrompt, 'and service:', service);

  // Use the generateImages function which handles the service selection
  const imageUrls = await generateImages(imagePrompt, service);
  if (imageUrls && imageUrls.length > 0) {
    return imageUrls[0];
  }
  return undefined; // Return undefined if image generation fails
}