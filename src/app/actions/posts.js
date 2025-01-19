"use server"

import { redirect } from "next/navigation";
import getAuthUser from "@/lib/getAuthUser";
import { BlogPostSchema } from "@/lib/rules";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/db";

export async function createPost(state, formData) {
  // Check user authentication
  const user = await getAuthUser();
  if (!user) {
    return redirect("/");
  }

  // Validate the form data
  const title = formData.get("title");
  const content = formData.get("content");

  const validatedFields = BlogPostSchema.safeParse({
    title,
    content,
  });

  // If the form data is invalid, return the errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      title,
      content,
    }
  }

  try {
    // Create a new post
    const postCollection = await getCollection("posts");

    const post = {
      title: validatedFields.data.title,
      content: validatedFields.data.content,
      userId: ObjectId.createFromHexString(user.userId),
    };

    await postCollection.insertOne(post);
  } catch (error) {
    return {
      errors: {
        title: error.message,
      }
    }
  }

  return redirect("/dashboard");
}