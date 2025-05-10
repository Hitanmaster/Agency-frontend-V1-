import { pgTable, text, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const agencies = pgTable("agencies", {
  id: serial("id").primaryKey(),
  agency_name: text("agency_name").notNull(),
  project_title: text("project_title"),
  project_description: text("project_description"),
  project_url: text("project_url"),
  project_images: jsonb("project_images").$type<string[]>(),
  tags: jsonb("tags").$type<string[]>(),
  scraped_date: timestamp("scraped_date").notNull(),
  last_updated: timestamp("last_updated").notNull(),
});

export const insertAgencySchema = createInsertSchema(agencies).omit({
  id: true,
});

export type InsertAgency = z.infer<typeof insertAgencySchema>;
export type Agency = typeof agencies.$inferSelect;

// MongoDB schema for reference - this handles both schemas in your database
export const mongoAgencySchema = z.object({
  _id: z.string(),
  // Fields from first schema format
  agency_name: z.string().optional(),
  project_title: z.string().optional(),
  project_description: z.string().optional(),
  project_url: z.string().optional(),
  project_images: z.array(z.string()).optional(),
  // Fields from second schema format
  title: z.string().optional(),
  description: z.string().optional(),
  project_page_url: z.string().optional(),
  media_url: z.string().optional(),
  media_type: z.string().optional(),
  categories: z.array(z.unknown()).optional(),
  // Common fields
  tags: z.array(z.string()).optional(),
  scraped_date: z.string().optional(),
  last_updated: z.string().optional()
});

export type MongoAgency = z.infer<typeof mongoAgencySchema>;
