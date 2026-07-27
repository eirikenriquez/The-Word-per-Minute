import { useAuth } from '../../features/auth/context/authContext';
import { usePracticeAttempts } from '../../features/practice/hooks/usePracticeAttempts';
import { ProfilePage } from '../../pages/profile/ProfilePage';

/**
 * Composes account and practice-history data needed only by the Profile page.
 */
export function ProfileRoute() {
  const authSession = useAuth();
  const practiceAttempts = usePracticeAttempts(authSession.user?.id);

  return (
    <ProfilePage
      hasMoreRecentAttempts={practiceAttempts.hasMoreAttempts}
      isLoadingMoreRecentAttempts={practiceAttempts.isLoadingMore}
      isLoadingPracticeSummary={practiceAttempts.isLoadingSummary}
      isLoadingRecentAttempts={practiceAttempts.isLoading}
      isSignedIn={authSession.isSignedIn}
      practiceSummary={practiceAttempts.summary}
      practiceSummaryError={practiceAttempts.summaryError}
      recentAttemptsError={practiceAttempts.historyError}
      recentAttemptsLoadMoreError={practiceAttempts.loadMoreError}
      recentPracticeAttempts={practiceAttempts.recentAttempts}
      userEmail={authSession.user?.email}
      onLoadMoreRecentAttempts={practiceAttempts.loadMoreAttempts}
    />
  );
}
