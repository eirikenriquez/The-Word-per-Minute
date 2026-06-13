import type { BiblePageProps } from "../../pages/BiblePage";
import { BiblePage } from "../../pages/BiblePage";
import type { HomePageProps } from "../../pages/HomePage";
import { HomePage } from "../../pages/HomePage";
import type { LibraryPageProps } from "../../pages/LibraryPage";
import { LibraryPage } from "../../pages/LibraryPage";
import type { PracticePageProps } from "../../pages/PracticePage";
import { PracticePage } from "../../pages/PracticePage";
import { AppRoutes } from "./AppRoutes";

export type AppPageRoutesProps = {
  biblePageProps: BiblePageProps;
  homePageProps: HomePageProps;
  libraryPageProps: LibraryPageProps;
  practicePageProps: PracticePageProps | null;
};

/**
 * Builds the route elements for each app page.
 * App owns the state; this component owns the page-to-prop wiring.
 */
export function AppPageRoutes({
  biblePageProps,
  homePageProps,
  libraryPageProps,
  practicePageProps,
}: AppPageRoutesProps) {
  return (
    <AppRoutes
      pages={{
        bible: <BiblePage {...biblePageProps} />,
        home: <HomePage {...homePageProps} />,
        library: <LibraryPage {...libraryPageProps} />,
        practice: practicePageProps ? <PracticePage {...practicePageProps} /> : null,
      }}
    />
  );
}
