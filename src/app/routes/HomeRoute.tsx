import { useNavigate } from 'react-router';
import { AppErrorState } from '../components/AppErrorState';
import { AppLoadingState } from '../components/AppLoadingState';
import { usePassageCategories } from '../hooks/usePassageCategories';
import { useAuth } from '../../features/auth/context/authContext';
import { useAuthMenu } from '../../features/auth/context/authMenuContext';
import { useFeaturedPassages } from '../../features/featured-passages/hooks/useFeaturedPassages';
import { getRandomFeaturedPassage } from '../../features/featured-passages/utils/featuredPassageSelection';
import { useSavedPassageCollection } from '../../features/saved-passages/hooks/useSavedPassageCollection';
import { HomePage } from '../../pages/home/HomePage';
import { APP_ROUTE_PATHS } from './appRoutePaths';
import { createPracticePath } from './practiceRouteState';

/**
 * Composes the feature data and navigation needed only by the Home page.
 */
export function HomeRoute() {
  const navigate = useNavigate();
  const authSession = useAuth();
  const { openSignUpMenu } = useAuthMenu();
  const featuredLibrary = useFeaturedPassages();
  const savedPassageCollection = useSavedPassageCollection(
    authSession.user?.id,
  );
  const { featuredHomeCategories } = usePassageCategories(
    featuredLibrary.passages,
  );

  if (featuredLibrary.isLoading) {
    return <AppLoadingState message="Loading featured passages..." />;
  }

  if (featuredLibrary.error) {
    return <AppErrorState message={featuredLibrary.error} />;
  }

  function startFeaturedPractice(category?: string) {
    const availablePassages = category
      ? featuredLibrary.passages.filter((passage) => passage.theme === category)
      : featuredLibrary.passages;
    const passage = getRandomFeaturedPassage(
      availablePassages,
      category ? '' : featuredLibrary.selectedPassageId,
    );

    if (!passage) return;

    void navigate(
      createPracticePath({
        passageId: passage.id,
        source: 'featured',
      }),
    );
  }

  return (
    <HomePage
      featuredHomeCategories={featuredHomeCategories}
      isSignedIn={authSession.isSignedIn}
      savedPassageCount={savedPassageCollection.savedPassages.length}
      onCreateAccount={openSignUpMenu}
      onOpenBible={() => void navigate(APP_ROUTE_PATHS.bible)}
      onSelectFeaturedCategory={startFeaturedPractice}
      onStartFeaturedPractice={() => startFeaturedPractice()}
    />
  );
}
