import { describe, expect, it } from 'vitest';
import {
  createPracticePath,
  readPracticeRouteState,
  resolvePracticeRouteState,
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

  it('keeps a valid passage requested by the URL', () => {
    expect(
      resolvePracticeRouteState({
        featuredPassageIds: ['featured-one', 'featured-two'],
        isSavedPassageListLoading: false,
        routeState: {
          passageId: 'featured-two',
          source: 'featured',
        },
        savedPassageIds: [],
        selectedFeaturedPassageId: 'featured-one',
        selectedSavedPassageId: '',
      }),
    ).toEqual({
      passageId: 'featured-two',
      source: 'featured',
    });
  });

  it('replaces an invalid passage with the current feature selection', () => {
    expect(
      resolvePracticeRouteState({
        featuredPassageIds: ['featured-one', 'featured-two'],
        isSavedPassageListLoading: false,
        routeState: {
          passageId: 'missing-passage',
          source: 'featured',
        },
        savedPassageIds: [],
        selectedFeaturedPassageId: 'featured-two',
        selectedSavedPassageId: '',
      }),
    ).toEqual({
      passageId: 'featured-two',
      source: 'featured',
    });
  });

  it('waits for the saved-passage list before falling back', () => {
    expect(
      resolvePracticeRouteState({
        featuredPassageIds: ['featured-one'],
        isSavedPassageListLoading: true,
        routeState: {
          passageId: 'saved-one',
          source: 'saved',
        },
        savedPassageIds: [],
        selectedFeaturedPassageId: 'featured-one',
        selectedSavedPassageId: '',
      }),
    ).toBeNull();
  });

  it('keeps a valid saved-passage selection', () => {
    expect(
      resolvePracticeRouteState({
        featuredPassageIds: ['featured-one'],
        isSavedPassageListLoading: false,
        routeState: {
          passageId: 'saved-two',
          source: 'saved',
        },
        savedPassageIds: ['saved-one', 'saved-two'],
        selectedFeaturedPassageId: 'featured-one',
        selectedSavedPassageId: 'saved-one',
      }),
    ).toEqual({
      passageId: 'saved-two',
      source: 'saved',
    });
  });

  it('falls back to featured when there are no saved passages', () => {
    expect(
      resolvePracticeRouteState({
        featuredPassageIds: ['featured-one'],
        isSavedPassageListLoading: false,
        routeState: {
          passageId: null,
          source: 'saved',
        },
        savedPassageIds: [],
        selectedFeaturedPassageId: 'featured-one',
        selectedSavedPassageId: '',
      }),
    ).toEqual({
      passageId: 'featured-one',
      source: 'featured',
    });
  });
});
