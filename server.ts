import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, GameLevel, Category, Word } from "./types";
import { getFallbackLevel } from "./fallbackLevels";

const app = express();
const PORT = 3000;

app.use(express.json());

const levelSchema = {
  type: Type.OBJECT,
  properties: {
    categories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          icon: {
            type: Type.STRING,
            description: "A unique and highly relevant emoji representing the category (e.g. 🍎 for fruits)"
          },
          color: {
            type: Type.STRING,
            description: "A distinct, vibrant CSS hex color code (e.g. #FF5733) that visually differentiates the category"
          },
          description: { type: Type.STRING },
          words: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 4,
            maxItems: 4
          }
        },
        required: ["id", "title", "icon", "color", "description", "words"]
      },
      minItems: 4,
      maxItems: 6
    }
  },
  required: ["categories"]
};

// API endpoint to generate or fetch a level
app.post("/api/level", async (req, res) => {
  const { difficulty = Difficulty.BEGINNER, levelNumber = 1 } = req.body;
  const validDifficulty = (Object.values(Difficulty).includes(difficulty) ? difficulty : Difficulty.BEGINNER) as Difficulty;
  const validLevelNumber = typeof levelNumber === "number" && levelNumber >= 1 && levelNumber <= 3 ? levelNumber : 1;

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });

      const categoryCount = validLevelNumber + 3;
      const totalWords = categoryCount * 4;

      const prompt = `
        Generate game data for an Arabic word sorting game called 'Rabt'.
        Stage: ${validDifficulty}.
        Level Index: ${validLevelNumber} of 3.
        Rules:
        - Create ${categoryCount} unique categories of 4 words each (Total ${totalWords} words).
        - Logic should follow Modern Standard Arabic (MSA).
        - Each category MUST have a unique, highly relevant emoji and a distinct, vibrant HEX color that fits the theme.
        - Vary themes: Beginner (concrete nouns like animals, food), Intermediate (abstract nouns/verbs), Expert (literary roots, rare words, historical figures).
        - Ensure strict orthographic accuracy for 'Hamza' and 'Ta Marbuta'.
        - Words should be challenging but related by a clear, logical thread.
        - Output must be in JSON format.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: levelSchema
        }
      });

      const text = response.text;
      if (text) {
        const rawData = JSON.parse(text);
        if (rawData?.categories && Array.isArray(rawData.categories) && rawData.categories.length > 0) {
          const categories: Category[] = rawData.categories.map((c: any) => ({
            id: String(c.id || Math.random().toString(36).substr(2, 5)),
            title: String(c.title || "مجموعة"),
            icon: String(c.icon || "✨"),
            color: String(c.color || "#F59E0B"),
            description: String(c.description || "")
          }));

          const words: Word[] = rawData.categories.flatMap((c: any) =>
            (c.words || []).map((w: string, idx: number) => ({
              id: `${c.id || "cat"}-${idx}`,
              text: String(w).trim(),
              categoryId: String(c.id),
              isSolved: false
            }))
          );

          const shuffledWords = [...words].sort(() => Math.random() - 0.5);

          const level: GameLevel = {
            difficulty: validDifficulty,
            levelNumber: validLevelNumber,
            categories,
            words: shuffledWords
          };

          return res.json(level);
        }
      }
    } catch (error: any) {
      console.warn("Gemini API call failed, providing high quality fallback level:", error?.message || error);
    }
  }

  // Graceful fallback to verified authentic Arabic puzzle
  const fallback = getFallbackLevel(validDifficulty, validLevelNumber);
  return res.json(fallback);
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
