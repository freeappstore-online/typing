import { useState, useCallback, useMemo } from "react";
import type { TestMode, TextSource, Settings } from "./data/types";
import { getRandomPassage, generateWordList } from "./data/passages";
import { getSettings, saveSettings, saveResult } from "./lib/storage";
import { playKeyClick } from "./lib/sound";
import { useTypingTest } from "./hooks/useTypingTest";
import TypingArea from "./components/TypingArea";
import LiveStats from "./components/LiveStats";
import WpmChart from "./components/WpmChart";
import ResultsScreen from "./components/ResultsScreen";
import ModeSelector from "./components/ModeSelector";
import HistoryView from "./components/HistoryView";
import Leaderboard from "./components/Leaderboard";
import KeyboardHeatmap from "./components/KeyboardHeatmap";
import PracticeMode from "./components/PracticeMode";
import SettingsPanel from "./components/SettingsPanel";

type View =
  | { type: "test" }
  | { type: "history" }
  | { type: "leaderboard" }
  | { type: "heatmap" }
  | { type: "practice" }
  | { type: "settings" };

export default function App() {
  const [view, setView] = useState<View>({ type: "test" });
  const [mode, setMode] = useState<TestMode>("30");
  const [textSource, setTextSource] = useState<TextSource>("passage");
  const [settings, setSettings] = useState<Settings>(getSettings);
  const [resultSaved, setResultSaved] = useState(false);
  const [textKey, setTextKey] = useState(0);

  // Generate text based on source
  const text = useMemo(() => {
    // textKey forces re-generation
    void textKey;
    if (textSource === "words") {
      return generateWordList(80);
    }
    return getRandomPassage().text;
  }, [textSource, textKey]);

  const test = useTypingTest(text, mode, textSource);

  const handleKey = useCallback(
    (key: string) => {
      if (settings.soundEnabled) playKeyClick();
      test.handleKey(key);
    },
    [settings.soundEnabled, test],
  );

  const handleNewTest = useCallback(() => {
    setTextKey((k) => k + 1);
    setResultSaved(false);
  }, []);

  const handleSaveResult = useCallback(() => {
    if (test.result) {
      saveResult(test.result);
      setResultSaved(true);
    }
  }, [test.result]);

  const handleSettingsChange = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  const handleModeChange = useCallback((newMode: TestMode) => {
    setMode(newMode);
    setTextKey((k) => k + 1);
    setResultSaved(false);
  }, []);

  const handleSourceChange = useCallback((newSource: TextSource) => {
    setTextSource(newSource);
    setTextKey((k) => k + 1);
    setResultSaved(false);
  }, []);

  const navItems: { key: View["type"]; label: string; icon: string }[] = [
    { key: "test", label: "Test", icon: "keyboard" },
    { key: "practice", label: "Practice", icon: "target" },
    { key: "history", label: "History", icon: "chart" },
    { key: "leaderboard", label: "Best", icon: "trophy" },
    { key: "heatmap", label: "Heatmap", icon: "grid" },
    { key: "settings", label: "Settings", icon: "gear" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--paper)" }}>
      {/* Header */}
      <header
        className="shrink-0 px-4 py-3 sm:px-6"
        style={{ borderBottom: "1px solid var(--line)", background: "var(--glass)" }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1
            className="text-lg font-bold font-display cursor-pointer"
            style={{ color: "var(--ink)" }}
            onClick={() => { setView({ type: "test" }); handleNewTest(); }}
          >
            Typing Test
          </h1>
          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setView({ type: item.key })}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                style={{
                  background: view.type === item.key ? "var(--accent)" : "transparent",
                  color: view.type === item.key ? "#fff" : "var(--muted)",
                  border: "none",
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-5 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Test view */}
          {view.type === "test" && (
            <div className="space-y-5">
              {/* Mode selector */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <ModeSelector
                  mode={mode}
                  textSource={textSource}
                  onModeChange={handleModeChange}
                  onSourceChange={handleSourceChange}
                  disabled={test.state === "running"}
                />
                {test.state !== "idle" && (
                  <button
                    onClick={handleNewTest}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                    style={{
                      background: "var(--panel)",
                      border: "1px solid var(--line)",
                      color: "var(--muted)",
                    }}
                  >
                    New Test
                  </button>
                )}
              </div>

              {/* Running state */}
              {test.state !== "finished" && (
                <>
                  {/* Live stats */}
                  {test.state === "running" && (
                    <LiveStats
                      wpm={test.currentWpm}
                      accuracy={test.currentAccuracy}
                      timeRemaining={test.timeRemaining}
                      timeElapsed={test.timeElapsed}
                      errors={test.errorsCount}
                      showWpm={settings.showLiveWpm}
                    />
                  )}

                  {/* Typing area */}
                  <TypingArea
                    chars={test.chars}
                    cursorIndex={test.cursorIndex}
                    isRunning={test.state === "running"}
                    isFinished={false}
                    settings={settings}
                    onKey={handleKey}
                  />

                  {/* Live WPM chart during test */}
                  {test.state === "running" && test.wpmOverTime.length > 0 && (
                    <div
                      className="p-3 rounded-xl flex justify-center"
                      style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
                    >
                      <WpmChart
                        data={test.wpmOverTime}
                        width={360}
                        height={120}
                        label="Live WPM"
                      />
                    </div>
                  )}

                  {/* Prompt */}
                  {test.state === "idle" && (
                    <p className="text-center text-sm" style={{ color: "var(--muted)" }}>
                      Click the text area above and start typing. The timer begins on your first keystroke.
                    </p>
                  )}
                </>
              )}

              {/* Finished state */}
              {test.state === "finished" && test.result && (
                <ResultsScreen
                  result={test.result}
                  onRestart={handleNewTest}
                  onSave={handleSaveResult}
                  saved={resultSaved}
                />
              )}
            </div>
          )}

          {/* Other views */}
          {view.type === "history" && (
            <HistoryView onBack={() => setView({ type: "test" })} />
          )}
          {view.type === "leaderboard" && (
            <Leaderboard onBack={() => setView({ type: "test" })} />
          )}
          {view.type === "heatmap" && (
            <KeyboardHeatmap onBack={() => setView({ type: "test" })} />
          )}
          {view.type === "practice" && (
            <PracticeMode
              settings={settings}
              onBack={() => setView({ type: "test" })}
            />
          )}
          {view.type === "settings" && (
            <SettingsPanel
              settings={settings}
              onChange={handleSettingsChange}
              onBack={() => setView({ type: "test" })}
            />
          )}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="sm:hidden shrink-0 flex items-center justify-around py-2 px-1"
        style={{
          borderTop: "1px solid var(--line)",
          background: "var(--dock)",
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setView({ type: item.key })}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg cursor-pointer"
            style={{
              background: "transparent",
              border: "none",
              color: view.type === item.key ? "var(--accent)" : "var(--muted)",
            }}
          >
            <NavIcon name={item.icon} active={view.type === item.key} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer (desktop) */}
      <footer
        className="hidden sm:flex shrink-0 items-center justify-center px-4 py-2 text-xs"
        style={{ borderTop: "1px solid var(--line)", color: "var(--muted)" }}
      >
        Typing Test — Free on FreeAppStore
      </footer>
    </div>
  );
}

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const color = active ? "var(--accent)" : "var(--muted)";
  const size = 18;

  switch (name) {
    case "keyboard":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <line x1="6" y1="8" x2="6" y2="8" />
          <line x1="10" y1="8" x2="10" y2="8" />
          <line x1="14" y1="8" x2="14" y2="8" />
          <line x1="18" y1="8" x2="18" y2="8" />
          <line x1="6" y1="12" x2="6" y2="12" />
          <line x1="10" y1="12" x2="10" y2="12" />
          <line x1="14" y1="12" x2="14" y2="12" />
          <line x1="18" y1="12" x2="18" y2="12" />
          <line x1="7" y1="16" x2="17" y2="16" />
        </svg>
      );
    case "target":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "chart":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case "trophy":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      );
    case "grid":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      );
    case "gear":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    default:
      return null;
  }
}
