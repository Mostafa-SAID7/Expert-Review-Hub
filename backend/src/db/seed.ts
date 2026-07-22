import { seedFoods } from "./seeds/foods.seed.js";
import { seedUsers } from "./seeds/users.seed.js";
import { seedRecipes } from "./seeds/recipes.seed.js";

async function main() {
  console.log("==========================================");
  console.log("🌱 Starting Database Seeding Process...");
  console.log("==========================================");

  try {
    await seedUsers();
    await seedFoods();
    await seedRecipes();

    console.log("==========================================");
    console.log("✅ Database Seeding Completed Successfully!");
    console.log("==========================================");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database Seeding Failed:", error);
    process.exit(1);
  }
}

main();
