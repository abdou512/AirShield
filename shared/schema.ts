import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const dataRecords = pgTable("data_records", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  date: timestamp("date").defaultNow().notNull(),
  aqi: integer("aqi").notNull(),
  pollen_level: integer("pollen_level").notNull(),
  temperature: integer("temperature").notNull(),
  humidity: integer("humidity").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  firstname: true,
  password: true,
  lastname: true,
});

export const insertDataRecordSchema = createInsertSchema(dataRecords).pick({
  user_id: true,
  aqi: true,
  pollen_level: true,
  temperature: true,
  humidity: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDataRecord = z.infer<typeof insertDataRecordSchema>;
export type DataRecord = typeof dataRecords.$inferSelect;
