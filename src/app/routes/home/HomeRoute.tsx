import { useNavigate } from 'react-router';
import { AppErrorState } from '../../components/AppErrorState';
import { AppLoadingState } from '../../components/AppLoadingState';
import { usePassageCategories } from '../../hooks/usePassageCategories';
import { useAuth } from '../../../features/auth/context/authContext';
import { useAuthMenu } from '../../../features/auth/context/authMenuContext';
import { useFeaturedPassageCatalog } from '../../../features/featured-passages/hooks/useFeaturedPassageCatalog';
import { useSelectedFeaturedPassage } from '../../../features/featured-passages/hooks/useSelectedFeaturedPassage';
import { getRandomFeaturedPassage } from '../../../features/featured-passages/utils/featuredPassageSelection';
import { APP_ROUTE_PATHS } from '../appRoutePaths';
import { createPracticePath } from '../practice/practiceRouteState';
import { HomePage } from './HomePage';

/**
 * Composes the feature data and navigation needed only by the Home page.
 */
export function HomeRoute() {
  const navigate = useNavigate();
  const authSession = useAuth();
  const { openSignUpMenu } = useAuthMenu();
  const featuredCatalog = useFeaturedPassageCatalog();
  const { featuredHomeCategories } = usePassageCategories(
    featuredCatalog.passages,
  );
  const selectedFeaturedPassage = useSelectedFeaturedPassage(
    featuredCatalog.passages,
  );

  if (featuredCatalog.isLoading) {
    return <AppLoadingState message="Loading featured passages..." />;
  }

  if (featuredCatalog.error) {
    return <AppErrorState message={featuredCatalog.error} />;
  }

  function startFeaturedPractice(category?: string, passageId?: string) {
    const availablePassages = category
      ? featuredCatalog.passages.filter((passage) => passage.theme === category)
      : featuredCatalog.passages;
    const passage = passageId
      ? availablePassages.find(
          (availablePassage) => availablePassage.id === passageId,
        )
      : getRandomFeaturedPassage(availablePassages);

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
      featuredPassageError={selectedFeaturedPassage.error}
      featuredPassageResponse={selectedFeaturedPassage.passageResponse}
      isFeaturedPassageLoading={selectedFeaturedPassage.isLoading}
      isSignedIn={authSession.isSignedIn}
      onCreateAccount={openSignUpMenu}
      onOpenBible={() => void navigate(APP_ROUTE_PATHS.bible)}
      onSelectFeaturedCategory={startFeaturedPractice}
      onPracticeFeaturedPassage={() =>
        startFeaturedPractice(
          undefined,
          selectedFeaturedPassage.selectedPassageId,
        )
      }
      onStartFeaturedPractice={() =>
        startFeaturedPractice(
          undefined,
          selectedFeaturedPassage.selectedPassageId,
        )
      }
    />
  );
}
