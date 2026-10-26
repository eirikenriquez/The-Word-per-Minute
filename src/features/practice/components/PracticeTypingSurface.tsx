import { useEffect, useRef, useState } from 'react';
import type { PracticePassage } from '../types/practice';
import { areCharactersEquivalent } from '../utils/typingMetrics';

type PracticeTypingSurfaceProps = {
  isComplete: boolean;
  onTypingChange: (typedText: string) => void;
  passage: PracticePassage;
  typedText: string;
};

type DisplayPart =
  | {
      key: string;
      kind: 'verseNumber';
      verseNumber: number;
    }
  | {
      character: string;
      key: string;
      kind: 'character';
      textIndex: number;
    };

const caretClass =
  'before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-practice-caret';

/**
 * Chooses the highlight class for each displayed character.
 * It uses typing normalization so curly quotes and straight quotes score consistently.
 */
function getCharacterClass(
  targetCharacter: string,
  typedCharacter: string | undefined,
) {
  if (typedCharacter === undefined) {
    return 'text-ink-subtle';
  }

  return areCharactersEquivalent(targetCharacter, typedCharacter)
    ? 'text-ink'
    : 'bg-practice-error-surface text-practice-error underline decoration-2 underline-offset-4';
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
        kind: 'verseNumber' as const,
        verseNumber: verse.number,
      },
    ];

    if (verseIndex > 0) {
      parts.push({
        key: `space-before-${verse.number}`,
        kind: 'character' as const,
        character: ' ',
        textIndex: textIndex++,
      });
    }

    verse.text.split('').forEach((character) => {
      parts.push({
        key: `${verse.number}-${textIndex}`,
        kind: 'character' as const,
        character,
        textIndex: textIndex++,
      });
    });

    return parts;
  });
}

/**
 * Owns the invisible typing input and the fixed-height passage viewport that follows it.
 */
export function PracticeTypingSurface({
  isComplete,
  onTypingChange,
  passage,
  typedText,
}: PracticeTypingSurfaceProps) {
  const typingInputRef = useRef<HTMLTextAreaElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const activeCharacterRef = useRef<HTMLSpanElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [caretPosition, setCaretPosition] = useState(0);
  const currentIndex = Math.min(caretPosition, typedText.length);
  const showCaret = isFocused && !isComplete;

  useEffect(() => {
    const viewport = viewportRef.current;
    const activeCharacter = activeCharacterRef.current;

    if (!viewport || !activeCharacter) return;

    const activeMiddle =
      activeCharacter.offsetTop + activeCharacter.offsetHeight / 2;
    const nextScrollTop = activeMiddle - viewport.clientHeight / 2;

    viewport.scrollTo({
      behavior: typedText.length > 1 ? 'smooth' : 'auto',
      top: Math.max(0, nextScrollTop),
    });
  }, [currentIndex, passage.ref, typedText.length]);

  return (
    <>
      <textarea
        aria-label="Type the passage"
        className="absolute inset-0 z-10 h-full w-full resize-none select-none overflow-hidden opacity-0"
        disabled={isComplete}
        ref={typingInputRef}
        spellCheck={false}
        value={typedText}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        onBlur={() => setIsFocused(false)}
        onChange={(event) => {
          setCaretPosition(event.currentTarget.selectionEnd);
          onTypingChange(event.currentTarget.value);
        }}
        onFocus={(event) => {
          setIsFocused(true);
          setCaretPosition(event.currentTarget.selectionEnd);
        }}
        onKeyDown={(event) => {
          if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === 'a'
          ) {
            event.preventDefault();
          }
        }}
        onSelect={(event) => {
          const input = event.currentTarget;
          const position =
            input.selectionDirection === 'backward'
              ? input.selectionStart
              : input.selectionEnd;

          if (input.selectionStart !== input.selectionEnd) {
            input.setSelectionRange(position, position);
          }
          setCaretPosition(position);
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;

          // Clicking starts/resumes typing at the end without drag-selection.
          event.preventDefault();
          const input = event.currentTarget;
          input.focus({ preventScroll: true });
          input.setSelectionRange(input.value.length, input.value.length);
        }}
      />
      <div
        className={`h-56 select-none overflow-hidden border-y py-5 pr-4 scroll-smooth transition-[border-color,filter,opacity] duration-500 ease-out ${
          isComplete
            ? 'border-transparent opacity-30 blur-[1px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]'
            : 'border-line'
        }`}
        ref={viewportRef}
        onClick={() => typingInputRef.current?.focus()}
      >
        <p className="relative text-xl leading-10 text-ink-muted sm:text-2xl sm:leading-[3rem]">
          {getDisplayParts(passage).map((part) =>
            part.kind === 'verseNumber' ? (
              <sup
                className="mr-1 text-sm font-bold text-ink-subtle"
                key={part.key}
              >
                {part.verseNumber}
              </sup>
            ) : (
              <span
                className={`relative ${getCharacterClass(
                  part.character,
                  typedText[part.textIndex],
                )} ${showCaret && part.textIndex === currentIndex ? caretClass : ''}`}
                key={part.key}
                ref={
                  part.textIndex === currentIndex
                    ? activeCharacterRef
                    : undefined
                }
              >
                {part.character}
              </span>
            ),
          )}
          <span
            aria-hidden="true"
            className={`relative ${showCaret && currentIndex === passage.text.length ? caretClass : ''}`}
            ref={
              currentIndex === passage.text.length
                ? activeCharacterRef
                : undefined
            }
          >
            {'\u200b'}
          </span>
        </p>
      </div>
    </>
  );
}
