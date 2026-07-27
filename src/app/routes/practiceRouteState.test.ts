import { describe, expect, it } from 'vitest';
import {
  createPracticePath,
  readPracticeRouteState,
} from './practiceRouteState';

describe('Practice route state', () => {
  it('uses the featured source when URL state is missing', () => {
    expect(readPracticeRouteState(new URLSearchParams())).toEqual({
      passageId: null,
      source: 'featured',
    });
  });

  it('reads a saved passage selection', () => {
    const searchParams = new URLSearchParams({
      passage: 'saved-passage-id',
      source: 'saved',
    });

    expect(readPracticeRouteState(searchParams)).toEqual({
      passageId: 'saved-passage-id',
      source: 'saved',
    });
  });

  it('falls back to featured for an unsupported source', () => {
    const searchParams = new URLSearchParams({
      passage: 'featured-passage-id',
      source: 'unknown',
    });

    expect(readPracticeRouteState(searchParams)).toEqual({
      passageId: 'featured-passage-id',
      source: 'featured',
    });
  });

  it('ignores an empty passage id', () => {
    const searchParams = new URLSearchParams({
      passage: '   ',
      source: 'saved',
    });

    expect(readPracticeRouteState(searchParams)).toEqual({
      passageId: null,
      source: 'saved',
    });
  });

  it('creates a canonical Practice URL', () => {
    expect(
      createPracticePath({
        passageId: 'featured-passage-id',
        source: 'featured',
      }),
    ).toBe('/practice?source=featured&passage=featured-passage-id');
  });

  it('omits a missing passage and encodes a provided passage id', () => {
    expect(
      createPracticePath({
        passageId: null,
        source: 'saved',
      }),
    ).toBe('/practice?source=saved');

    expect(
      createPracticePath({
        passageId: 'love & grace',
        source: 'featured',
      }),
    ).toBe('/practice?source=featured&passage=love+%26+grace');
  });
});
