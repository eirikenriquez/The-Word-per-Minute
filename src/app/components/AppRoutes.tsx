import { Navigate, Route, Routes } from "react-router-dom";
import type { BiblePageProps } from "../../pages/bible/BiblePage";
import { BiblePage } from "../../pages/bible/BiblePage";
import type { HomePageProps } from "../../pages/home/HomePage";
import { HomePage } from "../../pages/home/HomePage";
import type { LibraryPageProps } from "../../pages/library/LibraryPage";
import { LibraryPage } from "../../pages/library/LibraryPage";
import type { PracticePageProps } from "../../pages/practice/PracticePage";
import { PracticePage } from "../../pages/practice/PracticePage";
import type { ProfilePageProps } from "../../pages/profile/ProfilePage";
import { ProfilePage } from "../../pages/profile/ProfilePage";
import { APP_ROUTE_PATHS, PROFILE_ROUTE_PATH } from "../routes/appRoutePaths";

export type AppRoutesProps = {
  biblePageProps: BiblePageProps;
  homePageProps: HomePageProps;
  libraryPageProps: LibraryPageProps;
  practicePageProps: PracticePageProps | null;
  profilePageProps: ProfilePageProps;
};

/**
 * Maps URL paths to the app's prepared page components.
 */
export function AppRoutes({
  biblePageProps,
  homePageProps,
  libraryPageProps,
  practicePageProps,
  profilePageProps,
}: AppRoutesProps) {
  return (
    <Routes>
      <Route element={<HomePage {...homePageProps} />} path={APP_ROUTE_PATHS.home} />
      <Route
        element={practicePageProps ? <PracticePage {...practicePageProps} /> : null}
        path={APP_ROUTE_PATHS.practice}
      />
      <Route element={<BiblePage {...biblePageProps} />} path={APP_ROUTE_PATHS.bible} />
      <Route element={<LibraryPage {...libraryPageProps} />} path={APP_ROUTE_PATHS.library} />
      <Route element={<ProfilePage {...profilePageProps} />} path={PROFILE_ROUTE_PATH} />
      <Route element={<Navigate replace to={APP_ROUTE_PATHS.home} />} path="*" />
    </Routes>
  );
}
