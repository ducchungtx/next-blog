import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;

export async function encrypt(payload) {
  return jwt.sign(payload, secretKey, { algorithm: "HS256", expiresIn: "7d" });
}

export async function decrypt(session) {
  try {
    const payload = jwt.verify(session, secretKey, { algorithms: ["HS256"] });
    return payload;
  } catch (error) {
    console.log("Failed to verify session", error);
    throw new Error("Error decrypting session");
  }
}

export async function createSession(userId) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}