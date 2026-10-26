import { describe, expect, it } from 'vitest';
import type { PassageResponse } from '../../../types/passage';
import {
  initialPracticePassageTransition,
  practicePassageTransitionReducer,
  type PracticePassageSnapshot,
} from './practicePassageTransition';

function snapshot(
  key: string,
  passageId = key,
  ownerId: string | null = null,
): PracticePassageSnapshot {
  return {
    key,
    ownerId,
    source: 'featured',
    passageId,
    response: { reference: `Reference ${passageId}` } as PassageResponse,
    headerTitle: `Title ${passageId}`,
    headerSubtitle: `Subtitle ${passageId}`,
    headerReference: `Reference ${passageId}`,
    translationName: `Translation ${passageId}`,
  };
}

function showSnapshot(value: PracticePassageSnapshot) {
  return practicePassageTransitionReducer(
    {
      ...initialPracticePassageTransition,
      requestKey: value.key,
    },
    { type: 'loaded', key: value.key, snapshot: value },
  );
}

describe('Practice passage transition reducer', () => {
  it('starts with no displayed passage and a pending initial request', () => {
    expect(initialPracticePassageTransition).toEqual({
      displayed: null,
      requestKey: '',
      isLoading: true,
      error: null,
    });
  });

  it('commits the first loaded snapshot', () => {
    const nextSnapshot = snapshot('featured:one');
    const state = practicePassageTransitionReducer(
      initialPracticePassageTransition,
      { type: 'requested', key: nextSnapshot.key },
    );

    expect(
      practicePassageTransitionReducer(state, {
        type: 'loaded',
        key: nextSnapshot.key,
        snapshot: nextSnapshot,
      }),
    ).toEqual({
      displayed: nextSnapshot,
      requestKey: nextSnapshot.key,
      isLoading: false,
      error: null,
    });
  });

  it('retains the outgoing snapshot while another passage is requested', () => {
    const displayed = snapshot('featured:one');
    const current = showSnapshot(displayed);

    const next = practicePassageTransitionReducer(current, {
      type: 'requested',
      key: 'featured:two',
    });

    expect(next).toEqual({
      displayed,
      requestKey: 'featured:two',
      isLoading: true,
      error: null,
    });
  });

  it('commits passage content and identity together after loading', () => {
    const outgoing = snapshot('featured:one');
    const incoming = {
      ...snapshot('saved:two', 'saved-two', 'user-2'),
      source: 'saved' as const,
      headerTitle: 'New saved title',
      headerReference: 'New reference',
      translationName: 'NWEB',
    };
    const pending = practicePassageTransitionReducer(showSnapshot(outgoing), {
      type: 'requested',
      key: incoming.key,
    });

    const loaded = practicePassageTransitionReducer(pending, {
      type: 'loaded',
      key: incoming.key,
      snapshot: incoming,
    });

    expect(loaded.displayed).toEqual(incoming);
    expect(loaded.displayed?.passageId).toBe('saved-two');
    expect(loaded.displayed?.source).toBe('saved');
    expect(loaded.displayed?.headerTitle).toBe('New saved title');
    expect(loaded.displayed?.response).toBe(incoming.response);
    expect(loaded.isLoading).toBe(false);
    expect(loaded.error).toBeNull();
  });

  it('keeps the outgoing snapshot visible after a local load failure', () => {
    const displayed = snapshot('featured:one');
    const pending = practicePassageTransitionReducer(showSnapshot(displayed), {
      type: 'requested',
      key: 'featured:two',
    });

    expect(
      practicePassageTransitionReducer(pending, {
        type: 'failed',
        key: 'featured:two',
        error: 'Passage unavailable',
      }),
    ).toEqual({
      displayed,
      requestKey: 'featured:two',
      isLoading: false,
      error: 'Passage unavailable',
    });
  });

  it('clears a failure when retrying the same settled key', () => {
    const displayed = snapshot('featured:one');
    const failed = practicePassageTransitionReducer(
      practicePassageTransitionReducer(showSnapshot(displayed), {
        type: 'requested',
        key: 'featured:two',
      }),
      {
        type: 'failed',
        key: 'featured:two',
        error: 'Passage unavailable',
      },
    );

    const retried = practicePassageTransitionReducer(failed, {
      type: 'requested',
      key: 'featured:two',
    });

    expect(retried).toEqual({
      displayed,
      requestKey: 'featured:two',
      isLoading: true,
      error: null,
    });
    expect(
      practicePassageTransitionReducer(retried, {
        type: 'requested',
        key: 'featured:two',
      }),
    ).toBe(retried);
  });

  it('ignores stale successes and failures after a newer request', () => {
    const pending = practicePassageTransitionReducer(
      practicePassageTransitionReducer(initialPracticePassageTransition, {
        type: 'requested',
        key: 'featured:one',
      }),
      { type: 'requested', key: 'featured:two' },
    );

    expect(
      practicePassageTransitionReducer(pending, {
        type: 'loaded',
        key: 'featured:one',
        snapshot: snapshot('featured:one'),
      }),
    ).toBe(pending);
    expect(
      practicePassageTransitionReducer(pending, {
        type: 'failed',
        key: 'featured:one',
        error: 'Stale failure',
      }),
    ).toBe(pending);
  });

  it('preserves the displayed session when browser back targets it during loading', () => {
    const displayed = snapshot('featured:one');
    const pendingOther = practicePassageTransitionReducer(
      showSnapshot(displayed),
      {
        type: 'requested',
        key: 'featured:two',
      },
    );
    const backToDisplayed = practicePassageTransitionReducer(pendingOther, {
      type: 'requested',
      key: displayed.key,
    });

    expect(backToDisplayed.displayed).toBe(displayed);
    expect(backToDisplayed.requestKey).toBe(displayed.key);
    expect(backToDisplayed.isLoading).toBe(true);

    const refreshed = practicePassageTransitionReducer(backToDisplayed, {
      type: 'loaded',
      key: displayed.key,
      snapshot: { ...displayed, headerTitle: 'Updated title' },
    });

    expect(refreshed.displayed).toBe(displayed);
    expect(refreshed.isLoading).toBe(false);
  });

  it('does not replace an identical settled result on repeated events', () => {
    const displayed = snapshot('featured:one');
    const settled = showSnapshot(displayed);
    const failed = practicePassageTransitionReducer(settled, {
      type: 'failed',
      key: displayed.key,
      error: 'Repeated failure',
    });

    expect(
      practicePassageTransitionReducer(settled, {
        type: 'loaded',
        key: displayed.key,
        snapshot: { ...displayed },
      }),
    ).toBe(settled);
    expect(
      practicePassageTransitionReducer(failed, {
        type: 'failed',
        key: displayed.key,
        error: 'Repeated failure',
      }),
    ).toBe(failed);
  });
});
