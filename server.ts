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
          },
          wordFacts: {
            type: Type.ARRAY,
            description: "Concise definitions or interesting facts for the 4 words in this category",
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                definition: { type: Type.STRING, description: "A short 1-sentence definition of the word in Arabic" },
                fact: { type: Type.STRING, description: "An interesting linguistic, historical, or scientific fact in Arabic" }
              },
              required: ["word", "definition", "fact"]
            }
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
  const validLevelNumber = typeof levelNumber === "number" && levelNumber >= 1 && levelNumber <= 10 ? levelNumber : 1;

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const categoryCount = 4;
      const totalWords = categoryCount * 4;

      const prompt = `
        Generate game data for an Arabic word sorting game called 'Rabt'.
        Stage: ${validDifficulty}.
        Level Index: ${validLevelNumber} of 10.
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
          const categories: Category[] = rawData.categories.map((c: any) => {
            const wordFacts: Record<string, { definition: string; fact: string }> = {};
            if (Array.isArray(c.wordFacts)) {
              c.wordFacts.forEach((wf: any) => {
                if (wf?.word && wf?.definition) {
                  wordFacts[String(wf.word).trim()] = {
                    definition: String(wf.definition),
                    fact: String(wf.fact || "")
                  };
                }
              });
            }

            return {
              id: String(c.id || Math.random().toString(36).substr(2, 5)),
              title: String(c.title || "مجموعة"),
              icon: String(c.icon || "✨"),
              color: String(c.color || "#F59E0B"),
              description: String(c.description || ""),
              wordFacts: Object.keys(wordFacts).length > 0 ? wordFacts : undefined
            };
          });

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

app.use(express.static(path.join(process.cwd(), "public")));

app.get("/manifest.json", (_req, res) => {
  res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
  res.sendFile(path.join(process.cwd(), "public", "manifest.json"));
});

app.get(["/sw.js", "/service-worker.js"], (_req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(path.join(process.cwd(), "public", "sw.js"));
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
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        }
      }
    }));
    app.get("*all", (_req, res) => {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
