import { useEffect, useRef } from "react";
import type { PracticePassage } from "../../../types/practice";
import { areCharactersEquivalent } from "../utils/typingMetrics";

type PracticePassageDisplayProps = {
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
  passage,
  translationName,
  typedText,
}: PracticePassageDisplayProps) {
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
      <p className="text-sm font-semibold text-ink-muted">
        {passage.ref} <span className="text-ink-subtle">({translationName})</span>
      </p>

      <div
        className="h-56 overflow-y-auto border-y border-line py-5 pr-4 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={viewportRef}
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
    </section>
  );
}
