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
      console.warn(`Server returned status ${response.status}, using curated puzzle.`);
      return getFallbackLevel(difficulty, levelNumber);
    }

    const data = await response.json();
    if (data && Array.isArray(data.categories) && Array.isArray(data.words) && data.categories.length > 0) {
      return data as GameLevel;
    }
    console.warn("Malformed level payload from server, using curated puzzle.");
    return getFallbackLevel(difficulty, levelNumber);
  } catch (err) {
    console.warn("Level request failed, falling back to pre-crafted level:", err);
    return getFallbackLevel(difficulty, levelNumber);
  }
}
