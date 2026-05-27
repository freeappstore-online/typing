export type TestMode = "15" | "30" | "60" | "120" | "untilComplete";

export type TextSource = "passage" | "words";

export interface Passage {
  readonly id: string;
  readonly text: string;
  readonly source: string;
  readonly category: "quote" | "literature" | "programming" | "common" | "pangram";
}

export interface TestResult {
  readonly id: string;
  readonly timestamp: number;
  readonly mode: TestMode;
  readonly textSource: TextSource;
  readonly wpm: number;
  readonly rawWpm: number;
  readonly accuracy: number;
  readonly totalChars: number;
  readonly correctChars: number;
  readonly incorrectChars: number;
  readonly timeTaken: number; // seconds
  readonly grade: string;
  readonly wpmOverTime: readonly number[];
  readonly errorKeys: Record<string, number>;
}

export interface Settings {
  fontSize: "small" | "medium" | "large";
  smoothCaret: boolean;
  soundEnabled: boolean;
  showLiveWpm: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  fontSize: "medium",
  smoothCaret: true,
  soundEnabled: false,
  showLiveWpm: true,
};
