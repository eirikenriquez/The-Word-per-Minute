# The Word per Minute Documentation

Document version: `260622.2.a`
Last updated: 22/06/26
Update rule: only update this file when explicitly requested by the project owner.

## Purpose

The Word per Minute is a Bible typing practice app. It helps users practise typing while reading, discovering, selecting, saving, and revisiting Bible passages.

The current product direction is:

- Home introduces the app and lets users choose a practice direction.
- Practice is the central typing page.
- Featured passages introduce users to curated scripture.
- Bible lets users read chapters and select verses to save.
- Library lets users manage saved passages.
- Saved passages can be practised from Practice.

Version history and documentation update notes live in `docs/update-notes.md`.

## Tech Stack

- Vite
- React
- TypeScript
- React Router
- Tailwind CSS
- Local JSON Bible data
- `localStorage` for saved passages, personal best stats, and theme preference

No backend, database, authentication, or external Bible API is currently used.

## High-Level Architecture

The app uses URL-based React routing with feature folders and a central app controller.

```txt
URL route -> App shell -> app controller -> page-prop factories -> page component -> feature components/hooks
```

The main architecture layers are:

- `src/app`: app-level shell, routing, controllers, navigation, and coordination hooks.
- `src/pages`: screen-level page components.
- `src/features`: feature-specific UI, hooks, and services.
- `src/services`: shared service layer for local Bible data.
- `src/types`: shared TypeScript data shapes.
- `src/ui`: small reusable UI primitives used across features.
- `src/utils`: shared pure helper functions.
- `src/data`: local Bible and featured-passage JSON data.
- `src/theme.css`: semantic light/dark color tokens exposed through Tailwind.
- `public/brand`: theme-aware application symbol assets.

## Routes

The app is a single page app with proper URL routes:

```txt
/          Home
/practice  Practice
/bible     Bible
/library   Library
```

`BrowserRouter` is installed in `src/main.tsx`.

`src/app/components/AppRoutes.tsx` maps paths to pages:

```txt
/          -> HomePage
/practice  -> PracticePage
/bible     -> BiblePage
/library   -> LibraryPage
```

`useAppNavigation` derives the current `appMode` from the URL path. The URL is the source of truth for which screen is active.

## App Pages

### Home

Home is the starting screen.

It:

- shows primary entry points for Practice, Bible, and Library,
- shows animated counters for curated and saved passage counts,
- starts a random featured passage,
- starts a random featured passage from a chosen category,
- opens the Bible reader,
- opens Library when saved passages exist.

### Practice

Practice is the central typing flow.

It:

- practises a featured passage or saved passage,
- treats the selected verses as one continuous typing passage,
- displays the passage in a fixed-height viewport that users cannot scroll manually,
- automatically scrolls the passage to keep the active typing position visible,
- keeps the typing input at a consistent fixed height,
- calculates WPM continuously while an attempt is active,
- counts typing mistakes in accuracy even when the user later corrects them,
- treats deletion as neutral rather than as an additional mistake,
- freezes the final WPM and accuracy when the passage is completed,
- records personal bests locally,
- allows featured passages to be saved from the Practice controls,
- lets users switch between Featured and Saved practice sources,
- presents source and saved-passage controls in a responsive, label-first layout,
- shows WPM, accuracy, progress, and status as one quiet horizontal summary instead of separate dashboard cards.

### Bible

Bible is the reader and passage-selection flow.

It:

- lets the user choose translation, book, and chapter,
- displays the whole chapter,
- lets the user click individual verses,
- lets the user drag-select verse ranges,
- treats an empty verse selection as the whole current chapter,
- lets the user save selected verses with a custom title and category,
- lets the user save the whole chapter when no individual verses are selected,
- can open a random featured passage in context,
- waits for the selected chapter to render before scrolling to highlighted verses,
- uses a softer selected-verse treatment in light mode while retaining strong dark-mode contrast.

Bible does not show typing input directly.

### Library

Library is the saved-passage management flow.

It:

- reads saved passages from `localStorage`,
- displays saved passages as cards,
- supports search by title, reference, category, book, or translation,
- supports category filtering,
- supports source filtering by All sources, Featured, or Saved,
- lets the user practise a saved passage,
- lets the user open a saved passage in its original Bible context,
- restores exact custom verse selections when opening them in Bible,
- highlights the full range for saved featured passages,
- opens whole-chapter saves without individual verse highlighting,
- lets the user edit saved passage title/category,
- lets the user remove saved passages,
- shows clearer card metadata, source labels, saved dates, and active practice state,
- separates passage actions from edit/remove actions,
- gives removal a restrained destructive treatment.

