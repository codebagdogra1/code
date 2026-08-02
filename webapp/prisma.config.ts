import path from "node:path";
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 moved the connection URL out of schema.prisma. The CLI (db pull, migrate,
// studio) reads it from here; the app connects via the driver adapter in src/lib/db.ts.
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: env("DATABASE_URL"),
  },
});
