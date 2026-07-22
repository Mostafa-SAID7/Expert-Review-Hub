import { db, recipesTable } from "../index.js";

export async function seedRecipes() {
  console.log("Seeding recipes...");
  const recipes = [
    {
      title: "Honey & Olive Oil Dressing",
      titleAr: "صلصة العسل وزيت الزيتون الممتازة",
      category: "Salad Dressings",
      goal: "detox",
      ingredients: "2 tbsp Organic Honey, 4 tbsp Extra Virgin Olive Oil, 1 tbsp Lemon Juice",
      instructions: "Mix all ingredients in a small bowl until emulsified.",
      prepTimeMinutes: 5,
    },
  ];

  await db.insert(recipesTable).values(recipes).onConflictDoNothing();
  console.log("✓ Recipes seeded successfully.");
}