Library does not show typing input directly.

## App Runtime Flow

```txt
main.tsx
  -> BrowserRouter
  -> App.tsx
    -> calls useAppController
      -> derives appMode from URL
      -> loads feature hooks
      -> builds display state
      -> builds cross-page actions
      -> prepares page props through plain factory functions
    -> renders PageShell with sticky branded navigation and floating utility controls
    -> renders AppHeader on non-Home pages
    -> renders AppRoutes
      -> renders HomePage, PracticePage, BiblePage, or LibraryPage
```

`App.tsx` is mostly the app shell. App-wide coordination lives in `src/app/controllers/useAppController.ts`. Cross-page actions are created by `createAppActions.ts`, while page-specific prop wiring is grouped into the plain factory functions in `createPageProps.ts`.

Home intentionally hides `AppHeader` so the Home hero is the first page content. Practice, Bible, and Library still show the contextual page title/reference area.

## Current File Structure

```txt
src/
  app/
    components/
      AppErrorState.tsx
      AppFooter.tsx
      AppHeader.tsx
      AppLoadingState.tsx
      BackToTopButton.tsx
      AppRoutes.tsx
      AppNavigation.tsx
      PageShell.tsx
      PassageSaveControls.tsx
    controllers/
      createAppActions.ts
      createPageProps.ts
      useAppController.ts
    hooks/
      useAppDisplayState.ts
      useAppModeEffects.ts
      useAppNavigation.ts
      useTheme.ts
    routes/
      appRoutePaths.ts
  features/
    bible-reader/
      components/
        BibleChapterReader.tsx
        BibleReaderControls.tsx
      hooks/
        useReaderSelection.ts
        useVerseLibrary.ts
    featured-passages/
      hooks/
        useFeaturedPassages.ts
        usePassageCategories.ts
    practice/
      components/
        FeaturedSaveAction.tsx
        PersonalBests.tsx
        PracticeActionButtons.tsx
        PracticeControls.tsx
        PracticePassageDisplay.tsx
        SavedPassageSelect.tsx
        SourcePicker.tsx
        TypingPracticePanel.tsx
      hooks/
        usePracticePassage.ts
        usePracticeSession.ts
        usePracticeStats.ts
      utils/
        practicePassage.ts
        typingMetrics.ts
    saved-passages/
      components/
        SavedPassageCard.tsx
        SavedPassageFilters.tsx
        SavedPassageLibrary.tsx
      constants/
        savedPassageCategories.ts
      hooks/
        usePassageSaveInput.ts
        useSavePassageForm.ts
        useSavedPassages.ts
      services/
        savedPassageRepository.ts
  pages/
    BiblePage.tsx
    HomePage.tsx
    LibraryPage.tsx
    PracticePage.tsx
  services/
    verseService.ts
  data/
    bibles/
    featuredPassages.json
    translations.json
  types/
    app.ts
    featuredPassage.ts
    practice.ts
    savedPassage.ts
    verse.ts
  ui/
    Button.tsx
  utils/
    errors.ts
    passageReference.ts
  App.tsx
  index.css
  main.tsx
  theme.css

public/
  brand/
    symbol-dark.svg
    symbol-light.svg
  favicon.svg
```

## Key Files And Responsibilities

### `src/main.tsx`

Mounts React and wraps the app in `BrowserRouter`.

### `src/App.tsx`

Renders the app shell.

Responsibilities:

- calls `useAppController`,
- renders loading and error states,
- renders `PageShell` with global navigation/theme state,
- renders `AppHeader` on non-Home pages,
- renders `AppRoutes`.

### `src/app/controllers/useAppController.ts`

Coordinates app-wide state and cross-feature wiring.

Responsibilities:

- derives `appMode` through `useAppNavigation`,
- keeps `practiceSource` state,
- loads feature hooks,
- builds the active continuous practice passage,
- builds display labels/loading/error state,
- builds cross-page actions,
- prepares header props,
- prepares routed page props through plain factory functions.

### `src/app/controllers/createAppActions.ts`

Creates the cross-page action functions used to coordinate navigation and multiple feature stores.

The name intentionally does not use the React `use` prefix because this module does not call hooks.

### `src/app/controllers/createPageProps.ts`

Contains the plain page-prop factory functions:

