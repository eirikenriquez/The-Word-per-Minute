# The Word per Minute Update Notes

Current documentation version: `260615.1.b`
Last updated: 15/06/26

## Update Rule

Only update documentation files when explicitly requested by the project owner.

When documentation changes, include:

- the new version,
- what file or section changed,
- what the update means for the current app architecture.

## Version Format

Documentation versions use this format:

```txt
yymmdd.major.minor
```

Example:

```txt
260614.1.a
```

- `260614` means 14/06/26.
- `1` means the first major documentation snapshot for that day.
- `a` means the first small revision of that snapshot.

Suggested next versions:

- Small same-day documentation update: `260615.1.c`
- Larger same-day documentation update: `260615.2.a`
- First update on a new day: `yymmdd.1.a`

## `260615.1.b`

This version updates the architecture snapshot after the Home and app shell UI layout changes.

It updates:

- the runtime flow to show that `PageShell` now owns the global brand/navigation/theme controls,
- the Home page behaviour to note that the contextual `AppHeader` is hidden on Home,
- the app component list to include `AppNavigation`, `HeaderTitleBlock`, and `PassageSaveControls`,
- the responsibilities for `App.tsx`, `PageShell`, `AppNavigation`, and `ModeHeaderPanel`,
- the theme/motion section to show that `src/index.css` is intentionally minimal again,
- the architecture diagram to separate global shell navigation from the non-Home contextual page header,
- known technical debt and next steps for the ongoing UI overhaul.

This does not change product scope. It documents the move away from floating main content cards toward a cleaner web app shell.

## `260615.1.a`

This version updates the architecture snapshot after the Practice controls and Library polish work.

It updates:

- the Practice responsibilities to show that featured passage saving now lives in the Practice controls,
- the current file structure for the split Practice control components,
- the Library responsibilities to include search, category filtering, source filtering, clearer metadata, saved dates, and active practice state,
- the saved-passages feature responsibilities to include search and filter state,
- known technical debt to note that Library filtering is still local/UI-only.

This does not add backend scope. It documents UI and modularity improvements while keeping saved passages behind local state and `localStorage`.

## `260614.1.b`

This version updates the architecture snapshot after the app modularisation cleanup.

It updates:

- the documented architecture from an `App.tsx` coordinator to an app shell plus app/page controllers,
- the `src/app` responsibilities to include app shell, route setup, controllers, navigation, and theme,
- the current file structure after removing the `src/shared` layer,
- the responsibilities for `useAppController` and the page controllers,
- the runtime flow from URL route to app controller to page controllers to pages,
- the architecture diagram,
- known technical debt and likely next architecture steps.

This does not change product scope. It documents the refactor that made app composition more explicit and moved formerly shared shell/theme code into `src/app`.

## `260614.1.a`

This version changes the documentation version format.

It updates:

- `docs/documentation.md` current version metadata,
- `docs/update-notes.md` current version metadata,
- the documented version format from `ddmmyy.major.minor` to `yymmdd.major.minor`.

This does not change the app architecture. Earlier version history entries keep their original labels for historical traceability.

## `130626.1.a`

This version updates the documentation after the modularity and routing refactor.

It updates:

- the app architecture from state-based modes to URL-based React Router routes,
- the current routes: `/`, `/practice`, `/bible`, and `/library`,
- the current feature-folder structure,
- the responsibilities of `src/app`, `src/pages`, `src/features`, and `src/shared`,
- the `App.tsx` runtime flow,
- the current architecture diagram,
- known technical debt and likely next architecture steps.

## `120626.1.d`

This version splits the old combined architecture document into two focused docs.

It updates:

- `docs/documentation.md` now contains the current architecture, file structure, flow, components, services, hooks, theme notes, and technical debt.
- `docs/update-notes.md` now contains version history, update rules, and documentation change notes.
- `docs/architecture.md` was removed to avoid competing sources of truth.

## `120626.1.c`

This version updated the architecture snapshot after the layout, practice flow, theme, and motion work.

It updated:

- the app modes to `Home`, `Practice`, `Bible`, and `Library`,
- the product direction to describe Practice as the central typing page,
- the split between featured practice and saved-passage practice,
- Library responsibilities as saved-passage management rather than typing,
- component responsibilities for `PracticeControls`,
- light/dark theme behavior and browser persistence,
- shared hover, page-transition, and reduced-motion behavior,
- the current file structure,
- the architecture diagram,
- known technical debt and likely next architecture steps.

## `120626.1.b`

This version updated the architecture snapshot after the Home/category picker and saved-passage editing work.

It updated:

- the app modes to include Home,
- the product direction to describe Home as the starting point,
- Saved mode responsibilities to include editing saved passage title/category,
- component responsibilities for the new `HomeCategoryPicker`,
- saved passage hook and repository responsibilities to include metadata updates,
- the current file structure,
- the architecture diagram,
- known technical debt and likely next architecture steps.

## `120626.1.a`

This version created the first architecture snapshot for the project.

It documented:

- the current app purpose and product direction,
- the current tech stack,
- the current React architecture,
- the three app modes at that time: Featured, Bible, and Saved,
- the main file structure,
- the responsibilities of components, hooks, services, utilities, and data files,
- the current architecture diagram,
- known technical debt,
- likely next architecture steps.
