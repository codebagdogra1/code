// Create (or reset) an admin user. Run with:
//   npx tsx scripts/create-admin.ts <username> <password>
// Requires DATABASE_URL in .env.
import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db";

async function main() {
  const [username, password] = process.argv.slice(2);
  if (!username || !password) {
    console.error("Usage: npx tsx scripts/create-admin.ts <username> <password>");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { username },
    update: { passwordHash, isActive: true, failedAttempts: 0, lockedUntil: null },
    create: { username, passwordHash, userType: "admin", isActive: true },
  });

  console.log(`✓ Admin user "${user.username}" (id ${user.id}) is ready.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
