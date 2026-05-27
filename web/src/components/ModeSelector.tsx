import type { TestMode, TextSource } from "../data/types";

interface ModeSelectorProps {
  mode: TestMode;
  textSource: TextSource;
  onModeChange: (mode: TestMode) => void;
  onSourceChange: (source: TextSource) => void;
  disabled: boolean;
}

const MODES: { value: TestMode; label: string }[] = [
  { value: "15", label: "15s" },
  { value: "30", label: "30s" },
  { value: "60", label: "60s" },
  { value: "120", label: "120s" },
  { value: "untilComplete", label: "Full" },
];

const SOURCES: { value: TextSource; label: string }[] = [
  { value: "passage", label: "Passage" },
  { value: "words", label: "Words" },
];

export default function ModeSelector({
  mode,
  textSource,
  onModeChange,
  onSourceChange,
  disabled,
}: ModeSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      {/* Timer mode */}
      <div
        className="flex items-center rounded-lg overflow-hidden"
        style={{ border: "1px solid var(--line)" }}
      >
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => onModeChange(m.value)}
            disabled={disabled}
            className="px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors"
            style={{
              background: mode === m.value ? "var(--accent)" : "var(--panel)",
              color: mode === m.value ? "#fff" : "var(--muted)",
              border: "none",
              borderRight: "1px solid var(--line)",
              opacity: disabled ? 0.5 : 1,
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Text source */}
      <div
        className="flex items-center rounded-lg overflow-hidden"
        style={{ border: "1px solid var(--line)" }}
      >
        {SOURCES.map((s) => (
          <button
            key={s.value}
            onClick={() => onSourceChange(s.value)}
            disabled={disabled}
            className="px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors"
            style={{
              background: textSource === s.value ? "var(--accent)" : "var(--panel)",
              color: textSource === s.value ? "#fff" : "var(--muted)",
              border: "none",
              borderRight: "1px solid var(--line)",
              opacity: disabled ? 0.5 : 1,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
