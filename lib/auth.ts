// lib/auth.ts
import { betterAuth } from "better-auth";
import { Pool } from "pg";

console.log("🔧 Initializing Better Auth...");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("BETTER_AUTH_SECRET exists:", !!process.env.BETTER_AUTH_SECRET);

// Create a PostgreSQL connection pool to Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the database connection immediately
pool
  .connect()
  .then((client) => {
    console.log("✅ Database connection successful");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-key",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  // Add advanced logging
  advanced: {
    generateId: () => crypto.randomUUID(), // Ensure ID generation works
  },
});

console.log("✅ Better Auth initialized");
