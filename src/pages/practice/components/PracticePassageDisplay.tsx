import { useEffect, useRef } from "react";
import type { PracticePassage } from "../../../shared/types/practice";
import { areCharactersEquivalent } from "../../../domain/practice/utils/typingMetrics";

type PracticePassageDisplayProps = {
  isComplete: boolean;
  onTypingChange: (typedText: string) => void;
  passage: PracticePassage;
  translationName: string;
  typedText: string;
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
  isComplete,
  onTypingChange,
  passage,
  translationName,
  typedText,
}: PracticePassageDisplayProps) {
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
          className="h-56 overflow-hidden border-y border-line py-5 pr-4 scroll-smooth"
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
      </div>
    </section>
  );
}
