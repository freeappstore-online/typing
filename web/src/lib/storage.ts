import type { TestResult, Settings } from "../data/types";
import { DEFAULT_SETTINGS } from "../data/types";

const RESULTS_KEY = "typing-test-results";
const SETTINGS_KEY = "typing-test-settings";

export function getResults(): TestResult[] {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TestResult[];
  } catch {
    return [];
  }
}

export function saveResult(result: TestResult): void {
  const results = getResults();
  results.push(result);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
}

export function getSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } as Settings;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getLeaderboard(): TestResult[] {
  const results = getResults();
  return results
    .sort((a, b) => b.wpm - a.wpm)
    .slice(0, 10);
}

export function getErrorKeyStats(): Record<string, number> {
  const results = getResults();
  const merged: Record<string, number> = {};
  for (const r of results) {
    for (const [key, count] of Object.entries(r.errorKeys)) {
      merged[key] = (merged[key] ?? 0) + count;
    }
  }
  return merged;
}

export function getAverageWpm(): number {
  const results = getResults();
  if (results.length === 0) return 0;
  const total = results.reduce((sum, r) => sum + r.wpm, 0);
  return Math.round(total / results.length);
}

export function getBestWpm(): number {
  const results = getResults();
  if (results.length === 0) return 0;
  return Math.max(...results.map((r) => r.wpm));
}
