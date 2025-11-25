import { createDbConnection } from "./db";
import { owner } from "./schema";
import { eq } from "drizzle-orm";
import "dotenv/config";

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

    await db.delete(owner).where(eq(owner.name, "John Doe"));
    console.log("Deleted successfully");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    await client.end();
  }
}

main();
