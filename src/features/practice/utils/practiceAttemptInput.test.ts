import { describe, expect, it } from 'vitest';
import type { PassageResponse } from '../../../types/passage';
import type { PracticeCompletionResult } from '../types/practice';
import { createPracticeAttemptInput } from './practiceAttemptInput';

const completionResult: PracticeCompletionResult = {
  accuracy: 96,
  durationSeconds: 42,
  mistakeCount: 3,
  typedCharacterCount: 120,
  wpm: 58,
};

const passageResponse: PassageResponse = {
  bookName: 'Psalms',
  chapter: {
    chapter: 4,
    verses: [
      {
        number: 8,
        text: 'In peace I will both lay myself down and sleep.',
      },
    ],
  },
  passage: {
    bookId: 'Ps',
    chapter: 4,
    endVerse: 8,
    selectedVerses: [8],
    startVerse: 8,
    theme: 'Peace & Comfort',
    title: 'Rest in Safety',
    translationId: 'web',
  },
  reference: 'Psalm 4:8',
  translation: {
    abbreviation: 'WEB',
    id: 'web',
    language: 'English',
    license: 'Public domain',
    name: 'World English Bible',
    source: 'Local',
  },
  verses: [
    {
      number: 8,
      text: 'In peace I will both lay myself down and sleep.',
    },
  ],
};

describe('createPracticeAttemptInput', () => {
  it('creates a featured-passage attempt', () => {
    expect(
      createPracticeAttemptInput({
        completionResult,
        featuredPassageId: 'rest-in-safety',
        passageResponse,
        practiceSource: 'featured',
        savedPassageId: 'saved-passage-id',
      }),
    ).toEqual({
      accuracy: 96,
      bookId: 'Ps',
      chapter: 4,
      durationSeconds: 42,
      endVerse: 8,
      featuredPassageId: 'rest-in-safety',
      mistakeCount: 3,
      passageReference: 'Psalm 4:8',
      savedPassageId: undefined,
      selectedVerses: [8],
      startVerse: 8,
      translationId: 'web',
      typedCharacterCount: 120,
      wpm: 58,
    });
  });

  it('creates a saved-passage attempt', () => {
    expect(
      createPracticeAttemptInput({
        completionResult,
        featuredPassageId: 'rest-in-safety',
        passageResponse,
        practiceSource: 'saved',
        savedPassageId: 'saved-passage-id',
      }),
    ).toMatchObject({
      featuredPassageId: undefined,
      savedPassageId: 'saved-passage-id',
    });
  });

  it('returns no attempt without an active passage', () => {
    expect(
      createPracticeAttemptInput({
        completionResult,
        featuredPassageId: 'rest-in-safety',
        passageResponse: null,
        practiceSource: 'featured',
        savedPassageId: '',
      }),
    ).toBeNull();
  });
});
