import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 connects through a driver adapter. PrismaPg wraps `pg` with a built-in
// pool, which is the serverless-friendly path (works the same on Netlify and Vercel).
// A single client is reused across hot reloads / warm invocations to avoid exhausting
// Postgres connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    // Interactive transactions default to a 2s maxWait to acquire a connection.
    // On a cold serverless invocation the first TLS handshake to the remote
    // Postgres takes >2s, so transaction routes (cancel/restore/delete a
    // registration) would fail to start and 500. Give connection acquisition
    // and the transaction body generous headroom.
    transactionOptions: { maxWait: 10_000, timeout: 20_000 },
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
