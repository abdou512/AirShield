import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  email: text("email").notNull().unique(),
  illnes: text("illness"),
  allergy: text("allergy"),
  age : integer("age").notNull(),
  sexe : text("sexe").notNull(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

