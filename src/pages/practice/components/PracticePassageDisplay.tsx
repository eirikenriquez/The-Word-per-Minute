import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import type { PracticePassage } from "../../../shared/types/practice";
import { areCharactersEquivalent } from "../../../domain/practice/utils/typingMetrics";
import { Button } from "../../../shared/ui/Button";

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

type DisplayPart =
  | {
      key: string;
      kind: "verseNumber";
      verseNumber: number;
    }
  | {
      character: string;
      key: string;
      kind: "character";
      textIndex: number;
    };

/**
 * Chooses the highlight class for each displayed character.
 * It uses typing normalization so curly quotes and straight quotes score consistently.
 */
function getCharacterClass(targetCharacter: string, typedCharacter: string | undefined, isCurrent: boolean) {
  if (typedCharacter === undefined) {
    return isCurrent ? "bg-selected text-selected-ink" : "text-ink-subtle";
  }

  return areCharactersEquivalent(targetCharacter, typedCharacter)
    ? "bg-surface-muted text-ink"
    : "bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-100";
}

/**
 * Builds visible verse-number markers around the actual text characters.
 * Only text characters receive typing indexes, so verse numbers never need to be typed.
 */
function getDisplayParts(passage: PracticePassage) {
  let textIndex = 0;

  return passage.verses.flatMap((verse, verseIndex) => {
    const parts: DisplayPart[] = [
      {
        key: `verse-${verse.number}`,
        kind: "verseNumber" as const,
        verseNumber: verse.number,
      },
    ];

    if (verseIndex > 0) {
      parts.push({
        key: `space-before-${verse.number}`,
        kind: "character" as const,
        character: " ",
        textIndex: textIndex++,
      });
    }

    verse.text.split("").forEach((character) => {
      parts.push({
        key: `${verse.number}-${textIndex}`,
        kind: "character" as const,
        character,
        textIndex: textIndex++,
      });
    });

    return parts;
  });
}

/**
 * Shows a continuous passage in a fixed-height viewport that follows the active character.
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
  const [reflectionText, setReflectionText] = useState("");
  const [hasSavedReflection, setHasSavedReflection] = useState(false);
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const typingInputRef = useRef<HTMLTextAreaElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const activeCharacterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const activeCharacter = activeCharacterRef.current;

    if (!viewport || !activeCharacter) return;

    const activeMiddle = activeCharacter.offsetTop + activeCharacter.offsetHeight / 2;
    const nextScrollTop = activeMiddle - viewport.clientHeight / 2;

    viewport.scrollTo({
      behavior: typedText.length > 1 ? "smooth" : "auto",
      top: Math.max(0, nextScrollTop),
    });
  }, [passage.ref, typedText.length]);

  useEffect(() => {
    if (isComplete) return;

    setReflectionText("");
    setHasSavedReflection(false);
    setIsReflectionOpen(false);
  }, [isComplete, passage.ref]);

  async function saveReflection() {
    const didSave = await onSaveReflection(reflectionText);
    if (didSave) setHasSavedReflection(true);
  }

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
        <textarea
          aria-label="Type the passage"
          className="absolute inset-0 z-10 h-full w-full resize-none overflow-hidden bg-transparent text-transparent caret-transparent outline-none"
          disabled={isComplete}
          ref={typingInputRef}
          spellCheck={false}
          value={typedText}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          onChange={(event) => onTypingChange(event.target.value)}
        />
        <div
          className={`h-56 overflow-hidden border-y py-5 pr-4 scroll-smooth transition duration-200 ${
            isComplete
              ? "border-transparent opacity-30 blur-[1px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]"
              : "border-line"
          }`}
          ref={viewportRef}
          onClick={() => typingInputRef.current?.focus()}
        >
          <p className="relative text-xl leading-10 text-ink-muted sm:text-2xl sm:leading-[3rem]">
            {getDisplayParts(passage).map((part) =>
              part.kind === "verseNumber" ? (
                <sup className="mr-1 text-sm font-bold text-ink-subtle" key={part.key}>
                  {part.verseNumber}
                </sup>
              ) : (
                <span
                  className={getCharacterClass(
                    part.character,
                    typedText[part.textIndex],
                    part.textIndex === typedText.length,
                  )}
                  key={part.key}
                  ref={part.textIndex === typedText.length ? activeCharacterRef : undefined}
                >
                  {part.character}
                </span>
              ),
            )}
          </p>
        </div>

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
                <Button
                  aria-expanded={isReflectionOpen}
                  variant="ghost"
                  onClick={() => setIsReflectionOpen((currentValue) => !currentValue)}
                >
                  {isReflectionOpen ? "Hide reflection" : "Add reflection"}
                </Button>
                {completionActionLabel && onCompletionAction && (
                  <Button variant="primary" onClick={onCompletionAction}>
                    <ArrowRightIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                    {completionActionLabel}
                  </Button>
                )}
              </div>

              <div
                aria-hidden={!isReflectionOpen}
                className={`grid w-full overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out ${
                  isReflectionOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0">
                  <div className="grid gap-2 pt-1 text-left">
                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-ink">What stood out to you?</span>
                      <textarea
                        className="h-20 resize-none rounded-md border border-line-strong bg-surface/95 p-3 text-sm text-ink outline-none transition placeholder:text-ink-subtle focus:border-accent focus:ring-2 focus:ring-accent-soft disabled:bg-surface-muted disabled:text-ink-subtle"
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
          </div>
        )}
      </div>
    </section>
  );
}