- `createHomePageProps`
- `createPracticePageProps`
- `createBiblePageProps`
- `createLibraryPageProps`

### `src/app/components/AppRoutes.tsx`

Defines the app's URL routes and maps prepared page props directly to page elements.

### `src/app/components/AppHeader.tsx`

Shows the current title, subtitle, reference, and contextual passage-save controls on non-Home pages.

### `src/app/components/AppNavigation.tsx`

Shows the global Home / Practice / Bible / Library navigation in the app shell.

### `src/app/components/AppFooter.tsx`

Provides a quiet ending to every page.

It includes:

- the app symbol, name, and purpose,
- a notice that saved passages, preferences, and statistics remain in the browser,
- World English Bible public-domain attribution,
- a link to the GitHub repository,
- the current copyright year.

### `src/app/components/PageShell.tsx`

Provides the app page frame:

- linked brand symbol and app title,
- sticky icon-supported global navigation,
- floating light/dark theme button,
- main content width,
- app background,
- application footer,
- back-to-top button on long reader/list pages.

### `src/app/components/BackToTopButton.tsx`

Shows a small circular floating arrow button on long pages.

Current behaviour:

- only enabled on Bible and Library,
- fades into view after the user scrolls down,
- smoothly scrolls the window back to the top,
- supports light and dark mode.

### `src/ui/Button.tsx`

Provides the shared visual hierarchy for ordinary app actions.

Current variants:

- primary,
- secondary,
- ghost,
- danger.

Specialized controls such as navigation tabs, Practice source choices, verse buttons, and the back-to-top button retain their own styling.

### `src/app/hooks/useTheme.ts`

Owns the browser theme preference and stores it in `localStorage`.

### `src/theme.css`

Defines the app's semantic Tailwind v4 color system.

It maps light and dark CSS variables to utilities for:

- canvas and surfaces,
- primary, muted, and subtle text,
- ordinary and strong borders,
- neutral actions,
- ember accents,
- selected states.

### `src/services/verseService.ts`

API-shaped local data service.

Responsibilities:

- list translations,
- list books,
- load a chapter,
- list featured passages,
- resolve featured passages,
- resolve saved/custom passage references.

This should stay API-shaped so local JSON can later move to hosted data.

## Feature Responsibilities

### `features/practice`

Owns typing practice UI and logic:

- source controls,
- featured passage save action,
- saved passage picker,
- practice action buttons,
- fixed-height continuous passage display,
- automatic active-character scrolling without manual passage scrolling,
- fixed-height typing input,
- responsive Practice setup layout,
- compact horizontal typing metrics,
- personal bests,
- live WPM timing,
- mistake-aware accuracy session state,
- continuous practice-passage creation,
- pure typing metric and character-equivalence logic.

### `features/bible-reader`

Owns Bible browsing and verse selection:

- translation/book/chapter controls,
- full chapter reader,
- click and drag verse selection,
- selected-verse focus after asynchronous chapter loading,
- light and dark selected-verse styling,
- reader data-loading state.

### `features/featured-passages`

Owns curated passage discovery:

- featured passage loading,
- random featured passage selection,
- category derivation,
- Home category picker UI.

### `features/saved-passages`

Owns saved passage storage and management:

- save input creation,
- save form state,
- saved passage search/filter/list/edit/remove UI,
- saved passage cards with clear information and action hierarchy,
- Library-to-Bible passage navigation,
- `localStorage` repository.

## Data Files

- `src/data/featuredPassages.json`: curated passage references.
- `src/data/translations.json`: available translations.
- `src/data/bibles/web`: local World English Bible data.

Bible data structure:

```txt
src/data/bibles/web/
  manifest.json
  books/
    Gen.json
    Exod.json
    ...
```

## Theme And Motion

`src/index.css` contains the global CSS entry point and motion helpers:

- Tailwind import,
- semantic theme import,
- Tailwind v4 class-based dark mode variant,
- browser body margin reset,
- page enter animation,
- Home section rise-in animation,
- subtle hover motion helpers.

Theme state is managed by `src/app/hooks/useTheme.ts` and stored in `localStorage`.

`src/theme.css` defines semantic colors with CSS variables and Tailwind v4's `@theme inline`. Components use names such as `canvas`, `surface`, `ink`, `line`, `action`, `accent`, and `selected` instead of depending directly on palette shades.

The current visual direction uses:

