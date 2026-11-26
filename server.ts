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
            description: "Unique, non-repetitive definitions and interesting facts for each of the 4 words in this category",
            minItems: 4,
            maxItems: 4,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                definition: { type: Type.STRING, description: "A short, specific 1-sentence Arabic definition tailored to this exact word" },
                fact: { type: Type.STRING, description: "A unique, specific linguistic, historical, or scientific fact in Arabic for this exact word (never repeat templates across words)" }
              },
              required: ["word", "definition", "fact"]
            }
          }
        },
        required: ["id", "title", "icon", "color", "description", "words", "wordFacts"]
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
        Generate game data for an Arabic word sorting game called 'Rawabet' (رَوابِط).
        Stage: ${validDifficulty}.
        Level Index: ${validLevelNumber} of 10.
        Rules:
        - Create ${categoryCount} unique categories of 4 words each (Total ${totalWords} words).
        - Logic should follow Modern Standard Arabic (MSA).
        - Each category MUST have a unique, highly relevant emoji and a MAXIMALLY DISTINCT HEX color from different hue families (e.g. Crimson Red #E11D48, Emerald Green #10B981, Sky Blue #0284C7, Golden Amber #F59E0B — NEVER assign two shades of blue/purple or two shades of orange/yellow in the same level).
        - Vary themes: Beginner (concrete nouns like animals, food), Intermediate (abstract nouns/verbs), Expert (literary roots, rare words, historical figures).
        - Ensure strict orthographic accuracy for 'Hamza' and 'Ta Marbuta'.
        - Words should be challenging but related by a clear, logical thread.
        - For wordFacts, provide a genuinely distinct, specific Arabic definition and interesting fact for EACH word individually — never reuse or repeat the same template sentence across words.
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
          // Guaranteed maximally distinct high-contrast color palette (Crimson, Leaf Green, Royal Blue, Gold, Purple, Orange)
          const DISTINCT_PALETTE = ["#E11D48", "#16A34A", "#2563EB", "#EAB308", "#9333EA", "#EA580C"];
          const parseRgb = (hex: string): [number, number, number] | null => {
            const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
            return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
          };
          const colorDistance = (c1: string, c2: string): number => {
            const rgb1 = parseRgb(c1);
            const rgb2 = parseRgb(c2);
            if (!rgb1 || !rgb2) return 0;
            return Math.hypot(rgb1[0] - rgb2[0], rgb1[1] - rgb2[1], rgb1[2] - rgb2[2]);
          };

          const usedColors: string[] = [];
          const categories: Category[] = rawData.categories.map((c: any, index: number) => {
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

            let chosenColor = String(c.color || "").trim();
            const isValidHex = !!parseRgb(chosenColor);
            const isTooClose = !isValidHex || usedColors.some((existing) => colorDistance(existing, chosenColor) < 120);
            if (isTooClose) {
              chosenColor = DISTINCT_PALETTE.find((candidate) =>
                usedColors.every((existing) => colorDistance(existing, candidate) >= 120)
              ) || DISTINCT_PALETTE[index % DISTINCT_PALETTE.length];
            }
            usedColors.push(chosenColor);

            return {
              id: String(c.id || Math.random().toString(36).substr(2, 5)),
              title: String(c.title || "مجموعة"),
              icon: String(c.icon || "✨"),
              color: chosenColor,
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
