import { useCallback, useEffect, useRef, useState } from "react";
import type { PracticeBatch } from "../../../types/practice";
import {
  calculatePracticeSessionMetrics,
  countCorrectCharacters,
  countNewTypingMistakes,
} from "../utils/typingMetrics";

type UsePracticeSessionParams = {
  batches: PracticeBatch[];
  onCompletedAttempt: (wpm: number, accuracy: number) => void;
};

/**
 * Owns the active typing attempt: timers, typed text, batch progression, and completion recording.
 */
export function usePracticeSession({ batches, onCompletedAttempt }: UsePracticeSessionParams) {
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [mistakeCount, setMistakeCount] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [metricTime, setMetricTime] = useState(Date.now);
  const savedFinishAt = useRef<number | null>(null);

  const {
    accuracy,
    currentBatch,
    isBatchComplete,
    isPassageComplete,
    progress,
    status,
    targetText,
    wpm,
  } = calculatePracticeSessionMetrics({
    batches,
    currentBatchIndex,
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
    if (!isBatchComplete || isPassageComplete) return;

    const advanceTimer = window.setTimeout(() => {
      setCurrentBatchIndex((index) => index + 1);
      setTypedText("");
    }, 500);

    return () => window.clearTimeout(advanceTimer);
  }, [isBatchComplete, isPassageComplete]);

  useEffect(() => {
    if (!isPassageComplete || !finishedAt || savedFinishAt.current === finishedAt) return;

    savedFinishAt.current = finishedAt;
    onCompletedAttempt(wpm, accuracy);
  }, [accuracy, finishedAt, isPassageComplete, onCompletedAttempt, wpm]);

  const resetPractice = useCallback(() => {
    setCurrentBatchIndex(0);
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
    const nextBatchComplete =
      targetText.length > 0 &&
      limitedText.length === targetText.length &&
      nextCorrectCharacters === targetText.length;
    const nextPassageComplete = nextBatchComplete && currentBatchIndex === batches.length - 1;

    if (nextPassageComplete) {
      setFinishedAt((currentFinishedAt) => currentFinishedAt ?? Date.now());
      return;
    }

    setFinishedAt(null);
  }, [batches.length, currentBatchIndex, startedAt, targetText, typedText]);

  return {
    accuracy,
    currentBatch,
    currentBatchIndex,
    handleTyping,
    isBatchComplete,
    isPassageComplete,
    progress,
    resetPractice,
    status,
    typedText,
    wpm,
  };
}
