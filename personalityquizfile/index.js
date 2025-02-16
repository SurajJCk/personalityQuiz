var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import * as dotenv from "dotenv";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/db.ts
import { fileURLToPath } from "url";
import { dirname } from "path";
import { config } from "dotenv";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  generatedImages: () => generatedImages,
  insertGeneratedImageSchema: () => insertGeneratedImageSchema,
  insertQuizAnswerSchema: () => insertQuizAnswerSchema,
  insertQuizResultSchema: () => insertQuizResultSchema,
  insertUserSchema: () => insertUserSchema,
  quizAnswers: () => quizAnswers,
  quizResults: () => quizResults,
  users: () => users
});
import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  personality: text("personality").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var quizAnswers = pgTable("quiz_answers", {
  id: serial("id").primaryKey(),
  resultId: integer("result_id").notNull(),
  questionNumber: integer("question_number").notNull(),
  selectedOption: text("selected_option").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var generatedImages = pgTable("generated_images", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  prompt: text("prompt").notNull(),
  type: text("type").notNull(),
  // 'background' or 'personality'
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertQuizResultSchema = createInsertSchema(quizResults).omit({
  id: true,
  createdAt: true
});
var insertQuizAnswerSchema = createInsertSchema(quizAnswers).omit({
  id: true,
  createdAt: true
});
var insertGeneratedImageSchema = createInsertSchema(generatedImages).omit({
  id: true,
  createdAt: true
});

// server/db.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
config({ path: dirname(__dirname) + "/.env" });
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  async createQuizResult(result) {
    const [insertedResult] = await db.insert(quizResults).values(result).returning();
    return insertedResult;
  }
  async createQuizAnswer(answer) {
    const [insertedAnswer] = await db.insert(quizAnswers).values(answer).returning();
    return insertedAnswer;
  }
  async getQuizResult(id) {
    const [result] = await db.select().from(quizResults).where(eq(quizResults.id, id));
    return result;
  }
  async getQuizAnswers(resultId) {
    return db.select().from(quizAnswers).where(eq(quizAnswers.resultId, resultId));
  }
  async saveGeneratedImage(image) {
    const [savedImage] = await db.insert(generatedImages).values(image).returning();
    return savedImage;
  }
  async getLatestBackgroundImage() {
    const [image] = await db.select().from(generatedImages).where(eq(generatedImages.type, "background")).orderBy(generatedImages.createdAt).limit(1);
    return image;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
function registerRoutes(app2) {
  app2.post("/api/quiz-results", async (req, res) => {
    try {
      const resultData = insertQuizResultSchema.parse(req.body);
      const result = await storage.createQuizResult(resultData);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid quiz result data" });
    }
  });
  app2.post("/api/quiz-answers", async (req, res) => {
    try {
      const answerData = insertQuizAnswerSchema.parse(req.body);
      const answer = await storage.createQuizAnswer(answerData);
      res.json(answer);
    } catch (error) {
      res.status(400).json({ error: "Invalid quiz answer data" });
    }
  });
  app2.post("/api/generate-background", async (req, res) => {
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Create a stunning digital art of Lord Shiva in deep meditation, seated in padmasana against a cosmic background. 
        Include ethereal elements like the crescent moon in his hair, the sacred Ganga flowing, and the third eye. 
        Style: Mystical digital art with traditional Indian elements, deep blues and purples, serene and divine atmosphere.`,
        n: 1,
        size: "1792x1024",
        quality: "hd",
        style: "vivid"
      });
      const imageUrl = response.data[0].url;
      if (!imageUrl) {
        throw new Error("No image URL in response");
      }
      const savedImage = await storage.saveGeneratedImage({
        imageUrl,
        prompt: "Shiva meditation background",
        type: "background"
      });
      res.json(savedImage);
    } catch (error) {
      console.error("Failed to generate image:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });
  app2.get("/api/latest-background", async (req, res) => {
    try {
      const image = await storage.getLatestBackgroundImage();
      res.json(image);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch background image" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname3 } from "path";
import { fileURLToPath as fileURLToPath3 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname as dirname2 } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var vite_config_default = defineConfig({
  plugins: [react(), runtimeErrorOverlay(), themePlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname2, "client", "src"),
      "@shared": path.resolve(__dirname2, "shared")
    }
  },
  root: path.resolve(__dirname2, "client"),
  build: {
    outDir: path.resolve(__dirname2, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename3 = fileURLToPath3(import.meta.url);
var __dirname3 = dirname3(__filename3);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname3,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname3, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
dotenv.config();
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const PORT = 5e3;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();
