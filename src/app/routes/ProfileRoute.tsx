import { useAuth } from '../../features/auth/context/authContext';
import { usePracticeAttemptHistory } from '../../features/practice/hooks/usePracticeAttemptHistory';
import { ProfilePage } from '../../pages/profile/ProfilePage';

/**
 * Composes account and practice-history data needed only by the Profile page.
 */
export function ProfileRoute() {
  const authSession = useAuth();
  const practiceHistory = usePracticeAttemptHistory(authSession.user?.id);

  return (
    <ProfilePage
      hasMoreRecentAttempts={practiceHistory.hasMoreAttempts}
      isLoadingMoreRecentAttempts={practiceHistory.isLoadingMore}
      isLoadingPracticeSummary={practiceHistory.isLoadingSummary}
      isLoadingRecentAttempts={practiceHistory.isLoading}
      isSignedIn={authSession.isSignedIn}
      practiceSummary={practiceHistory.summary}
      practiceSummaryError={practiceHistory.summaryError}
      recentAttemptsError={practiceHistory.historyError}
      recentAttemptsLoadMoreError={practiceHistory.loadMoreError}
      recentPracticeAttempts={practiceHistory.recentAttempts}
      userEmail={authSession.user?.email}
      onLoadMoreRecentAttempts={practiceHistory.loadMoreAttempts}
    />
  );
}
