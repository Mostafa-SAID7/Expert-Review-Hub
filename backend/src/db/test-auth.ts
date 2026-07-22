import pg from "pg";

async function testUser(user: string, pass: string) {
  const client = new pg.Client({
    connectionString: `postgresql://${user}:${pass}@localhost:5432/postgres`,
  });
  try {
    await client.connect();
    console.log(`SUCCESS: Connected as user "${user}" with password "${pass}"`);
    
    // Try creating database
    try {
      await client.query("CREATE DATABASE expert_review_hub;");
      console.log("✓ Database expert_review_hub created!");
    } catch (dbErr: any) {
      if (dbErr.code === "42P04") {
        console.log("ℹ Database expert_review_hub already exists.");
      } else {
        console.log("Database creation message:", dbErr.message);
      }
    }
    await client.end();
    return true;
  } catch (err: any) {
    console.log(`FAILED: ${user}:${pass} -> ${err.message}`);
    return false;
  }
}

async function run() {
  const combos = [
    { u: "admin", p: "Memo3560" },
    { u: "postgres", p: "Memo3560" },
    { u: "postgres", p: "postgres" },
    { u: "postgres", p: "admin" },
    { u: "postgres", p: "root" },
    { u: "postgres", p: "123456" },
  ];
  for (const c of combos) {
    const ok = await testUser(c.u, c.p);
    if (ok) break;
  }
}

run();
