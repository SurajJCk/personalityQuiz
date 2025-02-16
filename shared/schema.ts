import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  personality: text("personality").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const quizAnswers = pgTable("quiz_answers", {
  id: serial("id").primaryKey(),
  resultId: integer("result_id").notNull(),
  questionNumber: integer("question_number").notNull(),
  selectedOption: text("selected_option").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// New table for storing generated images
export const generatedImages = pgTable("generated_images", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  prompt: text("prompt").notNull(),
  type: text("type").notNull(), // 'background' or 'personality'
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertQuizResultSchema = createInsertSchema(quizResults).omit({ 
  id: true,
  createdAt: true 
});

export const insertQuizAnswerSchema = createInsertSchema(quizAnswers).omit({ 
  id: true,
  createdAt: true 
});

export const insertGeneratedImageSchema = createInsertSchema(generatedImages).omit({
  id: true,
  createdAt: true
});

export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type InsertQuizAnswer = z.infer<typeof insertQuizAnswerSchema>;
export type InsertGeneratedImage = z.infer<typeof insertGeneratedImageSchema>;
export type QuizResult = typeof quizResults.$inferSelect;
export type QuizAnswer = typeof quizAnswers.$inferSelect;
export type GeneratedImage = typeof generatedImages.$inferSelect;