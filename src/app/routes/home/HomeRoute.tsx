import { useNavigate } from 'react-router';
import { AppErrorState } from '../../components/AppErrorState';
import { AppLoadingState } from '../../components/AppLoadingState';
import { usePassageCategories } from '../../hooks/usePassageCategories';
import { useAuth } from '../../../features/auth/context/authContext';
import { useAuthMenu } from '../../../features/auth/context/authMenuContext';
import { useFeaturedPassageCatalog } from '../../../features/featured-passages/hooks/useFeaturedPassageCatalog';
import { getRandomFeaturedPassage } from '../../../features/featured-passages/utils/featuredPassageSelection';
import { useSavedPassageCollection } from '../../../features/saved-passages/hooks/useSavedPassageCollection';
import { APP_ROUTE_PATHS } from '../appRoutePaths';
import { createPracticePath } from '../practiceRouteState';
import { HomePage } from './HomePage';

/**
 * Composes the feature data and navigation needed only by the Home page.
 */
export function HomeRoute() {
  const navigate = useNavigate();
  const authSession = useAuth();
  const { openSignUpMenu } = useAuthMenu();
  const featuredCatalog = useFeaturedPassageCatalog();
  const savedPassageCollection = useSavedPassageCollection(
    authSession.user?.id,
  );
  const { featuredHomeCategories } = usePassageCategories(
    featuredCatalog.passages,
  );

  if (featuredCatalog.isLoading) {
    return <AppLoadingState message="Loading featured passages..." />;
  }

  if (featuredCatalog.error) {
    return <AppErrorState message={featuredCatalog.error} />;
  }

  function startFeaturedPractice(category?: string) {
    const availablePassages = category
      ? featuredCatalog.passages.filter((passage) => passage.theme === category)
      : featuredCatalog.passages;
    const passage = getRandomFeaturedPassage(availablePassages);

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
