import { createAuthClient } from "better-auth/react";

console.log(
  "🔧 Creating auth client with baseURL:",
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
);

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;

console.log("✅ Auth client created");
