import { Navigate, Route, Routes } from 'react-router';
import type { BiblePageProps } from '../../pages/bible/BiblePage';
import { BiblePage } from '../../pages/bible/BiblePage';
import type { PracticePageProps } from '../../pages/practice/PracticePage';
import { PracticePage } from '../../pages/practice/PracticePage';
import { APP_ROUTE_PATHS } from '../routes/appRoutePaths';

export type AppRoutesProps = {
  biblePageProps: BiblePageProps;
  practicePageProps: PracticePageProps | null;
};

/**
 * Maps URL paths to the app's prepared page components.
 */
export function AppRoutes({
  biblePageProps,
  practicePageProps,
}: AppRoutesProps) {
  return (
    <Routes>
      <Route
        element={
          practicePageProps ? <PracticePage {...practicePageProps} /> : null
        }
        path={APP_ROUTE_PATHS.practice}
      />
      <Route
        element={<BiblePage {...biblePageProps} />}
        path={APP_ROUTE_PATHS.bible}
      />
      <Route
        element={<Navigate replace to={APP_ROUTE_PATHS.home} />}
        path="*"
      />
    </Routes>
  );
}
