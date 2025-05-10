// src/tabs/GeneratePosts.tsx

"use client";

import { useState } from "react";
import { generatePosts } from "../lib/generatePosts";
import { generateImagePrompt } from "../lib/generateImagePrompt";
import { savePostToFirestore } from "../lib/savePostToFirestore";

import { generateImageForPost } from "../lib/generateImageForPost";
import { ImageService } from "../lib/generateImages";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button"; // Keep Button here
import { Textarea } from "../components/ui/textarea";
import { ScrollArea } from "../components/ui/scroll-area";import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Switch } from "../components/ui/switch";

import { Spinner } from "../components/ui/spinner";
import { SparklesIcon } from '@heroicons/react/24/outline';
type PostWithImage = {
  text: string;
  imageUrl: string | undefined;
  isImageGenerating?: boolean; // Add loading state for image regeneration// Add loading state for image regeneration
 imagePrompt?: string | null; // Added | null to the type definition
};

export default function GeneratePostsTab() {
  const [prompt, setPrompt] = useState<string>("");
  const [posts, setPosts] = useState<PostWithImage[]>([]); // Updated state type
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(
    null
  ); // State to track selected post
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [visibleImagePrompts, setVisibleImagePrompts] = useState<Record<number, boolean>>({}); // State to track visible image prompts
  const [generateImagesEnabled, setGenerateImagesEnabled] = useState(true);
  // Toggle visibility of image prompt for a specific post
  const toggleImagePromptVisibility = (index: number) => {
    setVisibleImagePrompts((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  const handleGeneratePosts = async () => { // Define handleGeneratePosts here
    setPosts([]); // Clear previous posts
    setVisibleImagePrompts({}); // Clear previous visibility states
    setIsLoading(true);
    setError(null); // Clear previous errors
    const selectedImageService = (localStorage.getItem('imageService') || 'leonardo-ai') as ImageService;

    try {
      const generatedPostTexts = await generatePosts(prompt); // Assuming generatePosts returns string[]

      // Process each post text and generate image asynchronously
      const postPromises = generatedPostTexts.map(async (postText, index) => {
 console.log('generateImagesEnabled:', generateImagesEnabled);
 let imageUrl = undefined;
        let imagePromptText = undefined;

 if (generateImagesEnabled) {
          imagePromptText = await generateImagePrompt(postText);
 if (imagePromptText) {
            imageUrl = await generateImageForPost(
 imagePromptText,
 selectedImageService
 ); // Pass the generated prompt and service
          }
 }

        // Update the state for this specific post
        setPosts(prevPosts => [...prevPosts, { text: postText, imageUrl, imagePrompt: imagePromptText, isImageGenerating: false }]);
      });

      await Promise.all(postPromises); // Wait for all post processing to complete
    } catch (error) {
      console.error("❌ Failed to generate posts:", error);
      setError("Failed to generate posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }; // Closing brace for handleGeneratePosts

  const handleSelectPost = (index: number) => {
    setSelectedPostIndex(index === selectedPostIndex ? null : index);
  };

  const handleRegenerateImage = async (
    index: number,
    post: PostWithImage // This 'post' parameter is the specific post being regenerated
  ) => {
    const selectedImageService = (localStorage.getItem('imageService') || 'leonardo-ai') as ImageService;

    // Create a new array by spreading the *original* posts array
    const newPosts = [...posts]; // Use 'posts' here, not 'post'

    // Update the isImageGenerating property for the specific post in the new array
    newPosts[index].isImageGenerating = true;

    // Update the state with the new array (showing the loading spinner)
    setPosts(newPosts);

    try {
      let newImageUrl = undefined;
      let newImagePrompt = post.imagePrompt; // Use existing prompt if available

      if (!newImagePrompt) {
        newImagePrompt = await generateImagePrompt(post.text);
      }

      if (newImagePrompt) {
        newImageUrl = await generateImageForPost(
          newImagePrompt,
          selectedImageService
        );
      }

      // Update the imageUrl and imagePrompt for the specific post in the new array
      newPosts[index].imageUrl = newImageUrl;
      newPosts[index].imagePrompt = newImagePrompt;

      // Update the state with the new array (with the updated image and prompt)
      setPosts(newPosts);

    } catch (error) {
      console.error("❌ Failed to regenerate image:", error);
      // Optional: Add error handling to the state if you want to display an error message
      // setPosts(prevPosts => {
      //   const updatedPosts = [...prevPosts];
      //   updatedPosts[index].isImageGenerating = false; // Stop loading
      //   // You might add an error property to PostWithImage and set it here
      //   return updatedPosts;
      // });
    } finally {
      // Ensure loading state is false even if there was an error
      setPosts(prevPosts => {
        const updatedPosts = [...prevPosts];
        updatedPosts[index].isImageGenerating = false;
        return updatedPosts;
      });
    }
  };

  const handlePostToThreads = async (post: PostWithImage) => {
    console.log('Attempting to post to Threads:', post);
    // TODO: Implement actual Threads API posting logic here
  };

  // ... rest of your component's code and JSX




  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 md:col-span-6">
          <CardHeader>
            <CardTitle>Generate Threads Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label htmlFor="prompt" className="sr-only">
              Seed idea
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What's the seed idea?"
              className="col-span-12" />
            <div className="flex items-center gap-4">
              <Switch
                id="image-switch"
                checked={generateImagesEnabled}
                onCheckedChange={(val: boolean) => setGenerateImagesEnabled(val)}
              />
              <label htmlFor="image-switch">Generate images with posts</label>
            </div>
            <Button onClick={handleGeneratePosts} disabled={isLoading} className="flex items-center gap-2">
              {isLoading && <Spinner />}
              {!isLoading && <SparklesIcon className="h-5 w-5" />}
              {isLoading ? "Generating..." : "Generate Posts"}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
          </CardContent>
        </Card>
        {posts.length > 0 && (
          <Card className="col-span-12 md:col-span-6">
            <CardHeader>
              <CardTitle>Generated Posts</CardTitle>
            </CardHeader>
            {isLoading && (
              <CardContent className="flex items-center justify-center h-[400px]">
                <Spinner />
              </CardContent>
            )}
            <CardContent className="space-y-4">
              <ScrollArea className="h-[400px] pr-4">
                {posts.map((post, index) => (
                  <Card
 key={index}
                    className={`mb-4 cursor-pointer ${
                      index === selectedPostIndex
                        ? "border-blue-500 border-2"
                        : ""
                    }`}
                    onClick={() => handleSelectPost(index)}
                  >

                <CardContent className="space-y-4 pt-6">
                  <Textarea
                      value={post.text}
                      onChange={(e) => {
                        const newPosts = [...posts];
                        newPosts[index].text = e.target.value;
                        setPosts(newPosts);
                      }}
                      className="w-full"
                      rows={5} // Adjust rows as needed
                    />
                    {post.imagePrompt && (
                      <div className="flex items-center text-sm text-gray-500 mt-2">

                        <span>Image Prompt:</span>
                        <button onClick={() => toggleImagePromptVisibility(index)} className="ml-2 p-1 rounded hover:bg-gray-100">
                          {visibleImagePrompts[index] ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                        {visibleImagePrompts[index] && (
                          <span className="ml-2">{post.imagePrompt}</span>
                        )}
                      </div>
                    )}
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={`Generated visual for post ${index + 1}`}
                      className="rounded w-full max-w-xl"
                    />
                  )}
                </CardContent>
                <CardContent>
                  <div className="flex space-x-2">
                    {/* Add the "Regenerate Image" button here */}
                    <Button onClick={() => handleRegenerateImage(index, post)} disabled={post.isImageGenerating}>
                      {/* The disabled check should likely be post.isImageGenerating */}
                      {post.isImageGenerating && <Spinner className="mr-2" />}
                      Regenerate Image
                    </Button>
                    {/* Keep the "Post to Threads" button here */}

                    <Button className="flex-grow" onClick={() => handlePostToThreads(post)}>
                      Post to Threads
                    </Button>
                  </div>
                </CardContent>

              </Card>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

