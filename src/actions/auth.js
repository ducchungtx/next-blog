"use server";

import bcrypt from "bcrypt";
import { LoginFormSchema, RegisterFormSchema } from "@/lib/rules";
import { getCollection } from "@/lib/db";
import { createSession } from "@/lib/sessions";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function register(state, formData) {
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  const validatedFields = RegisterFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // extract email and password from the validatedFields.data
  const { email, password } = validatedFields.data;

  // check if the email already exists in the database
  const userCollection = await getCollection("users");
  if (!userCollection) {
    return {
      errors: {
        email: "Could not connect to the database",
      }
    }
  }

  const existingUser = await userCollection.findOne({ email });
  if (existingUser) {
    return {
      errors: {
        email: "Email already exists",
      }
    }
  }

  // Hash the password
  const bcryptPassword = await bcrypt.hash(password, 10);

  const results = await userCollection.insertOne({
    email,
    password: bcryptPassword,
  });

  // Create a session for the user
  await createSession(results.insertedId);

  // redirect the user to the dashboard
  redirect('/dashboard');
}

export async function login(state, formData) {
  // Validate the email and password
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any of the fields are invalid, return the error
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      email: formData.get("email"),
    }
  }

  // extract email and password from the validatedFields.data
  const { email, password } = validatedFields.data;

  // check if the email exists in the database
  const userCollection = await getCollection("users");
  if (!userCollection) {
    return {
      errors: {
        email: "Could not connect to the database",
      }
    }
  }

  const existingUser = await userCollection.findOne({ email });
  if (!existingUser) {
    return {
      errors: {
        email: "Invalid credentials",
      }
    }
  }
  // hash the password
  const matchedPassword = await bcrypt.compare(password, existingUser.password);
  if (!matchedPassword) {
    return {
      errors: {
        email: "Invalid credentials",
      }
    }
  }

  // Create a session for the user
  await createSession(existingUser._id.toString());

  // redirect the user to the dashboard
  redirect('/dashboard');

}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");

  // remove the session cookie
  redirect('/');
}
