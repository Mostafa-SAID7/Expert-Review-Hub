import pg from "pg";

async function createDb() {
  const client = new pg.Client({
    connectionString: "postgresql://admin:postgres@localhost:5432/postgres",
  });
  try {
    await client.connect();
    await client.query("CREATE DATABASE expert_review_hub;");
    console.log("✓ Database expert_review_hub created successfully.");
  } catch (err: any) {
    if (err.code === "42P04") {
      console.log("ℹ Database expert_review_hub already exists.");
    } else {
      console.error("Error creating database:", err);
    }
  } finally {
    await client.end();
  }
}

createDb();
