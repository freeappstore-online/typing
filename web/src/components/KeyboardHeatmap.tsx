import { useMemo } from "react";
import { getErrorKeyStats } from "../lib/storage";

interface KeyboardHeatmapProps {
  onBack: () => void;
}

const ROWS: readonly (readonly string[])[] = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
];

function getKeyColor(errors: number, maxErrors: number): string {
  if (errors === 0) return "var(--success)";
  const ratio = errors / Math.max(1, maxErrors);
  if (ratio < 0.25) return "var(--warning)";
  if (ratio < 0.5) return "#f97316";
  return "var(--error)";
}

export default function KeyboardHeatmap({ onBack }: KeyboardHeatmapProps) {
  const errorStats = useMemo(() => getErrorKeyStats(), []);
  const maxErrors = useMemo(
    () => Math.max(1, ...Object.values(errorStats)),
    [errorStats],
  );
  const hasData = Object.keys(errorStats).length > 0;

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
          Keyboard Heatmap
        </h2>
      </div>

      {!hasData ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: "var(--panel)" }}
        >
          <p className="text-3xl mb-2">--</p>
          <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
            No error data yet
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Complete some typing tests to see your error patterns
          </p>
        </div>
      ) : (
        <div
          className="p-4 rounded-xl"
          style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
        >
          <div className="flex flex-col items-center gap-1.5">
            {ROWS.map((row, ri) => (
              <div key={ri} className="flex gap-1" style={{ marginLeft: `${ri * 12}px` }}>
                {row.map((key) => {
                  const errors = errorStats[key] ?? 0;
                  const color = getKeyColor(errors, maxErrors);
                  return (
                    <div
                      key={key}
                      className="flex flex-col items-center justify-center rounded font-mono-typing text-xs font-semibold"
                      style={{
                        width: "36px",
                        height: "36px",
                        background: color,
                        color: "#fff",
                        opacity: errors === 0 ? 0.6 : 0.85 + 0.15 * (errors / maxErrors),
                      }}
                      title={`${key}: ${errors} error${errors !== 1 ? "s" : ""}`}
                    >
                      <span>{key}</span>
                      {errors > 0 && (
                        <span className="text-[8px] opacity-80">{errors}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Space bar */}
            <div className="flex gap-1" style={{ marginLeft: "48px" }}>
              <div
                className="flex items-center justify-center rounded font-mono-typing text-xs font-semibold"
                style={{
                  width: "200px",
                  height: "36px",
                  background: getKeyColor(errorStats[" "] ?? 0, maxErrors),
                  color: "#fff",
                  opacity: (errorStats[" "] ?? 0) === 0 ? 0.6 : 0.85,
                }}
                title={`space: ${errorStats[" "] ?? 0} errors`}
              >
                space {(errorStats[" "] ?? 0) > 0 ? `(${errorStats[" "]})` : ""}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs" style={{ color: "var(--muted)" }}>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ background: "var(--success)", opacity: 0.6 }} />
              <span>Accurate</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ background: "var(--warning)" }} />
              <span>Some errors</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ background: "var(--error)" }} />
              <span>Frequent errors</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
