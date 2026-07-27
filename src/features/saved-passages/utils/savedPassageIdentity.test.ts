import { describe, expect, it } from 'vitest';
import type { SavePassageInput } from '../types/savedPassage';
import { getSavedPassageIdentity } from './savedPassageIdentity';

function createSaveInput(
  overrides: Partial<SavePassageInput> = {},
): SavePassageInput {
  return {
    title: 'Genesis 1:1-3',
    category: 'Memorise',
    theme: 'Bible reader',
    reference: 'Genesis 1:1-3',
    translationId: 'web',
    translationAbbreviation: 'WEB',
    bookId: 'Gen',
    bookName: 'Genesis',
    chapter: 1,
    startVerse: 1,
    endVerse: 3,
    source: 'bible',
    ...overrides,
  };
}

describe('getSavedPassageIdentity', () => {
  it('returns the same identity for the same passage metadata', () => {
    const firstIdentity = getSavedPassageIdentity(createSaveInput());
    const secondIdentity = getSavedPassageIdentity(
      createSaveInput({ title: 'A different personal title' }),
    );

    expect(firstIdentity).toBe(secondIdentity);
  });

  it('distinguishes a whole range from an explicit verse selection', () => {
    const wholeRangeIdentity = getSavedPassageIdentity(createSaveInput());
    const selectedVersesIdentity = getSavedPassageIdentity(
      createSaveInput({
        theme: 'Selected verses',
        selectedVerses: [1, 2, 3],
      }),
    );

    expect(wholeRangeIdentity).not.toBe(selectedVersesIdentity);
  });

  it('includes translation and passage location in the identity', () => {
    expect(getSavedPassageIdentity(createSaveInput())).toBe('web:Gen:1:1:3');
    expect(
      getSavedPassageIdentity(createSaveInput({ selectedVerses: [1, 3] })),
    ).toBe('web:Gen:1:1,3:selected');
  });
});
