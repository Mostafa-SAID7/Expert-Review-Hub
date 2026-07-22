import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: [
    "./src/db/schema/users.ts",
    "./src/db/schema/foods.ts",
    "./src/db/schema/tracker.ts",
    "./src/db/schema/plans.ts",
    "./src/db/schema/recipes.ts",
    "./src/db/schema/profiles.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://postgres:Memo3560@localhost:5432/expert_review_hub",
  },
});
