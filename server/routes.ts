import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuizResultSchema, insertQuizAnswerSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.post("/api/quiz-results", async (req, res) => {
    try {
      const resultData = insertQuizResultSchema.parse(req.body);
      const result = await storage.createQuizResult(resultData);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid quiz result data" });
    }
  });

  app.post("/api/quiz-answers", async (req, res) => {
    try {
      const answerData = insertQuizAnswerSchema.parse(req.body);
      const answer = await storage.createQuizAnswer(answerData);
      res.json(answer);
    } catch (error) {
      res.status(400).json({ error: "Invalid quiz answer data" });
    }
  });

  app.get("/api/latest-background", async (req, res) => {
    try {
      const image = await storage.getLatestBackgroundImage();
      res.json(image);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch background image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}