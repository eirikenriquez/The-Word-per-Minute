import type { PassageResponse } from '../../../types/passage';
import type {
  PracticeCompletionResult,
  PracticeSource,
  SavePracticeAttemptInput,
} from '../types/practice';

type CreatePracticeAttemptInputParams = {
  completionResult: PracticeCompletionResult;
  featuredPassageId: string;
  passageResponse: PassageResponse | null;
  practiceSource: PracticeSource;
  savedPassageId: string;
};

/**
 * Combines the completed typing result with the active passage identity.
 */
export function createPracticeAttemptInput({
  completionResult,
  featuredPassageId,
  passageResponse,
  practiceSource,
  savedPassageId,
}: CreatePracticeAttemptInputParams): SavePracticeAttemptInput | null {
  if (!passageResponse) return null;

  return {
    accuracy: completionResult.accuracy,
    bookId: passageResponse.passage.bookId,
    chapter: passageResponse.passage.chapter,
    durationSeconds: completionResult.durationSeconds,
    endVerse: passageResponse.passage.endVerse,
    featuredPassageId:
      practiceSource === 'featured' ? featuredPassageId : undefined,
    mistakeCount: completionResult.mistakeCount,
    passageReference: passageResponse.reference,
    savedPassageId: practiceSource === 'saved' ? savedPassageId : undefined,
    selectedVerses: passageResponse.passage.selectedVerses,
    startVerse: passageResponse.passage.startVerse,
    translationId: passageResponse.translation.id,
    typedCharacterCount: completionResult.typedCharacterCount,
    wpm: completionResult.wpm,
  };
}
