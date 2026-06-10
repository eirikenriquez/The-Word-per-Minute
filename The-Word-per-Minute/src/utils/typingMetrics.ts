import type { TypingMetrics } from "../types/practice";

type TypingMetricsInput = {
  targetText: string;
  typedText: string;
  startedAt: number | null;
  finishedAt: number | null;
  now?: number;
};

export function countCorrectCharacters(targetText: string, typedText: string) {
  return typedText
    .split("")
    .filter((character, index) => areCharactersEquivalent(targetText[index], character)).length;
}

export function areCharactersEquivalent(targetCharacter: string | undefined, typedCharacter: string | undefined) {
  if (targetCharacter === undefined || typedCharacter === undefined) return false;
  return normalizeTypedCharacter(targetCharacter) === normalizeTypedCharacter(typedCharacter);
}

function normalizeTypedCharacter(character: string) {
  if (character === "’" || character === "‘") return "'";
  return character;
}

export function calculateTypingMetrics({
  targetText,
  typedText,
  startedAt,
  finishedAt,
  now = Date.now(),
}: TypingMetricsInput): TypingMetrics {
  const correctCharacters = countCorrectCharacters(targetText, typedText);
  const progress = targetText.length
    ? Math.round((typedText.length / targetText.length) * 100)
    : 0;
  const accuracy = typedText.length
    ? Math.round((correctCharacters / typedText.length) * 100)
    : 100;
  const elapsedMs = startedAt ? (finishedAt ?? now) - startedAt : 0;
  const elapsedMinutes = elapsedMs / 1000 / 60;
  const wpm = elapsedMinutes > 0 ? Math.round(correctCharacters / 5 / elapsedMinutes) : 0;
  const isComplete = Boolean(
    targetText && typedText.length === targetText.length && correctCharacters === targetText.length,
  );

  return {
    correctCharacters,
    progress: Math.min(progress, 100),
    accuracy,
    wpm,
    isComplete,
    status: isComplete ? "Complete" : startedAt ? "Typing" : "Ready",
  };
}
