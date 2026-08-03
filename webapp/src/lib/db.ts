import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Prisma 7 connects through a driver adapter. We use Neon's serverless driver
// instead of raw `pg`/TCP: opening a classic Postgres connection to the remote DB
// costs ~8 network round-trips (TLS + SCRAM + channel-binding) and dominated every
// cold admin request. The Neon driver removes that per-request cost:
//   - `poolQueryViaFetch`: plain (non-transaction) queries — the vast majority of
//     the admin's reads — go over a single HTTPS request, no socket handshake at all.
//   - Interactive transactions ($transaction, used by the payments/registration
//     routes) still run over one WebSocket, which needs a WS constructor in Node.
// A single client is reused across hot reloads / warm invocations.
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    // Interactive transactions default to a 2s maxWait to acquire a connection.
    // The Neon WebSocket handshake on a cold invocation can still exceed that, so
    // keep generous headroom for connection acquisition and the transaction body.
    transactionOptions: { maxWait: 10_000, timeout: 20_000 },
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