- warm stone surfaces for the light and dark foundations,
- slate-influenced text for clear reading contrast,
- a restrained roasted-ember orange for active, selected, and primary states,
- neutral action colors for ordinary controls,
- rose feedback for destructive and typing-error states.

Ordinary buttons share `src/ui/Button.tsx`, while specialized controls retain local styling backed by the same semantic palette. Form controls remain in their owning components and should only become a shared primitive if those styles begin to drift again.

Heroicons supplies interface icons. Icons support labels and meaning rather than replacing important action text. The header uses separate light/dark transparent symbol assets, while `public/favicon.svg` adapts to the browser's color scheme.

## Important Types

- `src/types/app.ts`: route-backed app modes, practice source, and theme.
- `src/types/featuredPassage.ts`: featured passage references and resolved passage responses.
- `src/types/practice.ts`: practice statistics, typing metrics, and continuous passage shape.
- `src/types/savedPassage.ts`: saved passage and save input shapes.
- `src/types/verse.ts`: Bible translation, book, chapter, and verse shapes.

## Current Architecture Diagram

```mermaid
flowchart TD
  main["main.tsx + BrowserRouter"] --> app["App.tsx"]
  app --> controller["useAppController"]
  app --> shell["PageShell + AppNavigation"]
  controller --> actions["createAppActions"]
  controller --> pageProps["createPageProps factories"]
  controller --> headerProps["Header props"]
  app --> header["AppHeader on non-Home pages"]
  app --> routes["AppRoutes"]
  pageProps --> routes
  routes --> home["HomePage"]
  routes --> practice["PracticePage"]
  routes --> bible["BiblePage"]
  routes --> library["LibraryPage"]
  home --> featured["features/featured-passages"]
  practice --> practiceFeature["features/practice"]
  bible --> bibleFeature["features/bible-reader"]
  library --> savedFeature["features/saved-passages"]
  savedFeature --> bibleFeature
  featured --> verseService["verseService"]
  practiceFeature --> verseService
  bibleFeature --> verseService
  savedFeature --> verseService
  savedFeature --> localStorage["localStorage"]
```

## Known Technical Debt

- `useAppController` is the main app composition root and should not become a dumping ground for feature logic.
- The UI overhaul still needs a final desktop visual QA pass in light and dark mode.
- Category management is still hardcoded/generated from featured themes.
- Library filtering is UI-only and still backed by local saved passage data.
- User data is local-only through `localStorage`.
- The app uses local JSON Bible data only; no hosted API yet.
- Form-control styling is repeated across components and may later benefit from a small shared primitive if it begins to drift.
- Motion does not yet account for the user's reduced-motion preference.
- Saved-passage removal has no confirmation or undo.
- Automated tests are not set up yet.
- Vercel is the intended future deployment target, but deployment and SPA rewrite configuration are not yet included.

## Confirmed Product Decisions

- Accuracy counts mistakes made during an attempt, including mistakes that are later corrected. Deletion itself is neutral.
- WPM updates while an attempt is active and freezes when the passage is completed.
- Practice uses one continuous typing target rather than advancing through two-verse batches.
- The passage and typing input use stable heights so the page does not jump with verse length.
- In Bible mode, saving with no selected verses intentionally saves the whole current chapter.
- Saved passages can be reopened from Library in their original Bible context.
- Saved featured passages highlight their full verse range, exact custom selections retain their selected verses, and whole-chapter saves open without individual highlights.
- Vercel is the planned future deployment platform.
- The app uses a warm stone foundation with a restrained ember accent rather than bright blue primary actions.
- Interface icons are contextual aids and should remain paired with text for important actions.
- The header brand uses the standalone symbol beside live HTML text rather than embedding the full wordmark.
- Desktop keyboard practice is the current priority; mobile-specific optimization is not a near-term focus.

## Likely Next Architecture Steps

1. Manually test `/`, `/practice`, `/bible`, and `/library`.
2. Confirm refresh and browser back/forward work correctly on each route.
3. Visually QA the branded header, semantic colors, icons, floating theme control, and back-to-top button in both themes.
4. Tune the Practice passage viewport height and automatic scrolling from real typing use.
5. Add reduced-motion handling.
6. Keep `useAppController` limited to cross-feature composition.
7. Keep `verseService` API-shaped so local JSON can later move to hosted data.
8. Keep saved passage storage behind `savedPassageRepository` so it can later move to a database.
9. Add Vercel configuration and verify SPA route fallbacks when deployment work begins.
