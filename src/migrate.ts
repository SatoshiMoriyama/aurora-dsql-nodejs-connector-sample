import "dotenv/config";
import { createDbConnection } from "./db";
import { sql } from "drizzle-orm";

async function migrate() {
  const clusterEndpoint = process.env.CLUSTER_ENDPOINT;
  const user = process.env.CLUSTER_USER || "admin";

  if (!clusterEndpoint) {
    throw new Error("CLUSTER_ENDPOINT environment variable is required");
  }

  const { db, client } = await createDbConnection(clusterEndpoint, user);

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS owner (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(30) NOT NULL,
        city VARCHAR(80) NOT NULL,
        telephone VARCHAR(20)
      )
    `);
    console.log("Table created successfully");
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  } finally {
    await client.end();
  }
}

migrate();
