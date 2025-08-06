// app/api/auth/test/route.ts
// Create this file to test if your auth setup is working
import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET() {
  const checks = {
    env: {
      DATABASE_URL: !!process.env.DATABASE_URL,
      BETTER_AUTH_SECRET: !!process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "not set",
    },
    database: {
      connected: false,
      tables: {
        users: false,
        sessions: false,
        accounts: false,
        passwords: false,
        verification_tokens: false,
      },
    },
    error: null as string | null,
  };

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        ...checks,
        error: "DATABASE_URL is not configured",
      },
      { status: 500 },
    );
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("supabase.co")
      ? { rejectUnauthorized: false }
      : undefined,
  });

  try {
    // Test database connection
    await pool.query("SELECT NOW()");
    checks.database.connected = true;

    // Check for Better Auth tables
    const tables = [
      "users",
      "sessions",
      "accounts",
      "passwords",
      "verification_tokens",
    ];
    for (const table of tables) {
      const result = await pool.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = $1
        )`,
        [table],
      );
      checks.database.tables[table as keyof typeof checks.database.tables] =
        result.rows[0].exists;
    }

    return NextResponse.json(checks, { status: 200 });
  } catch (error: any) {
    checks.error = error.message;
    return NextResponse.json(checks, { status: 500 });
  } finally {
    await pool.end();
  }
}
