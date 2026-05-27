import { useRef, useEffect } from "react";
import type { Settings } from "../data/types";

interface CharState {
  char: string;
  status: "untyped" | "correct" | "incorrect";
}

interface TypingAreaProps {
  chars: readonly CharState[];
  cursorIndex: number;
  isRunning: boolean;
  isFinished: boolean;
  settings: Settings;
  onKey: (key: string) => void;
}

const FONT_SIZES: Record<string, string> = {
  small: "text-sm leading-7",
  medium: "text-lg leading-9",
  large: "text-2xl leading-12",
};

export default function TypingArea({
  chars,
  cursorIndex,
  isRunning,
  isFinished,
  settings,
  onKey,
}: TypingAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorSpanRef = useRef<HTMLSpanElement>(null);

  // Focus the container on mount and when test resets
  useEffect(() => {
    containerRef.current?.focus();
  }, [chars.length]);

  // Scroll cursor into view
  useEffect(() => {
    if (cursorSpanRef.current) {
      cursorSpanRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [cursorIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    if (e.key === "Tab" || e.key === "Escape") return;
    onKey(e.key);
  };

  const fontSize = FONT_SIZES[settings.fontSize] ?? FONT_SIZES["medium"];

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`font-mono-typing ${fontSize} rounded-xl p-4 sm:p-6 outline-none select-none overflow-y-auto max-h-64 sm:max-h-80 whitespace-pre-wrap break-words`}
      style={{
        background: "var(--panel)",
        border: "2px solid var(--line)",
        cursor: "text",
        lineHeight: "2.2",
      }}
      role="textbox"
      aria-label="Typing area"
    >
      {!isRunning && !isFinished && cursorIndex === 0 && (
        <span
          className="absolute text-xs font-sans"
          style={{ color: "var(--muted)", marginTop: "-1.5rem" }}
        >
          Start typing to begin...
        </span>
      )}
      {chars.map((c, i) => {
        const isCursor = i === cursorIndex && !isFinished;
        const color =
          c.status === "correct"
            ? "var(--ink)"
            : c.status === "incorrect"
              ? "var(--error)"
              : "var(--muted)";

        return (
          <span
            key={i}
            ref={isCursor ? cursorSpanRef : undefined}
            style={{
              color,
              textDecoration: c.status === "incorrect" ? "underline" : "none",
              textDecorationColor: c.status === "incorrect" ? "var(--error)" : undefined,
              position: "relative",
              borderLeft: isCursor ? "2px solid var(--accent)" : "none",
              marginLeft: isCursor ? "-1px" : "0",
              paddingLeft: isCursor ? "1px" : "0",
            }}
            className={isCursor ? (settings.smoothCaret ? "cursor-smooth" : "cursor-blink") : ""}
          >
            {c.char === " " ? " " : c.char}
          </span>
        );
      })}
    </div>
  );
}
