import { db } from "./db";
import { quizResults, quizAnswers, generatedImages } from "@shared/schema";
import type { InsertQuizResult, InsertQuizAnswer, QuizResult, QuizAnswer, InsertGeneratedImage, GeneratedImage } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  createQuizAnswer(answer: InsertQuizAnswer): Promise<QuizAnswer>;
  getQuizResult(id: number): Promise<QuizResult | undefined>;
  getQuizAnswers(resultId: number): Promise<QuizAnswer[]>;
  saveGeneratedImage(image: InsertGeneratedImage): Promise<GeneratedImage>;
  getLatestBackgroundImage(): Promise<GeneratedImage | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const [insertedResult] = await db.insert(quizResults)
      .values(result)
      .returning();
    return insertedResult;
  }

  async createQuizAnswer(answer: InsertQuizAnswer): Promise<QuizAnswer> {
    const [insertedAnswer] = await db.insert(quizAnswers)
      .values(answer)
      .returning();
    return insertedAnswer;
  }

  async getQuizResult(id: number): Promise<QuizResult | undefined> {
    const [result] = await db.select()
      .from(quizResults)
      .where(eq(quizResults.id, id));
    return result;
  }

  async getQuizAnswers(resultId: number): Promise<QuizAnswer[]> {
    return db.select()
      .from(quizAnswers)
      .where(eq(quizAnswers.resultId, resultId));
  }

  async saveGeneratedImage(image: InsertGeneratedImage): Promise<GeneratedImage> {
    const [savedImage] = await db.insert(generatedImages)
      .values(image)
      .returning();
    return savedImage;
  }

  async getLatestBackgroundImage(): Promise<GeneratedImage | undefined> {
    const [image] = await db.select()
      .from(generatedImages)
      .where(eq(generatedImages.type, 'background'))
      .orderBy(generatedImages.createdAt)
      .limit(1);
    return image;
  }
}

export const storage = new DatabaseStorage();