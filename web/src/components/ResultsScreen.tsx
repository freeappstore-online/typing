import type { TestResult } from "../data/types";
import { getGradeColor } from "../lib/grading";
import WpmChart from "./WpmChart";

interface ResultsScreenProps {
  result: TestResult;
  onRestart: () => void;
  onSave: () => void;
  saved: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function ResultsScreen({ result, onRestart, onSave, saved }: ResultsScreenProps) {
  const gradeColor = getGradeColor(result.grade);

  return (
    <div className="space-y-6">
      {/* Grade + WPM hero */}
      <div
        className="text-center py-8 rounded-xl"
        style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
      >
        <div
          className="text-6xl font-bold font-display"
          style={{ color: gradeColor }}
        >
          {result.grade}
        </div>
        <div className="mt-2 text-4xl font-bold" style={{ color: "var(--accent)" }}>
          {result.wpm} WPM
        </div>
        <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Net speed (adjusted for errors)
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatBox label="Raw WPM" value={String(result.rawWpm)} />
        <StatBox
          label="Accuracy"
          value={`${result.accuracy}%`}
          color={result.accuracy >= 95 ? "var(--success)" : result.accuracy >= 80 ? "var(--warning)" : "var(--error)"}
        />
        <StatBox label="Time" value={formatTime(result.timeTaken)} />
        <StatBox label="Total Chars" value={String(result.totalChars)} />
        <StatBox label="Correct" value={String(result.correctChars)} color="var(--success)" />
        <StatBox label="Incorrect" value={String(result.incorrectChars)} color="var(--error)" />
      </div>

      {/* WPM chart */}
      {result.wpmOverTime.length > 1 && (
        <div
          className="p-4 rounded-xl flex justify-center"
          style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
        >
          <WpmChart data={result.wpmOverTime} width={360} height={160} label="Speed Over Time" />
        </div>
      )}

      {/* Error keys */}
      {Object.keys(result.errorKeys).length > 0 && (
        <div
          className="p-4 rounded-xl"
          style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
        >
          <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--ink)" }}>
            Problem Keys
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(result.errorKeys)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([key, count]) => (
                <span
                  key={key}
                  className="font-mono-typing text-sm px-2 py-1 rounded"
                  style={{
                    background: "var(--error)",
                    color: "#fff",
                    opacity: Math.min(1, 0.4 + count * 0.15),
                  }}
                >
                  {key === " " ? "space" : key} ({count})
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        {!saved && (
          <button
            onClick={onSave}
            className="px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer"
            style={{
              background: "var(--success)",
              color: "#fff",
              border: "none",
            }}
          >
            Save Result
          </button>
        )}
        {saved && (
          <span className="text-sm font-medium" style={{ color: "var(--success)" }}>
            Saved!
          </span>
        )}
        <button
          onClick={onRestart}
          className="px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer"
          style={{
            background: "var(--accent)",
            color: "#fff",
            border: "none",
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      className="flex flex-col items-center py-3 px-2 rounded-lg"
      style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
    >
      <span className="text-xl font-bold" style={{ color: color ?? "var(--ink)" }}>
        {value}
      </span>
      <span className="text-xs" style={{ color: "var(--muted)" }}>
        {label}
      </span>
    </div>
  );
}
