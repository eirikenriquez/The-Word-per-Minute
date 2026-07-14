import { ArrowRightIcon } from "@heroicons/react/24/outline";
import type { PracticePassage } from "../../../shared/types/practice";
import { Button } from "../../../shared/ui/Button";
import { PracticeReflectionDialog } from "./PracticeReflectionDialog";
import { PracticeTypingSurface } from "./PracticeTypingSurface";

type PracticePassageDisplayProps = {
  accuracy: number;
  canSaveReflection: boolean;
  completionActionLabel?: string;
  completionMessage: string;
  isComplete: boolean;
  isSavingReflection: boolean;
  isSignedIn: boolean;
  onTypingChange: (typedText: string) => void;
  onCompletionAction?: () => void;
  onSaveReflection: (reflection: string) => Promise<boolean>;
  passage: PracticePassage;
  reflectionError: string | null;
  translationName: string;
  typedText: string;
  wpm: number;
};

/**
 * Composes the active passage, completion summary, and reflection action.
 */
export function PracticePassageDisplay({
  accuracy,
  canSaveReflection,
  completionActionLabel,
  completionMessage,
  isComplete,
  isSavingReflection,
  isSignedIn,
  onTypingChange,
  onCompletionAction,
  onSaveReflection,
  passage,
  reflectionError,
  translationName,
  typedText,
  wpm,
}: PracticePassageDisplayProps) {
  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-ink-muted">
          {passage.ref} <span className="text-ink-subtle">({translationName})</span>
        </p>
        <p className="text-sm text-ink-subtle">
          Click the passage and type what you see.
        </p>
      </div>

      <div className="relative focus-within:ring-2 focus-within:ring-accent-soft">
        <PracticeTypingSurface
          isComplete={isComplete}
          passage={passage}
          typedText={typedText}
          onTypingChange={onTypingChange}
        />

        {isComplete && (
          <div className="absolute inset-0 z-20 grid place-items-center overflow-y-auto bg-gradient-to-b from-canvas/80 via-canvas/35 to-canvas/80 px-4 py-4 text-center backdrop-blur-[2px]">
            <div className="grid w-full max-w-2xl justify-items-center gap-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">
                Complete
              </p>
              <p className="text-lg font-semibold text-ink">
                {completionMessage}
              </p>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-lg text-ink-muted">
                <p>
                  <strong className="font-semibold text-ink">{wpm}</strong> WPM
                </p>
                <p>
                  <strong className="font-semibold text-ink">{accuracy}%</strong> accuracy
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <PracticeReflectionDialog
                  key={passage.ref}
                  canSaveReflection={canSaveReflection}
                  isSavingReflection={isSavingReflection}
                  isSignedIn={isSignedIn}
                  reflectionError={reflectionError}
                  onSaveReflection={onSaveReflection}
                />
                {completionActionLabel && onCompletionAction && (
                  <Button variant="primary" onClick={onCompletionAction}>
                    <ArrowRightIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                    {completionActionLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
