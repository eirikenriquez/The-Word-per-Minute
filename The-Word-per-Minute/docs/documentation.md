# The Word per Minute Documentation

Document version: `130626.1.a`
Last updated: 13/06/26
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

The app now uses URL-based React routing with feature folders.

```txt
URL route -> App.tsx coordinator -> page component -> feature components/hooks
```

The main architecture layers are:

- `src/app`: app-level routing, navigation header, and coordination hooks.
- `src/pages`: screen-level page components.
- `src/features`: feature-specific UI, hooks, and services.
- `src/shared`: reusable shell/theme pieces.
- `src/services`: shared service layer for local Bible data.
- `src/types`: shared TypeScript data shapes.
- `src/utils`: shared pure helper functions.
- `src/data`: local Bible and featured-passage JSON data.

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

`App.tsx` derives the current `appMode` from the URL path. The URL is now the source of truth for which screen is active.

## App Pages

### Home

Home is the starting screen.

It:

- shows primary entry points for Practice, Bible, and Library,
- starts a random featured passage,
- starts a random featured passage from a chosen category,
- opens the Bible reader,
- opens Library when saved passages exist.

### Practice

Practice is the central typing flow.

It:

- practises a featured passage or saved passage,
- presents the passage as short typing batches,
- calculates WPM and accuracy,
- records personal bests locally,
- allows featured passages to be saved,
- lets users switch between Featured and Saved practice sources.

### Bible

Bible is the reader and passage-selection flow.

It:

- lets the user choose translation, book, and chapter,
- displays the whole chapter,
- lets the user click individual verses,
- lets the user drag-select verse ranges,
- lets the user save selected verses with a custom title and category,
- can open a random featured passage in context and scroll to the selected verses.

Bible does not show typing input directly.

### Library

Library is the saved-passage management flow.

It:

- reads saved passages from `localStorage`,
- displays saved passages as cards,
- supports category filtering,
- lets the user practise a saved passage,
- lets the user edit saved passage title/category,
- lets the user remove saved passages.

Library does not show typing input directly.

## App Runtime Flow

```txt
main.tsx
  -> BrowserRouter
  -> App.tsx
    -> derives appMode from URL
    -> loads feature hooks
    -> builds display state
    -> builds cross-page actions
    -> renders PageShell
    -> renders ModeHeaderPanel
    -> renders AppRoutes
      -> renders HomePage, PracticePage, BiblePage, or LibraryPage
```

`App.tsx` is the app coordinator. It does not contain the main UI for each screen; pages and features do that.

## Current File Structure

```txt
src/
  app/
    components/
      AppRoutes.tsx
      ModeHeaderPanel.tsx
    hooks/
      useAppActions.ts
      useAppDisplayState.ts
      useAppModeEffects.ts
  features/
    bible-reader/
      components/
        BibleControls.tsx
        BibleReaderSelector.tsx
      hooks/
        useReaderSelection.ts
        useVerseLibrary.ts
    featured-passages/
      components/
        HomeCategoryPicker.tsx
      hooks/
        useFeaturedPassages.ts
        usePassageCategories.ts
    practice/
      components/
        PersonalBests.tsx
        PracticeBatchDisplay.tsx
        PracticeControls.tsx
        TypingPracticePanel.tsx
      hooks/
        usePracticeBatches.ts
        usePracticeSession.ts
        usePracticeStats.ts
    saved-passages/
      components/
        SavedPassageControls.tsx
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
  shared/
    components/
      PageShell.tsx
    hooks/
      useTheme.ts
  services/
    verseService.ts
  constants/
    savedPassageCategories.ts
  data/
    bibles/
    featuredPassages.json
    translations.json
  types/
  utils/
  App.tsx
  index.css
  main.tsx
```

## Key Files And Responsibilities

### `src/main.tsx`

Mounts React and wraps the app in `BrowserRouter`.

### `src/App.tsx`

Coordinates the app.

Responsibilities:

- derives `appMode` from the current URL,
- keeps `practiceSource` state,
- loads feature hooks,
- builds practice batches,
- builds display labels/loading/error state,
- builds cross-page actions,
- renders the shell, header, and route table.

### `src/app/components/AppRoutes.tsx`

Defines the app's URL routes and maps them to page elements.

### `src/app/components/ModeHeaderPanel.tsx`

Shows:

- current title/subtitle/reference,
- Home / Practice / Bible / Library navigation,
- contextual save controls.

### `src/shared/components/PageShell.tsx`

Provides the shared page frame:

- app title,
- theme button,
- main content width,
- shared background.

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
- typing batch display,
- typing input,
- personal bests,
- WPM/accuracy session state,
- practice batch creation.

### `features/bible-reader`

Owns Bible browsing and verse selection:

- translation/book/chapter controls,
- full chapter reader,
- click and drag verse selection,
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
- saved passage list/edit/remove state,
- saved passage cards,
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

`src/index.css` handles global styling:

- Tailwind import,
- smooth scrolling,
- page transitions,
- reduced-motion support,
- light/dark color mapping,
- subtle hover and focus behaviour.

Theme state is managed by `src/shared/hooks/useTheme.ts` and stored in `localStorage`.

## Important Types

- `src/types/appMode.ts`: route-backed app modes and practice source.
- `src/types/featuredPassage.ts`: featured passage references and resolved passage responses.
- `src/types/savedPassage.ts`: saved passage and save input shapes.
- `src/types/verse.ts`: Bible translation, book, chapter, and verse shapes.
- `src/types/practiceBatch.ts`: typing batch shape.

## Current Architecture Diagram

```mermaid
flowchart TD
  main["main.tsx + BrowserRouter"] --> app["App.tsx"]
  app --> shell["PageShell"]
  app --> header["ModeHeaderPanel"]
  app --> routes["AppRoutes"]
  routes --> home["HomePage"]
  routes --> practice["PracticePage"]
  routes --> bible["BiblePage"]
  routes --> library["LibraryPage"]
  home --> featured["features/featured-passages"]
  practice --> practiceFeature["features/practice"]
  bible --> bibleFeature["features/bible-reader"]
  library --> savedFeature["features/saved-passages"]
  featured --> verseService["verseService"]
  practiceFeature --> verseService
  bibleFeature --> verseService
  savedFeature --> verseService
  savedFeature --> localStorage["localStorage"]
```

## Known Technical Debt

- `App.tsx` still coordinates many feature hooks and may later benefit from page-specific container hooks.
- `ModeHeaderPanel` still has shared navigation and save UI mixed together.
- Category management is still hardcoded/generated from featured themes.
- User data is local-only through `localStorage`.
- The app uses local JSON Bible data only; no hosted API yet.
- Theme mapping is handled through global CSS rather than formal design tokens.
- Automated tests are not set up yet.

## Likely Next Architecture Steps

1. Manually test `/`, `/practice`, `/bible`, and `/library`.
2. Confirm refresh and browser back/forward work correctly on each route.
3. Consider extracting page-specific container hooks if `App.tsx` grows again.
4. Consider splitting `ModeHeaderPanel` into navigation and save controls.
5. Keep `verseService` API-shaped so local JSON can later move to hosted data.
6. Keep saved passage storage behind `savedPassageRepository` so it can later move to a database.
7. Add automated tests once the app flow stabilises.
