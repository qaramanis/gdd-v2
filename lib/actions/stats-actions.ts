"use server";

import { db, schema } from "@/database/drizzle";
import { count } from "drizzle-orm";

export async function fetchLandingPageStats() {
  try {
    // Count users
    const [userResult] = await db.select({ count: count() }).from(schema.user);
    const userCount = userResult?.count || 0;

    // Count games
    const [gamesResult] = await db.select({ count: count() }).from(schema.games);
    const gamesCount = gamesResult?.count || 0;

    return {
      peopleJoined: userCount,
      gamesSubmitted: gamesCount,
    };
  } catch (error) {
    console.error("Error fetching landing page stats:", error);
    return {
      peopleJoined: 0,
      gamesSubmitted: 0,
    };
  }
}
