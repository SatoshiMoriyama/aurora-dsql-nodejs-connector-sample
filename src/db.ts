import { AuroraDSQLClient } from "@aws/aurora-dsql-node-postgres-connector";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export async function createDbConnection(
  clusterEndpoint: string,
  user: string
) {
  const client = new AuroraDSQLClient({
    host: clusterEndpoint,
    user: user,
  });

  await client.connect();

  return {
    db: drizzle(client, { schema }),
    client,
  };
}
