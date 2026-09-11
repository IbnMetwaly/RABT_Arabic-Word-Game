import { Difficulty, GameLevel } from "./types";
import { getFallbackLevel } from "./fallbackLevels";

export async function generateLevel(difficulty: Difficulty, levelNumber: number): Promise<GameLevel> {
  try {
    const response = await fetch("/api/level", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ difficulty, levelNumber })
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    if (data && Array.isArray(data.categories) && Array.isArray(data.words)) {
      return data as GameLevel;
    }
    throw new Error("Malformed level payload from server");
  } catch (err) {
    console.warn("Level request failed, falling back to pre-crafted level:", err);
    return getFallbackLevel(difficulty, levelNumber);
  }
}
