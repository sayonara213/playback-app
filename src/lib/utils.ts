import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hexToRgb = (
  hex: string,
): { r: number; g: number; b: number } | null => {
  // Remove leading '#' if present
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    // Expand shorthand form (e.g., 'f00' -> 'ff0000')
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (hex.length !== 6) {
    return null;
  }

  // Parse the hex color string
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
};

export interface LrcLine {
  time: number; // in seconds
  text: string;
}

export function parseLRC(lrcText: string): LrcLine[] {
  const lines = lrcText.split("\n");
  const result: LrcLine[] = [];

  const timeRegex = /\[(\d+):(\d+)(?:\.(\d+))?\]/;

  for (const line of lines) {
    const match = timeRegex.exec(line);
    if (match) {
      const min = parseInt(match[1]);
      const sec = parseInt(match[2]);
      const ms = match[3] ? parseInt(match[3].padEnd(2, "0")) : 0;
      const time = min * 60 + sec + ms / 100;
      const text = line.replace(timeRegex, "").trim();
      result.push({ time, text });
    }
  }

  return result.sort((a, b) => a.time - b.time);
}
