interface LiveStatsProps {
  wpm: number;
  accuracy: number;
  timeRemaining: number | null;
  timeElapsed: number;
  errors: number;
  showWpm: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function LiveStats({
  wpm,
  accuracy,
  timeRemaining,
  timeElapsed,
  errors,
  showWpm,
}: LiveStatsProps) {
  return (
    <div
      className="flex items-center justify-center gap-4 sm:gap-8 py-3 px-4 rounded-xl text-sm font-medium"
      style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
    >
      {showWpm && (
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
            {wpm}
          </span>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            WPM
          </span>
        </div>
      )}

      <div className="flex flex-col items-center">
        <span
          className="text-2xl font-bold"
          style={{ color: accuracy >= 95 ? "var(--success)" : accuracy >= 80 ? "var(--warning)" : "var(--error)" }}
        >
          {accuracy}%
        </span>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          Accuracy
        </span>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
          {timeRemaining !== null ? formatTime(timeRemaining) : formatTime(timeElapsed)}
        </span>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {timeRemaining !== null ? "Remaining" : "Elapsed"}
        </span>
      </div>

      <div className="flex flex-col items-center">
        <span
          className="text-2xl font-bold"
          style={{ color: errors > 0 ? "var(--error)" : "var(--success)" }}
        >
          {errors}
        </span>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          Errors
        </span>
      </div>
    </div>
  );
}
