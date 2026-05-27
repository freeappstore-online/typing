import { useMemo } from "react";

import { getResults, getAverageWpm, getBestWpm } from "../lib/storage";
import { getGradeColor } from "../lib/grading";
import WpmChart from "./WpmChart";

interface HistoryViewProps {
  onBack: () => void;
}

export default function HistoryView({ onBack }: HistoryViewProps) {
  const results = useMemo(() => getResults(), []);
  const avgWpm = useMemo(() => getAverageWpm(), []);
  const bestWpm = useMemo(() => getBestWpm(), []);

  const wpmTrend = useMemo(() => results.map((r) => r.wpm), [results]);
  const accuracyTrend = useMemo(() => results.map((r) => r.accuracy), [results]);

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
          History
        </h2>
      </div>

      {results.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: "var(--panel)" }}
        >
          <p className="text-3xl mb-2">--</p>
          <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
            No tests yet
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Complete a typing test and save it to see your history
          </p>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            <div
              className="flex flex-col items-center py-3 rounded-lg"
              style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
            >
              <span className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
                {results.length}
              </span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                Tests
              </span>
            </div>
            <div
              className="flex flex-col items-center py-3 rounded-lg"
              style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
            >
              <span className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
                {avgWpm}
              </span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                Avg WPM
              </span>
            </div>
            <div
              className="flex flex-col items-center py-3 rounded-lg"
              style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
            >
              <span className="text-2xl font-bold" style={{ color: "var(--success)" }}>
                {bestWpm}
              </span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                Best WPM
              </span>
            </div>
          </div>

          {/* WPM trend */}
          {wpmTrend.length > 1 && (
            <div
              className="p-4 rounded-xl flex justify-center"
              style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
            >
              <WpmChart data={wpmTrend} width={360} height={150} label="WPM Trend" />
            </div>
          )}

          {/* Accuracy trend */}
          {accuracyTrend.length > 1 && (
            <div
              className="p-4 rounded-xl flex justify-center"
              style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
            >
              <WpmChart data={accuracyTrend} width={360} height={150} label="Accuracy Trend (%)" />
            </div>
          )}

          {/* Recent results */}
          <div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--ink)" }}>
              Recent Results
            </h3>
            <div className="space-y-2">
              {[...results].reverse().slice(0, 20).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between px-4 py-2 rounded-lg text-sm"
                  style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="font-bold font-display text-lg w-8 text-center"
                      style={{ color: getGradeColor(r.grade) }}
                    >
                      {r.grade}
                    </span>
                    <div>
                      <span className="font-semibold" style={{ color: "var(--ink)" }}>
                        {r.wpm} WPM
                      </span>
                      <span className="ml-2" style={{ color: "var(--muted)" }}>
                        {r.accuracy}% acc
                      </span>
                    </div>
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    {r.mode === "untilComplete" ? "Full" : `${r.mode}s`} &middot;{" "}
                    {new Date(r.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
