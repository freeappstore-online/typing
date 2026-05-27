import type { Settings } from "../data/types";

interface SettingsPanelProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
  onBack: () => void;
}

export default function SettingsPanel({ settings, onChange, onBack }: SettingsPanelProps) {
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
          Settings
        </h2>
      </div>

      <div
        className="space-y-4 p-4 rounded-xl"
        style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
      >
        {/* Font size */}
        <div>
          <label className="text-sm font-semibold block mb-2" style={{ color: "var(--ink)" }}>
            Font Size
          </label>
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ border: "1px solid var(--line)" }}
          >
            {(["small", "medium", "large"] as const).map((size) => (
              <button
                key={size}
                onClick={() => onChange({ ...settings, fontSize: size })}
                className="flex-1 px-3 py-2 text-xs font-semibold capitalize cursor-pointer"
                style={{
                  background: settings.fontSize === size ? "var(--accent)" : "var(--paper)",
                  color: settings.fontSize === size ? "#fff" : "var(--muted)",
                  border: "none",
                  borderRight: "1px solid var(--line)",
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Caret style */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-semibold block" style={{ color: "var(--ink)" }}>
              Smooth Caret
            </label>
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              Smooth fade vs hard blink
            </span>
          </div>
          <button
            onClick={() => onChange({ ...settings, smoothCaret: !settings.smoothCaret })}
            className="w-11 h-6 rounded-full relative cursor-pointer transition-colors"
            style={{
              background: settings.smoothCaret ? "var(--accent)" : "var(--line-strong)",
              border: "none",
            }}
          >
            <div
              className="w-4 h-4 rounded-full absolute top-1 transition-all"
              style={{
                background: "#fff",
                left: settings.smoothCaret ? "calc(100% - 20px)" : "4px",
              }}
            />
          </button>
        </div>

        {/* Sound */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-semibold block" style={{ color: "var(--ink)" }}>
              Key Sound
            </label>
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              Click sound on each keystroke
            </span>
          </div>
          <button
            onClick={() => onChange({ ...settings, soundEnabled: !settings.soundEnabled })}
            className="w-11 h-6 rounded-full relative cursor-pointer transition-colors"
            style={{
              background: settings.soundEnabled ? "var(--accent)" : "var(--line-strong)",
              border: "none",
            }}
          >
            <div
              className="w-4 h-4 rounded-full absolute top-1 transition-all"
              style={{
                background: "#fff",
                left: settings.soundEnabled ? "calc(100% - 20px)" : "4px",
              }}
            />
          </button>
        </div>

        {/* Show live WPM */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-semibold block" style={{ color: "var(--ink)" }}>
              Show Live WPM
            </label>
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              Display WPM during test
            </span>
          </div>
          <button
            onClick={() => onChange({ ...settings, showLiveWpm: !settings.showLiveWpm })}
            className="w-11 h-6 rounded-full relative cursor-pointer transition-colors"
            style={{
              background: settings.showLiveWpm ? "var(--accent)" : "var(--line-strong)",
              border: "none",
            }}
          >
            <div
              className="w-4 h-4 rounded-full absolute top-1 transition-all"
              style={{
                background: "#fff",
                left: settings.showLiveWpm ? "calc(100% - 20px)" : "4px",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
