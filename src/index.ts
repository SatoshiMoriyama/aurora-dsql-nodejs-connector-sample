import { AuroraDSQLClient } from "@aws/aurora-dsql-node-postgres-connector";
import { drizzle } from "drizzle-orm/node-postgres";
import { owner } from "./schema";
import { eq } from "drizzle-orm";
import "dotenv/config";

async function createDbConnection(clusterEndpoint: string, user: string) {
  const client = new AuroraDSQLClient({
    host: clusterEndpoint,
    user: user,
  });

  await client.connect();

  return {
    db: drizzle(client, { schema: { owner } }),
    client,
  };
}

async function main() {
  const clusterEndpoint = process.env.CLUSTER_ENDPOINT;
  const user = process.env.CLUSTER_USER || "admin";

  if (!clusterEndpoint) {
    throw new Error("CLUSTER_ENDPOINT environment variable is required");
  }

  const { db, client } = await createDbConnection(clusterEndpoint, user);

  try {
    console.log("Inserting data...");

    const [inserted] = await db
      .insert(owner)
      .values({
        name: "mori",
        city: "sapporo",
        telephone: "070-9999-9999",
      })
      .returning();

    console.log("Inserted:", inserted);

    const result = await db.select().from(owner).where(eq(owner.name, "mori"));
    console.log("Selected:", result);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    await client.end();
  }
}

main();
