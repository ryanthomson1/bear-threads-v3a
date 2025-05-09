
import { systemInstructions } from './system/systemInstructions';

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const dummyPosts = (prompt: string) => [
  `🧠 Fallback activated. Prompt: "${prompt}"`,
  "⚠️ Gemini response was empty — fallback triggered.",
  "💥 This post is sponsored by chaos.",
  "📉 All systems are technically fine. Ish.",
  "🤷‍♂️ When in doubt, blame the prompt.",
];

export async function generatePosts(prompt: string): Promise<string[]> {
  const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
  const payload = {
    system_instruction: {
      parts: [{ text: systemInstructions }]
    },
    contents: [
      {
        parts: [
          {
            text: "Generate exactly 3 posts. " + prompt,
          }
        ],
      },
    ],
  };

  try {
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    const raw =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    if (!raw) {
      console.warn("⚠️ Gemini response was empty — using fallback posts.");
      return dummyPosts(prompt);
    }

    const posts = raw
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);


    return posts;
  } catch (error) {
    console.error("❌ Gemini request failed:", error);
    return dummyPosts(prompt);
  }
}
