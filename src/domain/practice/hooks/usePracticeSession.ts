import { useCallback, useEffect, useRef, useState } from "react";
import type { PracticePassage } from "../../../shared/types/practice";
import {
  calculatePracticeSessionMetrics,
  countCorrectCharacters,
  countNewTypingMistakes,
} from "../utils/typingMetrics";

type UsePracticeSessionParams = {
  passage: PracticePassage | undefined;
  onCompletedAttempt: (wpm: number, accuracy: number) => void;
};

/**
 * Owns the active typing attempt: timers, typed text, scoring, and completion recording.
 */
export function usePracticeSession({ passage, onCompletedAttempt }: UsePracticeSessionParams) {
  const [typedText, setTypedText] = useState("");
  const [mistakeCount, setMistakeCount] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [metricTime, setMetricTime] = useState(Date.now);
  const savedFinishAt = useRef<number | null>(null);

  const {
    accuracy,
    isPassageComplete,
    progress,
    status,
    targetText,
    wpm,
  } = calculatePracticeSessionMetrics({
    passage,
    typedText,
    mistakeCount,
    startedAt,
    finishedAt,
    now: metricTime,
  });

  useEffect(() => {
    if (!startedAt || finishedAt) return;

    const metricTimer = window.setInterval(() => {
      setMetricTime(Date.now());
    }, 500);

    return () => window.clearInterval(metricTimer);
  }, [finishedAt, startedAt]);

  useEffect(() => {
    if (!isPassageComplete || !finishedAt || savedFinishAt.current === finishedAt) return;

    savedFinishAt.current = finishedAt;
    onCompletedAttempt(wpm, accuracy);
  }, [accuracy, finishedAt, isPassageComplete, onCompletedAttempt, wpm]);

  const resetPractice = useCallback(() => {
    setTypedText("");
    setMistakeCount(0);
    setStartedAt(null);
    setFinishedAt(null);
    savedFinishAt.current = null;
  }, []);

  const handleTyping = useCallback((nextTypedText: string) => {
    const limitedText = nextTypedText.slice(0, targetText.length);
    const newMistakes = countNewTypingMistakes(targetText, typedText, limitedText);

    if (!startedAt && limitedText.length > 0) {
      const startTime = Date.now();
      setStartedAt(startTime);
      setMetricTime(startTime);
    }

    if (newMistakes) {
      setMistakeCount((currentMistakeCount) => currentMistakeCount + newMistakes);
    }

    setTypedText(limitedText);

    const nextCorrectCharacters = countCorrectCharacters(targetText, limitedText);
    const nextPassageComplete =
      targetText.length > 0 &&
      limitedText.length === targetText.length &&
      nextCorrectCharacters === targetText.length;

    if (nextPassageComplete) {
      setFinishedAt((currentFinishedAt) => currentFinishedAt ?? Date.now());
      return;
    }

    setFinishedAt(null);
  }, [startedAt, targetText, typedText]);

  return {
    accuracy,
    handleTyping,
    isPassageComplete,
    progress,
    resetPractice,
    status,
    typedText,
    wpm,
  };
}
