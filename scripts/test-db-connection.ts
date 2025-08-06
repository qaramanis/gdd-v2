// scripts/test-db-connection.ts
// Test your database connection and Better Auth setup
// Usage: npx tsx scripts/test-db-connection.ts

import { Pool } from "pg";
import * as dotenv from "dotenv";
import { createHash } from "crypto";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function testConnection() {
  console.log("🔍 Testing database connection and Better Auth setup...\n");

  // Check environment variables
  console.log("📋 Environment Variables Check:");
  console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
  );
  console.log(
    "BETTER_AUTH_SECRET:",
    process.env.BETTER_AUTH_SECRET ? "✅ Set" : "❌ Missing",
  );
  console.log(
    "BETTER_AUTH_URL:",
    process.env.BETTER_AUTH_URL ? "✅ Set" : "❌ Missing",
  );
  console.log(
    "NEXT_PUBLIC_SUPABASE_URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
  );
  console.log(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY:",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
  );
  console.log(
    "GOOGLE_CLIENT_ID:",
    process.env.GOOGLE_CLIENT_ID
      ? "✅ Set (optional)"
      : "⚠️ Not set (optional)",
  );
  console.log(
    "GITHUB_CLIENT_ID:",
    process.env.GITHUB_CLIENT_ID
      ? "✅ Set (optional)"
      : "⚠️ Not set (optional)",
  );
  console.log("\n");

  if (!process.env.DATABASE_URL) {
    console.error(
      "❌ DATABASE_URL is not set. Please check your .env.local file",
    );
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
  });

  try {
    // Test basic connection
    console.log("🔌 Testing database connection...");
    const client = await pool.connect();
    console.log("✅ Database connected successfully!\n");
    client.release();

    // Check if Better Auth tables exist
    console.log("📊 Checking Better Auth tables:");
    const tables = [
      "users",
      "sessions",
      "accounts",
      "passwords",
      "verification_tokens",
    ];

    for (const table of tables) {
      const result = await pool.query(
        `
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = $1
        )
      `,
        [table],
      );

      const exists = result.rows[0].exists;
      console.log(`${table}:`, exists ? "✅ Exists" : "❌ Missing");

      if (exists) {
        const countResult = await pool.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`  └─ Records: ${countResult.rows[0].count}`);
      }
    }
    console.log("\n");

    // Test if we can query the existing games table
    console.log("🎮 Checking your existing tables:");
    try {
      const gamesResult = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = 'games'
        )
      `);

      if (gamesResult.rows[0].exists) {
        const gamesCount = await pool.query("SELECT COUNT(*) FROM games");
        console.log(`games: ✅ Exists (${gamesCount.rows[0].count} records)`);
      }
    } catch (error) {
      console.log("games: ⚠️ Could not check");
    }

    try {
      const notesResult = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = 'notes'
        )
      `);

      if (notesResult.rows[0].exists) {
        const notesCount = await pool.query("SELECT COUNT(*) FROM notes");
        console.log(`notes: ✅ Exists (${notesCount.rows[0].count} records)`);
      }
    } catch (error) {
      console.log("notes: ⚠️ Could not check");
    }
    console.log("\n");

    // Check if Better Auth secret is properly configured
    if (process.env.BETTER_AUTH_SECRET) {
      const secretLength = process.env.BETTER_AUTH_SECRET.length;
      if (secretLength < 32) {
        console.log(
          "⚠️ Warning: BETTER_AUTH_SECRET should be at least 32 characters long",
        );
        console.log(`  Current length: ${secretLength} characters`);
      } else {
        console.log("✅ BETTER_AUTH_SECRET is properly configured");
      }
    }

    console.log("\n🎉 Database connection test completed successfully!");
    console.log("\n📝 Next steps:");
    console.log(
      "1. If any Better Auth tables are missing, run: npm run db:setup",
    );
    console.log("2. Make sure all required environment variables are set");
    console.log("3. Test authentication by signing up a new user");
  } catch (error) {
    console.error("❌ Database connection test failed:", error);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check if your DATABASE_URL is correct");
    console.log("2. For Supabase: Make sure your project is running");
    console.log("3. Check if your database credentials are correct");
    console.log("4. If using SSL, ensure it's properly configured");
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the test
testConnection();
