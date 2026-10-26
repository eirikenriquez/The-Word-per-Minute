import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

type PracticeCaretProps = {
  activeCharacterRef: RefObject<HTMLSpanElement | null>;
  currentIndex: number;
  isVisible: boolean;
  passageRef: string;
  textRef: RefObject<HTMLParagraphElement | null>;
  typedText: string;
};

type CaretPosition = {
  height: number;
  shouldAnimate: boolean;
  x: number;
  y: number;
};

/** A single caret that follows the active character and blinks only while idle. */
export function PracticeCaret({
  activeCharacterRef,
  currentIndex,
  isVisible,
  passageRef,
  textRef,
  typedText,
}: PracticeCaretProps) {
  const [position, setPosition] = useState<CaretPosition | null>(null);
  const [isIdle, setIsIdle] = useState(false);
  const wasVisibleRef = useRef(false);

  const updatePosition = useCallback(
    (animate: boolean) => {
      const character = activeCharacterRef.current;
      const text = textRef.current;
      if (!character || !text) return;

      const characterBounds = character.getBoundingClientRect();
      const textBounds = text.getBoundingClientRect();
      const x = characterBounds.left - textBounds.left;
      const y = characterBounds.top - textBounds.top;
      const height = characterBounds.height;

      setPosition((previous) => {
        const shouldAnimate =
          animate && previous !== null && Math.abs(previous.y - y) < 1;

        if (
          previous?.x === x &&
          previous.y === y &&
          previous.height === height &&
          previous.shouldAnimate === shouldAnimate
        ) {
          return previous;
        }

        return { height, shouldAnimate, x, y };
      });
    },
    [activeCharacterRef, textRef],
  );

  useLayoutEffect(() => {
    updatePosition(isVisible && wasVisibleRef.current);
    wasVisibleRef.current = isVisible;
  }, [currentIndex, isVisible, passageRef, typedText, updatePosition]);

  useLayoutEffect(() => {
    const text = textRef.current;
    if (!text) return;

    const observer = new ResizeObserver(() => updatePosition(false));
    observer.observe(text);

    let isCurrent = true;
    void document.fonts.ready.then(() => {
      if (isCurrent) updatePosition(false);
    });

    return () => {
      isCurrent = false;
      observer.disconnect();
    };
  }, [textRef, updatePosition]);

  useEffect(() => {
    setIsIdle(false);
    if (!isVisible) return;

    const timeout = window.setTimeout(() => setIsIdle(true), 600);
    return () => window.clearTimeout(timeout);
  }, [currentIndex, isVisible, passageRef, typedText]);

  return (
    <span
      aria-hidden="true"
      className="practice-caret pointer-events-none absolute left-0 top-0 w-0.5 bg-practice-caret"
      data-idle={isIdle}
      hidden={!isVisible || !position}
      style={
        position
          ? {
              height: position.height,
              transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
              transitionDuration: position.shouldAnimate ? '80ms' : '0ms',
            }
          : undefined
      }
    />
  );
}
