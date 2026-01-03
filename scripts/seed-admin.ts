import "dotenv/config";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@example.com";
  const password = "password123";

  console.log("Seeding admin user...");

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      password: hashedPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  console.log(`\n✅ Admin user ready!`);
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);
  console.log(`\nGo to /admin/login to sign in.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // lib/prisma manages connection, but we can try disconnect if exposed
    // or just let process exit
  });
