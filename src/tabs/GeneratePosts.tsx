// src/tabs/GeneratePosts.tsx

"use client";

import { useState } from "react";
import { generatePosts } from "@/lib/generatePosts";
import { generateImages } from "@/lib/generateImages";
import { generateImagePrompt } from "@/lib/generateImagePrompt";
import { savePostToFirestore } from "@/lib/savePostToFirestore";
import { toggleImageGeneration } from "@/lib/generateImagePrompt";


import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";

import { Spinner } from "@/components/ui/spinner";
import { SparklesIcon } from '@heroicons/react/24/outline'; 
type PostWithImage = {
  text: string;
  imageUrl: string;
};

export default function GeneratePostsTab() {
  const [prompt, setPrompt] = useState<string>("");
  const [posts, setPosts] = useState<PostWithImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generateImagesEnabled, setGenerateImagesEnabled] = useState(true);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      toggleImageGeneration(generateImagesEnabled);

      const generatedPosts = await generatePosts(prompt);
      const result: PostWithImage[] = [];

      for (const post of generatedPosts) {
        const imagePrompt = generateImagePrompt(post);
        const imageUrls = imagePrompt ? await generateImages(imagePrompt) : [];
        const imageUrl = Array.isArray(imageUrls) ? imageUrls[0] : imageUrls;
        //await savePostToFirestore(post, imageUrl, "gemini");
        result.push({ text: post, imageUrl });
      }

      setPosts(result);
    } catch (error) { console.error("❌ Failed to generate posts:", error);
      setError("Failed to generate posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            <Textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="What's the seed idea?" className="col-span-12" />
            <div className="flex items-center gap-4">
              <Switch
                id="image-switch"
                checked={generateImagesEnabled}
                onCheckedChange={(val) => setGenerateImagesEnabled(val)}
              />
              <label htmlFor="image-switch">Generate images with posts</label>
            </div>
            <Button onClick={handleGenerate} disabled={isLoading} className="flex items-center gap-2">
              {isLoading ? <Spinner /> : <SparklesIcon className="h-5 w-5" />}
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
            <CardContent className="space-y-4">
              <ScrollArea className="h-[400px] pr-4">
                {posts.map((post, index) => (
              <Card key={index} className="mb-4">

                <CardContent className="space-y-4 pt-6">
                  <p>{post.text}</p>
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={`Generated visual for post ${index + 1}`}
                      className="rounded w-full max-w-xl"
                    />
                  )}
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
