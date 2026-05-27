import { useMemo } from "react";
import { getLeaderboard } from "../lib/storage";
import { getGradeColor } from "../lib/grading";

interface LeaderboardProps {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const leaderboard = useMemo(() => getLeaderboard(), []);

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
          Personal Best
        </h2>
      </div>

      {leaderboard.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: "var(--panel)" }}
        >
          <p className="text-3xl mb-2">--</p>
          <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
            No scores yet
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Complete and save a test to see your leaderboard
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((r, i) => (
            <div
              key={r.id}
              className="flex items-center gap-4 px-4 py-3 rounded-lg"
              style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
            >
              <span
                className="text-lg font-bold w-8 text-center"
                style={{
                  color:
                    i === 0 ? "#facc15" : i === 1 ? "#94a3b8" : i === 2 ? "#d97706" : "var(--muted)",
                }}
              >
                #{i + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold" style={{ color: "var(--accent)" }}>
                    {r.wpm} WPM
                  </span>
                  <span
                    className="font-bold font-display"
                    style={{ color: getGradeColor(r.grade) }}
                  >
                    {r.grade}
                  </span>
                </div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>
                  {r.accuracy}% accuracy &middot; {r.mode === "untilComplete" ? "Full" : `${r.mode}s`} &middot;{" "}
                  {new Date(r.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
