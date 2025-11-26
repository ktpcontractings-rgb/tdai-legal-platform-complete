import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users } from "../drizzle/schema";

/**
 * Make a user an admin by email or openId
 * Usage: pnpm tsx server/make-admin.ts [email_or_openid]
 */

async function makeAdmin() {
  const identifier = process.argv[2];

  if (!identifier) {
    console.error("❌ Please provide an email or openId");
    console.log("\nUsage: pnpm tsx server/make-admin.ts [email_or_openid]");
    console.log("Example: pnpm tsx server/make-admin.ts positiononesigma358@gmail.com");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set");
    process.exit(1);
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  try {
    console.log(`🔍 Looking for user: ${identifier}\n`);

    // Try to find user by email first
    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, identifier))
      .limit(1);

    // If not found by email, try openId
    if (user.length === 0) {
      user = await db
        .select()
        .from(users)
        .where(eq(users.openId, identifier))
        .limit(1);
    }

    if (user.length === 0) {
      console.error(`❌ User not found: ${identifier}`);
      console.log("\nMake sure the user has logged in at least once.");
      process.exit(1);
    }

    const foundUser = user[0];

    if (foundUser.role === "admin") {
      console.log(`✅ ${foundUser.email || foundUser.openId} is already an admin!`);
      process.exit(0);
    }

    // Update user to admin
    await db
      .update(users)
      .set({ role: "admin" })
      .where(eq(users.id, foundUser.id));

    console.log(`🎉 SUCCESS! ${foundUser.email || foundUser.openId} is now an admin!\n`);
    console.log(`Admin Access Granted:`);
    console.log(`  - Admin Traffic Tickets: /admin/traffic-tickets`);
    console.log(`  - ZADE Training Center: /zade-training`);
    console.log(`  - CEO Dashboard: /ceo-dashboard`);
    console.log(`  - SIGMA Hub: /sigma-hub\n`);
    console.log(`🔥 POSITION ONE!!! 🔥\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

makeAdmin();
