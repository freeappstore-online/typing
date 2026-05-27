import { useState, useMemo, useCallback } from "react";
import { getErrorKeyStats } from "../lib/storage";
import { generateWordList } from "../data/passages";
import type { Settings } from "../data/types";
import { useTypingTest } from "../hooks/useTypingTest";
import TypingArea from "./TypingArea";
import LiveStats from "./LiveStats";
import { playKeyClick } from "../lib/sound";

interface PracticeModeProps {
  settings: Settings;
  onBack: () => void;
}

export default function PracticeMode({ settings, onBack }: PracticeModeProps) {
  const errorStats = useMemo(() => getErrorKeyStats(), []);
  const topErrorKeys = useMemo(() => {
    const sorted = Object.entries(errorStats).sort(([, a], [, b]) => b - a);
    return sorted.slice(0, 5).map(([key]) => key);
  }, [errorStats]);

  const [text, setText] = useState(() =>
    generateWordList(50, topErrorKeys.length > 0 ? topErrorKeys : undefined),
  );

  const test = useTypingTest(text, "untilComplete", "words");

  const handleKey = useCallback(
    (key: string) => {
      if (settings.soundEnabled) playKeyClick();
      test.handleKey(key);
    },
    [settings.soundEnabled, test],
  );

  const handleNewPractice = useCallback(() => {
    const newText = generateWordList(50, topErrorKeys.length > 0 ? topErrorKeys : undefined);
    setText(newText);
  }, [topErrorKeys]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer"
          style={{ background: "var(--panel)", border: "1px solid var(--line)", color: "var(--ink)" }}
        >
          Back
        </button>
        <h2 className="text-xl font-bold font-display" style={{ color: "var(--ink)" }}>
          Practice Mode
        </h2>
      </div>

      {topErrorKeys.length > 0 && (
        <div
          className="px-4 py-2 rounded-lg text-sm"
          style={{ background: "var(--panel)", border: "1px solid var(--line)", color: "var(--muted)" }}
        >
          Focusing on your problem keys:{" "}
          {topErrorKeys.map((k) => (
            <span
              key={k}
              className="font-mono-typing mx-0.5 px-1.5 py-0.5 rounded text-xs font-bold"
              style={{ background: "var(--error)", color: "#fff" }}
            >
              {k === " " ? "space" : k}
            </span>
          ))}
        </div>
      )}

      {topErrorKeys.length === 0 && (
        <div
          className="px-4 py-2 rounded-lg text-sm"
          style={{ background: "var(--panel)", border: "1px solid var(--line)", color: "var(--muted)" }}
        >
          No error data yet. Practice with random common words to build your baseline.
        </div>
      )}

      {test.state !== "finished" && (
        <LiveStats
          wpm={test.currentWpm}
          accuracy={test.currentAccuracy}
          timeRemaining={null}
          timeElapsed={test.timeElapsed}
          errors={test.errorsCount}
          showWpm={settings.showLiveWpm}
        />
      )}

      <TypingArea
        chars={test.chars}
        cursorIndex={test.cursorIndex}
        isRunning={test.state === "running"}
        isFinished={test.state === "finished"}
        settings={settings}
        onKey={handleKey}
      />

      {test.state === "finished" && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleNewPractice}
            className="px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer"
            style={{ background: "var(--accent)", color: "#fff", border: "none" }}
          >
            New Practice
          </button>
        </div>
      )}
    </div>
  );
}
