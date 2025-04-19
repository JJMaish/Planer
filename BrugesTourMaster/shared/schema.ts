import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export JSON type for use in other files
export type JSONValue = string | number | boolean | null | { [key: string]: JSONValue } | JSONValue[];

// Users table (keeping the original one)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Location types for Bruges attractions
export const locationTypes = [
  "attraction",
  "restaurant",
  "shopping",
  "nature",
  "photospot",
  "event"
] as const;

export type LocationType = typeof locationTypes[number];

// Budget levels
export const budgetLevels = ["budget", "moderate", "luxury"] as const;
export type BudgetLevel = typeof budgetLevels[number];

// Bruges attractions, restaurants, nature spots, etc.
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  address: text("address").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  budget: text("budget").notNull(),
  imageUrl: text("image_url").notNull(),
  tags: text("tags").array().notNull(),
  details: jsonb("details"),
  openingHours: text("opening_hours"),
  price: text("price"),
  websiteUrl: text("website_url"),
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

// Events in Bruges
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  address: text("address").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  imageUrl: text("image_url").notNull(),
  price: text("price"),
  websiteUrl: text("website_url"),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Trips/Itineraries
export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  days: integer("days").notNull(),
  interests: text("interests").array().notNull(),
  budget: text("budget").notNull(),
  tours: text("tours").array().notNull(),
  additionalInfo: text("additional_info"),
  generatedItinerary: jsonb("generated_itinerary").notNull(),
});

export const insertItinerarySchema = createInsertSchema(itineraries).omit({
  id: true,
});

export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type Itinerary = typeof itineraries.$inferSelect;

// Trip planner form schema
export const tripPlannerSchema = z.object({
  duration: z.string().min(1, { message: "Please select duration" }),
  interests: z.array(z.string()).min(1, { message: "Please select at least one interest" }),
  budget: z.enum(["budget", "moderate", "luxury"], { 
    required_error: "Please select your budget" 
  }),
  tours: z.array(z.string()),
  additionalInfo: z.string().optional(),
});

export type TripPlannerData = z.infer<typeof tripPlannerSchema>;
