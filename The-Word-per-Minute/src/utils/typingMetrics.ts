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

/**
 * Compares typed characters using a small "typing friendly" normalization layer.
 * Bible text can contain curly quotes or typographic dashes, while users usually
 * type straight quotes and hyphens from a normal keyboard.
 */
export function areCharactersEquivalent(targetCharacter: string | undefined, typedCharacter: string | undefined) {
  if (targetCharacter === undefined || typedCharacter === undefined) return false;
  return normalizeComparableCharacter(targetCharacter) === normalizeComparableCharacter(typedCharacter);
}

function normalizeComparableCharacter(character: string) {
  return character
    .replace(/[\u2018\u2019\u201A\u201B`]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[\u00A0\u202F]/g, " ");
}

/**
 * Calculates live typing stats for the current passage or chapter session.
 * WPM uses the common typing-test convention of five correct characters per word.
 */
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
