import { Transition } from '@headlessui/react';
import { ArrowPathIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import type { PracticePassage } from '../types/practice';
import { PracticeReflectionDialog } from './PracticeReflectionDialog';
import { PracticeTypingSurface } from './PracticeTypingSurface';

type PracticePassageDisplayProps = {
  focusRequestId: number;
  accuracy: number;
  attemptSaveError: string | null;
  canSaveReflection: boolean;
  completionActionLabel?: string;
  completionMessage: string;
  isComplete: boolean;
  isSavingReflection: boolean;
  isSignedIn: boolean;
  isPassageLoading: boolean;
  passageLoadError: string | null;
  onRetryPassage: () => void;
  onRestart: () => void;
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
  focusRequestId,
  accuracy,
  attemptSaveError,
  canSaveReflection,
  completionActionLabel,
  completionMessage,
  isComplete,
  isSavingReflection,
  isSignedIn,
  isPassageLoading,
  passageLoadError,
  onRetryPassage,
  onRestart,
  onTypingChange,
  onCompletionAction,
  onSaveReflection,
  passage,
  reflectionError,
  translationName,
  typedText,
  wpm,
}: PracticePassageDisplayProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const wasCompleteRef = useRef(false);
  const isPassageUnavailable = isPassageLoading || Boolean(passageLoadError);
  const attemptSaveErrorMessage = attemptSaveError
    ? "This attempt couldn't be saved to your history, so a reflection can't be attached."
    : null;

  useEffect(() => {
    const justCompleted = isComplete && !wasCompleteRef.current;
    wasCompleteRef.current = isComplete;
    if (!justCompleted || isPassageUnavailable) return;

    // Hand off from the disabled typing input without interrupting another control.
    const active = document.activeElement;
    if (
      document.querySelector(
        '[role="dialog"][aria-modal="true"], [role="menu"]',
      ) ||
      (active &&
        active !== document.body &&
        !sectionRef.current?.contains(active))
    )
      return;
    restartButtonRef.current?.focus({ preventScroll: true });
  }, [isComplete, isPassageUnavailable]);

  return (
    <section className="grid gap-4" ref={sectionRef}>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-ink-muted">
          {passage.ref}{' '}
          <span className="text-ink-subtle">({translationName})</span>
        </p>
        <p className="text-sm text-ink-subtle">Type what you see.</p>
      </div>

      <div
        aria-busy={isPassageLoading}
        className="relative focus-within:ring-2 focus-within:ring-accent-soft"
      >
        <PracticeTypingSurface
          focusRequestId={focusRequestId}
          isComplete={isComplete && !isPassageUnavailable}
          isDisabled={isPassageUnavailable}
          passage={passage}
          typedText={typedText}
          onTypingChange={onTypingChange}
        />

        {isPassageUnavailable && (
          <div className="absolute inset-0 z-30 grid place-items-center px-4 py-4 text-center">
            <div className="grid max-w-sm justify-items-center gap-3 rounded-md border border-line bg-canvas/95 px-5 py-4">
              {passageLoadError ? (
                <>
                  <p className="text-sm text-ink" role="alert">
                    Couldn't load this passage. Your previous passage is still
                    here.
                  </p>
                  <Button variant="secondary" onClick={onRetryPassage}>
                    Try again
                  </Button>
                </>
              ) : (
                <p className="text-sm text-ink-muted" role="status">
                  Loading next passage…
                </p>
              )}
            </div>
          </div>
        )}

        <Transition
          key={`${passage.ref}:${completionMessage}`}
          as="div"
          className="absolute inset-0 z-20 grid place-items-center overflow-y-auto bg-gradient-to-b from-canvas/80 via-canvas/35 to-canvas/80 px-4 py-4 text-center backdrop-blur-[2px]"
          enter="transition-opacity duration-500 ease-out motion-reduce:transition-none"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150 ease-in motion-reduce:transition-none"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          show={isComplete && !isPassageUnavailable}
        >
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
                <strong className="font-semibold text-ink">{accuracy}%</strong>{' '}
                accuracy
              </p>
            </div>

            {attemptSaveErrorMessage && (
              <p
                className="text-sm text-red-700 dark:text-red-300"
                role="alert"
              >
                {attemptSaveErrorMessage}
              </p>
            )}
          </div>
        </Transition>
      </div>

      <fieldset
        aria-label="Practice actions"
        className="flex min-w-0 flex-wrap items-center justify-between gap-3"
        disabled={isPassageUnavailable}
      >
        <div className="flex flex-wrap gap-2">
          <Button ref={restartButtonRef} variant="ghost" onClick={onRestart}>
            <ArrowPathIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
            Restart
          </Button>
          {isComplete && !isPassageUnavailable && (
            <>
              {completionActionLabel && onCompletionAction && (
                <Button variant="primary" onClick={onCompletionAction}>
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0"
                  />
                  {completionActionLabel}
                </Button>
              )}
              <PracticeReflectionDialog
                key={passage.ref}
                attemptSaveErrorMessage={attemptSaveErrorMessage}
                canSaveReflection={canSaveReflection}
                isSavingReflection={isSavingReflection}
                isSignedIn={isSignedIn}
                reflectionError={reflectionError}
                onSaveReflection={onSaveReflection}
              />
            </>
          )}
        </div>
        <p className="text-xs text-ink-subtle">
          {!isComplete && (
            <>
              <kbd className="font-sans">Tab</kbd> then{' '}
            </>
          )}
          <kbd className="font-sans">Enter</kbd> to restart
        </p>
      </fieldset>
    </section>
  );
}
