import { useState, useCallback, useRef, useEffect } from "react";
import type { TestMode, TestResult, TextSource } from "../data/types";
import { getGrade } from "../lib/grading";

export type TestState = "idle" | "running" | "finished";

interface CharState {
  char: string;
  status: "untyped" | "correct" | "incorrect";
}

interface UseTypingTestReturn {
  chars: readonly CharState[];
  cursorIndex: number;
  state: TestState;
  timeRemaining: number | null;
  timeElapsed: number;
  currentWpm: number;
  currentAccuracy: number;
  errorsCount: number;
  wpmOverTime: readonly number[];
  result: TestResult | null;
  errorKeys: Record<string, number>;
  start: () => void;
  handleKey: (key: string) => void;
  reset: () => void;
}

export function useTypingTest(
  text: string,
  mode: TestMode,
  textSource: TextSource,
): UseTypingTestReturn {
  const [chars, setChars] = useState<CharState[]>(() =>
    text.split("").map((c) => ({ char: c, status: "untyped" as const })),
  );
  const [cursorIndex, setCursorIndex] = useState(0);
  const [state, setState] = useState<TestState>("idle");
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    mode === "untilComplete" ? null : parseInt(mode),
  );
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentWpm, setCurrentWpm] = useState(0);
  const [currentAccuracy, setCurrentAccuracy] = useState(100);
  const [errorsCount, setErrorsCount] = useState(0);
  const [wpmOverTime, setWpmOverTime] = useState<number[]>([]);
  const [result, setResult] = useState<TestResult | null>(null);
  const [errorKeys, setErrorKeys] = useState<Record<string, number>>({});

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const correctCharsRef = useRef(0);
  const totalTypedRef = useRef(0);
  const errorsRef = useRef(0);
  const errorKeysRef = useRef<Record<string, number>>({});
  const wpmHistoryRef = useRef<number[]>([]);
  const charsRef = useRef(chars);
  const cursorRef = useRef(cursorIndex);

  charsRef.current = chars;
  cursorRef.current = cursorIndex;

  const computeWpm = useCallback(() => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
    if (elapsed <= 0) return 0;
    return Math.round((correctCharsRef.current / 5) / elapsed);
  }, []);

  const computeAccuracy = useCallback(() => {
    if (totalTypedRef.current === 0) return 100;
    return Math.round((correctCharsRef.current / totalTypedRef.current) * 100);
  }, []);

  const finishTest = useCallback(() => {
    setState("finished");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const minutes = elapsed / 60;
    const finalWpm = minutes > 0 ? Math.round((correctCharsRef.current / 5) / minutes) : 0;
    const rawWpm = minutes > 0 ? Math.round((totalTypedRef.current / 5) / minutes) : 0;
    const accuracy = totalTypedRef.current > 0
      ? Math.round((correctCharsRef.current / totalTypedRef.current) * 100)
      : 100;

    const testResult: TestResult = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      mode,
      textSource,
      wpm: finalWpm,
      rawWpm,
      accuracy,
      totalChars: totalTypedRef.current,
      correctChars: correctCharsRef.current,
      incorrectChars: errorsRef.current,
      timeTaken: Math.round(elapsed),
      grade: getGrade(finalWpm),
      wpmOverTime: [...wpmHistoryRef.current, finalWpm],
      errorKeys: { ...errorKeysRef.current },
    };

    setResult(testResult);
    setCurrentWpm(finalWpm);
    setCurrentAccuracy(accuracy);
  }, [mode, textSource]);

  const start = useCallback(() => {
    setState("running");
    startTimeRef.current = Date.now();
    correctCharsRef.current = 0;
    totalTypedRef.current = 0;
    errorsRef.current = 0;
    errorKeysRef.current = {};
    wpmHistoryRef.current = [];

    const duration = mode === "untilComplete" ? null : parseInt(mode);

    timerRef.current = setInterval(() => {
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      setTimeElapsed(elapsed);

      const wpm = computeWpm();
      setCurrentWpm(wpm);
      setCurrentAccuracy(computeAccuracy());

      // Record WPM every second
      wpmHistoryRef.current.push(wpm);
      setWpmOverTime([...wpmHistoryRef.current]);

      if (duration !== null) {
        const remaining = Math.max(0, duration - elapsed);
        setTimeRemaining(remaining);
        if (remaining <= 0) {
          finishTest();
        }
      }
    }, 1000);
  }, [mode, computeWpm, computeAccuracy, finishTest]);

  const handleKey = useCallback(
    (key: string) => {
      if (state === "finished") return;

      if (state === "idle") {
        start();
      }

      const currentChars = charsRef.current;
      const cursor = cursorRef.current;

      if (key === "Backspace") {
        if (cursor > 0) {
          const newChars = [...currentChars];
          const prevChar = newChars[cursor - 1];
          if (prevChar) {
            if (prevChar.status === "incorrect") {
              errorsRef.current = Math.max(0, errorsRef.current - 1);
              totalTypedRef.current = Math.max(0, totalTypedRef.current - 1);
              setErrorsCount(errorsRef.current);
            } else if (prevChar.status === "correct") {
              correctCharsRef.current = Math.max(0, correctCharsRef.current - 1);
              totalTypedRef.current = Math.max(0, totalTypedRef.current - 1);
            }
            newChars[cursor - 1] = { ...prevChar, status: "untyped" };
          }
          setChars(newChars);
          setCursorIndex(cursor - 1);
        }
        return;
      }

      // Ignore non-printable keys
      if (key.length !== 1) return;

      if (cursor >= currentChars.length) return;

      const expected = currentChars[cursor];
      if (!expected) return;

      const isCorrect = key === expected.char;
      const newChars = [...currentChars];
      newChars[cursor] = {
        ...expected,
        status: isCorrect ? "correct" : "incorrect",
      };

      totalTypedRef.current++;
      if (isCorrect) {
        correctCharsRef.current++;
      } else {
        errorsRef.current++;
        setErrorsCount(errorsRef.current);
        const errorKey = expected.char.toLowerCase();
        errorKeysRef.current[errorKey] = (errorKeysRef.current[errorKey] ?? 0) + 1;
        setErrorKeys({ ...errorKeysRef.current });
      }

      setChars(newChars);
      setCursorIndex(cursor + 1);
      setCurrentWpm(computeWpm());
      setCurrentAccuracy(computeAccuracy());

      // Check if finished (all chars typed)
      if (cursor + 1 >= currentChars.length) {
        finishTest();
      }
    },
    [state, start, computeWpm, computeAccuracy, finishTest],
  );

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setChars(text.split("").map((c) => ({ char: c, status: "untyped" as const })));
    setCursorIndex(0);
    setState("idle");
    setTimeRemaining(mode === "untilComplete" ? null : parseInt(mode));
    setTimeElapsed(0);
    setCurrentWpm(0);
    setCurrentAccuracy(100);
    setErrorsCount(0);
    setWpmOverTime([]);
    setResult(null);
    setErrorKeys({});
    correctCharsRef.current = 0;
    totalTypedRef.current = 0;
    errorsRef.current = 0;
    errorKeysRef.current = {};
    wpmHistoryRef.current = [];
  }, [text, mode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Reset when text changes
  useEffect(() => {
    reset();
  }, [reset]);

  return {
    chars,
    cursorIndex,
    state,
    timeRemaining,
    timeElapsed,
    currentWpm,
    currentAccuracy,
    errorsCount,
    wpmOverTime,
    result,
    errorKeys,
    start,
    handleKey,
    reset,
  };
}
