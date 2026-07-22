import { db, usersTable } from "../index.js";
import bcrypt from "bcryptjs";

export async function seedUsers() {
  console.log("Seeding users...");
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const users = [
    {
      email: "admin@example.com",
      passwordHash: hashedPassword,
      name: "Admin User",
      role: "admin" as const,
    },
    {
      email: "expert@example.com",
      passwordHash: hashedPassword,
      name: "Dr. Ahmed Expert",
      role: "user" as const,
    },
    {
      email: "user@example.com",
      passwordHash: hashedPassword,
      name: "Sample User",
      role: "user" as const,
    },
  ];

  await db.insert(usersTable).values(users).onConflictDoNothing();
  console.log("✓ Users seeded successfully.");
}
