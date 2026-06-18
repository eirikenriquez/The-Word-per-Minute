import type { PracticeBatch, TypingMetrics } from "../../../types/practice";

type PracticeSessionMetricsInput = {
  batches: PracticeBatch[];
  currentBatchIndex: number;
  typedText: string;
  mistakeCount: number;
  startedAt: number | null;
  finishedAt: number | null;
  now?: number;
};

type PracticeSessionMetrics = {
  accuracy: number;
  currentBatch: PracticeBatch | undefined;
  isBatchComplete: boolean;
  isPassageComplete: boolean;
  progress: number;
  status: TypingMetrics["status"];
  targetText: string;
  wpm: number;
};

/**
 * Counts characters that match after applying the typing-friendly punctuation rules.
 */
export function countCorrectCharacters(targetText: string, typedText: string) {
  return typedText
    .split("")
    .filter((character, index) => areCharactersEquivalent(targetText[index], character)).length;
}

/**
 * Counts newly entered incorrect characters between two input states.
 * Deleting text is neutral, while replacements and pasted text are treated as new typing.
 */
export function countNewTypingMistakes(
  targetText: string,
  previousTypedText: string,
  nextTypedText: string,
) {
  let sharedPrefixLength = 0;

  while (
    sharedPrefixLength < previousTypedText.length &&
    sharedPrefixLength < nextTypedText.length &&
    previousTypedText[sharedPrefixLength] === nextTypedText[sharedPrefixLength]
  ) {
    sharedPrefixLength += 1;
  }

  let sharedSuffixLength = 0;
  const previousRemainingLength = previousTypedText.length - sharedPrefixLength;
  const nextRemainingLength = nextTypedText.length - sharedPrefixLength;

  while (
    sharedSuffixLength < previousRemainingLength &&
    sharedSuffixLength < nextRemainingLength &&
    previousTypedText[previousTypedText.length - 1 - sharedSuffixLength] ===
      nextTypedText[nextTypedText.length - 1 - sharedSuffixLength]
  ) {
    sharedSuffixLength += 1;
  }

  const newlyEnteredText = nextTypedText.slice(
    sharedPrefixLength,
    nextTypedText.length - sharedSuffixLength,
  );

  return newlyEnteredText
    .split("")
    .filter((character, index) => {
      const targetIndex = sharedPrefixLength + index;
      return !areCharactersEquivalent(targetText[targetIndex], character);
    })
    .length;
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

/**
 * Normalizes common punctuation variants that users should not have to type exactly.
 */
function normalizeComparableCharacter(character: string) {
  return character
    .replace(/[\u2018\u2019\u201A\u201B`]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[\u00A0\u202F]/g, " ");
}

/**
 * Calculates stats across every completed batch plus the batch currently on screen.
 * This keeps longer Bible selections and featured passages scored as one session.
 */
export function calculatePracticeSessionMetrics({
  batches,
  currentBatchIndex,
  typedText,
  mistakeCount,
  startedAt,
  finishedAt,
  now = Date.now(),
}: PracticeSessionMetricsInput): PracticeSessionMetrics {
  const currentBatch = batches[currentBatchIndex];
  const targetText = currentBatch?.text ?? "";
  const currentCorrectCharacters = countCorrectCharacters(targetText, typedText);
  const completedCharacterCount = batches
    .slice(0, currentBatchIndex)
    .reduce((total, batch) => total + batch.text.length, 0);
  const totalCharacterCount = batches.reduce((total, batch) => total + batch.text.length, 0);
  const totalCorrectCharacters = completedCharacterCount + currentCorrectCharacters;
  const totalTypedCharacters = completedCharacterCount + typedText.length;
  const progress = totalCharacterCount
    ? Math.round((totalTypedCharacters / totalCharacterCount) * 100)
    : 0;
  const scoredCharacterCount = totalCorrectCharacters + mistakeCount;
  const accuracy = scoredCharacterCount
    ? Math.round((totalCorrectCharacters / scoredCharacterCount) * 100)
    : 100;
  const elapsedMs = startedAt ? (finishedAt ?? now) - startedAt : 0;
  const elapsedMinutes = elapsedMs / 1000 / 60;
  const wpm = elapsedMinutes > 0 ? Math.round(totalCorrectCharacters / 5 / elapsedMinutes) : 0;
  const isBatchComplete = Boolean(
    targetText && typedText.length === targetText.length && currentCorrectCharacters === targetText.length,
  );
  const isPassageComplete = isBatchComplete && currentBatchIndex === batches.length - 1;

  return {
    accuracy,
    currentBatch,
    isBatchComplete,
    isPassageComplete,
    progress: Math.min(progress, 100),
    status: isPassageComplete ? "Complete" : startedAt ? "Typing" : "Ready",
    targetText,
    wpm,
  };
}
