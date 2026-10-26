import type { PracticeSource } from '../../../features/practice/types/practice';
import type { PassageResponse } from '../../../types/passage';

export type PracticePassageSnapshot = {
  key: string;
  ownerId: string | null;
  source: PracticeSource;
  passageId: string;
  response: PassageResponse;
  headerTitle: string;
  headerSubtitle: string;
  headerReference: string;
  translationName: string;
};

export type PracticePassageTransitionState = {
  displayed: PracticePassageSnapshot | null;
  requestKey: string;
  isLoading: boolean;
  error: string | null;
};

export type PracticePassageTransitionEvent =
  | { type: 'requested'; key: string }
  | { type: 'loaded'; key: string; snapshot: PracticePassageSnapshot }
  | { type: 'failed'; key: string; error: string };

export const initialPracticePassageTransition: PracticePassageTransitionState =
  {
    displayed: null,
    requestKey: '',
    isLoading: true,
    error: null,
  };

export function practicePassageTransitionReducer(
  state: PracticePassageTransitionState,
  event: PracticePassageTransitionEvent,
): PracticePassageTransitionState {
  if (event.type === 'requested') {
    if (state.requestKey === event.key && state.isLoading) return state;

    // Keep the outgoing passage visible until its replacement is ready.
    return {
      ...state,
      requestKey: event.key,
      isLoading: true,
      error: null,
    };
  }

  if (event.key !== state.requestKey) return state;

  if (event.type === 'loaded') {
    if (event.snapshot.key !== event.key) return state;

    const currentDisplayed = state.displayed;
    const displayed =
      currentDisplayed?.key === event.key &&
      currentDisplayed.ownerId === event.snapshot.ownerId
        ? currentDisplayed
        : event.snapshot;

    if (
      !state.isLoading &&
      state.error === null &&
      state.displayed === displayed
    ) {
      return state;
    }

    return {
      displayed,
      requestKey: state.requestKey,
      isLoading: false,
      error: null,
    };
  }

  if (!state.isLoading && state.error === event.error) return state;

  return {
    ...state,
    isLoading: false,
    error: event.error,
  };
}
