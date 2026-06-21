# The Word per Minute Update Notes

Current documentation version: `260622.2.a`
Last updated: 22/06/26

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

- Small same-day documentation update: `260622.2.b`
- Larger same-day documentation update: `260622.3.a`
- First update on a new day: `yymmdd.1.a`

## `260622.2.a`

This version documents the application footer and continuous Practice passage redesign.

It updates:

- the file tree and shell responsibilities to include `AppFooter.tsx`,
- the footer purpose, Bible attribution, GitHub link, and local-data notice,
- Practice behaviour from two-verse batches to one continuous typing target,
- the fixed-height passage viewport with automatic-only scrolling,
- automatic scrolling that follows the active typing position,
- the fixed-height typing input,
- Practice component, hook, utility, and type names after replacing the batch model,
- the app controller responsibility for building the active practice passage,
- confirmed product decisions and remaining Practice viewport tuning.

This update documents the merged footer commit and the `Changed to scrollable passage view in practice page` commit. It does not add further runtime behaviour.

## `260622.1.a`

This version documents the completed UI consistency, theme, icon, and branding branch.

It updates:

- the architecture and file tree to include `src/theme.css` and the public brand assets,
- the app shell responsibilities to describe the linked brand symbol, icon-supported navigation, and floating theme control,
- the back-to-top behaviour to include its fade transition,
- the theme guidance to document semantic Tailwind v4 tokens,
- the visual direction from bright blue controls to warm stone foundations and a restrained ember accent,
- the use of Heroicons for navigation and contextual actions,
- the header symbol and adaptive favicon implementation,
- the current desktop-first product priority,
- known technical debt and the remaining visual QA work.

This update records the UI branch from the shared button, heading, form, Practice, and Library refinements through semantic colors, icons, floating controls, and final brand integration.

## `260620.1.b`

This version documents the icon-free UI consistency pass across the app.

It updates:

- the architecture layers and file tree to include the shared `src/ui/Button.tsx` primitive,
- the button hierarchy to document primary, secondary, ghost, and danger variants,
- Practice behaviour to include the responsive source/passage control layout,
- Practice behaviour to include the quieter horizontal WPM, accuracy, progress, and status summary,
- Library behaviour to describe the refined card hierarchy and separated action groups,
- Library behaviour to record the destructive visual treatment for passage removal,
- the theme guidance to clarify that buttons are shared while form-control styles remain local,
- known technical debt to focus future extraction decisions on form controls rather than buttons,
- the current product direction to continue consistency work before adding icons or image assets.

This update documents the UI work introduced by the button hierarchy, heading hierarchy, form-control consistency, Practice control layout, Practice metrics, and Library card refinement commits.

## `260620.1.a`

This version documents the Bible reader and saved-passage navigation improvements.

It updates:

- Bible behaviour to state that selected-verse scrolling waits for the requested chapter to render,
- Library behaviour to include opening saved passages in their original Bible context,
- the selection rules for saved featured passages, exact custom selections, and whole-chapter saves,
- Bible reader and saved-passage feature responsibilities,
- selected-verse styling to describe the softer light-mode treatment,
- the architecture diagram to show the saved-passage feature opening content in the Bible reader,
- known technical debt and likely next steps now that reader scrolling has been synchronized.

This update documents the runtime changes introduced by `Synchronize featured passage scrolling`, `Open saved passages in Bible`, and `Soften selected verse highlight`.

## `260619.1.b`

This version documents the Practice metric improvements.

It updates:

- Practice behaviour to state that WPM refreshes while an attempt is active and freezes on completion,
- Practice behaviour to state that accuracy retains mistakes after they are corrected,
- the accuracy rule to clarify that deleting text is neutral,
- the Practice feature responsibilities to include live timing and mistake-aware scoring,
- known technical debt and likely next steps now that corrected-mistake accuracy has been implemented.

This update documents the runtime changes introduced by `Track typing mistakes in accuracy` and `Update WPM while typing`. It does not add further runtime behaviour.

## `260619.1.a`

This version updates the architecture snapshot after the final project-structure simplification pass and records clarified product decisions.

It updates:

- the runtime flow to use `createAppActions` and the page-prop factories in `createPageProps`,
- the current file structure after removing pass-through header layers, separate page-controller files, one-use utility folders, and tiny type files,
- component and controller responsibilities to match the current repository,
- Practice utility and type locations,
- Bible behaviour to state that saving with no selected verses intentionally saves the whole chapter,
- known technical debt to record that final accuracy should count corrected mistakes,
- known technical debt around featured-passage scroll timing, reduced-motion support, deletion recovery, and automated tests,
- Vercel as the intended future deployment platform while noting that deployment configuration is not yet present,
- the likely next architecture steps based on the current code review.

This documentation update does not implement new runtime behaviour. It brings the written architecture up to date and records the owner's current product decisions.

## `260618.1.a`

This version updates the architecture snapshot after the UI theme, motion, and navigation polish work.

It updates:

- the documented `PageShell` responsibilities to include sticky navigation and the back-to-top button,
- the current file structure to include `BackToTopButton.tsx`,
- the Home page responsibilities to include animated curated and saved passage counters,
- the theme and motion section to document Tailwind v4 class-based dark mode, blue accent styling, page motion, and hover helpers,
- known technical debt to focus on visual QA and possible future style helpers,
- likely next steps to include desktop/mobile visual QA and the later Monkeytype-style typing surface.

This does not change product scope. It documents the current UI polish layer while keeping the app simple and Tailwind-based.

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
