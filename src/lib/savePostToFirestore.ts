// src/lib/savePostToFirestore.ts

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface PostWithImage {
  text: string;
  imageUrl?: string;
}

export async function savePostToFirestore(post: string, imageUrl: string, p0: string, post: PostWithImage) {
  const postsRef = collection(db, "posts");
  await addDoc(postsRef, {
    ...post,
    createdAt: serverTimestamp(),
    model: "gemini", // or set dynamically if needed
  });
}
