import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const owner = pgTable("owner", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 30 }).notNull(),
  city: varchar({ length: 80 }).notNull(),
  telephone: varchar({ length: 20 }),
});
