import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import type { PracticeStatus } from "../../../shared/types/practice";
import { Button } from "../../../shared/ui/Button";

type TypingPracticePanelProps = {
  accuracy: number;
  canSaveReflection: boolean;
  completionActionLabel?: string;
  completionMessage: string;
  isComplete: boolean;
  isSavingReflection: boolean;
  isSignedIn: boolean;
  onCompletionAction?: () => void;
  onSaveReflection: (reflection: string) => Promise<boolean>;
  onTypingChange: (typedText: string) => void;
  progress: number;
  reflectionError: string | null;
  status: PracticeStatus;
  typedText: string;
  wpm: number;
};

/**
 * Typing input plus a quiet live-results summary.
 * This component is presentational; the parent owns timing, scoring, and selected text.
 */
export function TypingPracticePanel({
  accuracy,
  canSaveReflection,
  completionActionLabel,
  completionMessage,
  isComplete,
  isSavingReflection,
  isSignedIn,
  onCompletionAction,
  onSaveReflection,
  onTypingChange,
  progress,
  reflectionError,
  status,
  typedText,
  wpm,
}: TypingPracticePanelProps) {
  const [reflectionText, setReflectionText] = useState("");
  const [hasSavedReflection, setHasSavedReflection] = useState(false);
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    setReflectionText("");
    setHasSavedReflection(false);
    setIsReflectionOpen(false);
  }, [isComplete]);

  async function saveReflection() {
    const didSave = await onSaveReflection(reflectionText);
    if (didSave) setHasSavedReflection(true);
  }

  return (
    <section className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-base font-semibold text-ink">Type the passage</span>
        <textarea
          className="h-40 resize-none rounded-md border border-line-strong bg-surface p-4 text-ink leading-7 outline-none transition placeholder:text-ink-subtle focus:border-accent focus:ring-2 focus:ring-accent-soft"
          placeholder="Start typing here..."
          value={typedText}
          onChange={(event) => onTypingChange(event.target.value)}
        />
      </label>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-base text-ink-muted">
        <p>
          <strong className="font-semibold text-ink">{wpm}</strong> WPM
        </p>
        <p>
          <strong className="font-semibold text-ink">{accuracy}%</strong>{" "}
          accuracy
        </p>
        <p>
          <strong className="font-semibold text-ink">{progress}%</strong>{" "}
          complete
        </p>
        <p className="font-medium text-ink-subtle sm:ml-auto">{status}</p>
      </div>

      {isComplete && (
        <div className="grid gap-3 border-l-2 border-accent-line py-2 pl-4 text-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>{completionMessage}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                className="w-fit"
                variant="ghost"
                onClick={() => setIsReflectionOpen((currentValue) => !currentValue)}
              >
                {isReflectionOpen ? "Hide reflection" : "Add reflection"}
              </Button>
              {completionActionLabel && onCompletionAction && (
                <Button
                  className="w-fit"
                  variant="primary"
                  onClick={onCompletionAction}
                >
                  <ArrowRightIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                  {completionActionLabel}
                </Button>
              )}
            </div>
          </div>

          <div
            aria-hidden={!isReflectionOpen}
            className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out ${
              isReflectionOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0">
              <div className="grid gap-2 pt-2">
                <label className="grid gap-2">
                  <span className="font-semibold text-ink">What stood out to you?</span>
                  <textarea
                    className="min-h-24 resize-none rounded-md border border-line-strong bg-surface p-3 text-ink outline-none transition placeholder:text-ink-subtle focus:border-accent focus:ring-2 focus:ring-accent-soft disabled:bg-surface-muted disabled:text-ink-subtle"
                    disabled={!isSignedIn || hasSavedReflection}
                    placeholder={
                      isSignedIn
                        ? "Write a short reflection from this passage..."
                        : "Create an account to keep reflections with your practice history."
                    }
                    tabIndex={isReflectionOpen ? undefined : -1}
                    value={reflectionText}
                    onChange={(event) => {
                      setReflectionText(event.target.value);
                      setHasSavedReflection(false);
                    }}
                  />
                </label>

                {isSignedIn ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      className="w-fit"
                      disabled={
                        !canSaveReflection ||
                        !reflectionText.trim() ||
                        hasSavedReflection ||
                        isSavingReflection
                      }
                      tabIndex={isReflectionOpen ? undefined : -1}
                      variant="secondary"
                      onClick={saveReflection}
                    >
                      {isSavingReflection ? "Saving..." : hasSavedReflection ? "Saved" : "Save reflection"}
                    </Button>
                    {!canSaveReflection && (
                      <p className="text-sm text-ink-subtle">Saving your practice history...</p>
                    )}
                    {hasSavedReflection && (
                      <p className="text-sm font-medium text-accent-ink">Reflection saved.</p>
                    )}
                    {reflectionError && (
                      <p className="text-sm text-red-700 dark:text-red-300">{reflectionError}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-ink-muted">
                    Sign in or create an account to save reflections after practice.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
