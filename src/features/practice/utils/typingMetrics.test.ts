import { describe, expect, it } from 'vitest';
import type { PracticePassage } from '../types/practice';
import {
  areCharactersEquivalent,
  calculatePracticeSessionMetrics,
  countCorrectCharacters,
  countNewTypingMistakes,
} from './typingMetrics';

function createPassage(text: string): PracticePassage {
  return {
    startVerse: 1,
    endVerse: 1,
    ref: 'Genesis 1:1',
    text,
    verses: [{ number: 1, text }],
  };
}

describe('typing-friendly character comparison', () => {
  it.each([
    ['’', "'"],
    ['“', '"'],
    ['—', '-'],
    ['\u00A0', ' '],
  ])('treats %s and %s as equivalent', (target, typed) => {
    expect(areCharactersEquivalent(target, typed)).toBe(true);
  });

  it('counts normalized punctuation as correct typing', () => {
    const target = 'God’s “word”—here';
    const typed = `God's "word"-here`;

    expect(countCorrectCharacters(target, typed)).toBe(target.length);
  });
});

describe('typing mistakes', () => {
  it('counts newly entered incorrect characters', () => {
    expect(countNewTypingMistakes('word', 'wo', 'wox')).toBe(1);
  });

  it('does not count deletions as new mistakes', () => {
    expect(countNewTypingMistakes('word', 'wox', 'wo')).toBe(0);
  });

  it('does not add another mistake when an incorrect character is corrected', () => {
    expect(countNewTypingMistakes('word', 'wox', 'wor')).toBe(0);
  });
});

describe('practice session metrics', () => {
  it('starts ready with full accuracy and no speed', () => {
    const metrics = calculatePracticeSessionMetrics({
      passage: createPassage('hello'),
      typedText: '',
      mistakeCount: 0,
      startedAt: null,
      finishedAt: null,
    });

    expect(metrics).toMatchObject({
      accuracy: 100,
      isPassageComplete: false,
      progress: 0,
      status: 'Ready',
      wpm: 0,
    });
  });

  it('calculates live progress, accuracy, and words per minute', () => {
    const metrics = calculatePracticeSessionMetrics({
      passage: createPassage('hello'),
      typedText: 'helxo',
      mistakeCount: 1,
      startedAt: 1_000,
      finishedAt: null,
      now: 61_000,
    });

    expect(metrics).toMatchObject({
      accuracy: 80,
      isPassageComplete: false,
      progress: 100,
      status: 'Typing',
      wpm: 1,
    });
  });

  it('keeps corrected mistakes in final accuracy', () => {
    const metrics = calculatePracticeSessionMetrics({
      passage: createPassage('hello'),
      typedText: 'hello',
      mistakeCount: 2,
      startedAt: 1_000,
      finishedAt: 61_000,
    });

    expect(metrics).toMatchObject({
      accuracy: 71,
      isPassageComplete: true,
      progress: 100,
      status: 'Complete',
      wpm: 1,
    });
  });

  it('caps progress at one hundred percent', () => {
    const metrics = calculatePracticeSessionMetrics({
      passage: createPassage('hello'),
      typedText: 'hello!',
      mistakeCount: 1,
      startedAt: 1_000,
      finishedAt: null,
      now: 61_000,
    });

    expect(metrics.progress).toBe(100);
    expect(metrics.isPassageComplete).toBe(false);
  });
});
