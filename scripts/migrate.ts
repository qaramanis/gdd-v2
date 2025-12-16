import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../database/drizzle";

async function main() {
  console.log("Running database migrations...");

  await migrate(db, {
    migrationsFolder: "./database/drizzle/migrations",
  });

  console.log("Migrations completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
