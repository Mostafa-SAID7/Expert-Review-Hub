import { db } from "./index.js";
import { sql } from "drizzle-orm";

async function migrate() {
  console.log("Applying database migrations...");

  await db.execute(sql`
    DROP TABLE IF EXISTS recipes CASCADE;
    DROP TABLE IF EXISTS foods CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS tracker_entries CASCADE;
    DROP TABLE IF EXISTS weight_logs CASCADE;
    DROP TABLE IF EXISTS plans CASCADE;
    DROP TABLE IF EXISTS user_plans CASCADE;
    DROP TABLE IF EXISTS profiles CASCADE;

    DO $$ BEGIN
      CREATE TYPE role AS ENUM ('user', 'admin');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE food_status AS ENUM ('tayyib', 'khabeeth');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role role NOT NULL DEFAULT 'user',
      avatar_url TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE foods (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      status food_status NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT,
      description TEXT,
      description_ar TEXT,
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE recipes (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      title_ar TEXT NOT NULL,
      category TEXT NOT NULL,
      goal TEXT NOT NULL DEFAULT 'general',
      image_url TEXT,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL,
      prep_time_minutes INT,
      servings INT,
      tags TEXT[],
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  console.log("✓ Database migrations applied clean!");
  process.exit(0);
}

migrate().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
