# The Word per Minute Update Notes

Current documentation version: `260711.1.a`
Last updated: 11/07/26

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

- Small same-day documentation update: `260626.1.b`
- Larger same-day documentation update: `260626.2.a`
- First update on a new day: `yymmdd.1.a`

## `260711.1.a`

This version documents the inline Practice typing surface and reflection modal branch.

It updates:

- the README feature list to describe the inline passage typing surface,
- Practice responsibilities to explain that the passage itself is now the typing surface,
- Practice responsibilities to record the invisible input layer replacing the visible textarea,
- Practice responsibilities to describe the completion overlay with final WPM, accuracy, and next actions,
- Practice responsibilities to describe the focused post-practice reflection modal,
- confirmed product decisions for the Monkeytype-style typing direction and modal-based reflection flow.

This update documents Practice UX changes only. It does not change the Supabase schema, saved-passage storage, practice-history storage, or app routing.

## `260710.1.a`

This version documents signed-in practice history, reflections, and the new Profile/Progress page.

It updates:

- the README feature list and data/account summary,
- the current routes to include `/profile`,
- Practice responsibilities for saving signed-in attempts and reflections,
- Profile page responsibilities,
- the file tree for practice attempt stores/hooks and `ProfilePage`,
- app/auth/page-prop responsibilities for opening the account menu and profile page,
- Supabase schema documentation for the expanded `practice_attempts` shape,
- Row Level Security notes for reading/inserting practice attempts and updating reflection text,
- the architecture diagram to show practice-attempt persistence as implemented,
- known technical debt and likely next architecture steps after practice history.

This update documents the practice-history branch. Signed-in practice attempts and reflections are now implemented through Supabase; local personal-best stats and guest practice history are still not cloud-synced.

## `260706.1.f`

This version documents the auth dropdown polish pass.

It updates:

- `AuthControls` responsibilities to describe the icon-triggered dropdown,
- dropdown close behaviour for outside click, Escape, successful sign-in, and sign-out,
- global motion documentation to include the dropdown entrance animation,
- known technical debt now that the auth UI has received its first visual cleanup pass,
- likely next architecture steps to include custom SMTP/auth email delivery as a possible next branch.

This update documents UI polish only. It does not change the Supabase schema, saved-passage persistence, or practice-attempt persistence.

## `260706.1.e`

This version documents signed-in saved-passage persistence through Supabase.

It updates:

- the current tech stack to show Supabase Auth and signed-in saved passages as runtime behaviour,
- the current file tree to replace the old saved-passage repository with store implementations,
- Library responsibilities to distinguish guest local saves from signed-in cloud saves,
- Supabase client responsibilities now that it is used by auth and cloud saved passages,
- saved-passage domain responsibilities around `SavedPassageStore`,
- backend architecture from planned-only to partially implemented,
- Row Level Security documentation to include required table grants,
- the architecture diagram to show local and Supabase saved-passage stores,
- known technical debt and likely next steps after cloud saved passages.

This update documents the completed saved-passage cloud foundation. It does not add practice-attempt persistence, guest-to-cloud import, or auth UI polish.

## `260706.1.d`

This version documents the auth flow change from magic-link sign-in to email/password authentication.

It updates:

- auth control responsibilities for email/password sign-in,
- account creation responsibilities in the app shell,
- auth hook responsibilities for `signInWithPassword()` and `signUpWithPassword()`,
- Supabase redirect URL wording to focus on email confirmation rather than passwordless login,
- known technical debt now that cloud persistence remains the next backend step.

This update changes the auth UI and auth hook behaviour only. It does not move saved passages, practice attempts, or personal-best data to Supabase.

## `260706.1.c`

This version documents the first Supabase auth UI wiring.

It updates:

- the current file tree to include `src/app/components/AuthControls.tsx`,
- page shell responsibilities to include app-shell auth controls,
- auth control responsibilities for magic-link sign-in and sign-out,
- auth hook responsibilities now that it exposes sign-in and sign-out actions,
- Supabase Auth redirect URL requirements for local development and Vercel,
- known technical debt and likely next backend steps now that sign-in UI exists.

This update adds authentication UI only. It does not move saved passages, practice attempts, or personal-best data to Supabase.

## `260706.1.b`

This version documents the Supabase auth session hook.

It updates:

- the current file tree to include `src/domain/auth/useAuthSession.ts`,
- key file responsibilities for observing Supabase Auth session state,
- auth domain responsibilities now that session state exists,
- known technical debt to distinguish session state from sign-in UI and cloud persistence,
- likely next backend steps toward sign-in and sign-out UI.

This update adds session observation only. It does not render auth UI, sign users in, or move saved passages out of `localStorage`.

## `260706.1.a`

This version documents the Supabase database relationship diagram after the initial schema was run.

It updates:

- the backend database section with a Mermaid ER diagram,
- the schema status to record that the SQL has been run in Supabase,
- the known technical debt to focus next on app-side auth and cloud persistence,
- likely next backend steps to verify tables/policies before wiring UI.

This update is documentation-only. It does not change frontend runtime behaviour.

## `260705.1.e`

This version documents the initial Supabase schema and Row Level Security setup.

It updates:

- the file tree to include `supabase/schema.sql`,
- key file responsibilities for the executable setup SQL,
- database documentation to point to the version-controlled schema,
- Row Level Security documentation now that concrete policies are defined,
- known technical debt to note that the schema still needs to be run and verified in Supabase,
- likely next backend steps after schema creation.

This update adds setup SQL only. It does not run the schema against Supabase and does not change frontend runtime behaviour.

## `260705.1.d`

This version documents the first auth-domain Supabase helper.

It updates:

- the current file tree to include `src/domain/auth/checkSupabaseConnection.ts`,
- key file responsibilities for the manual Supabase Auth session check,
- domain responsibilities to distinguish the raw shared Supabase client from auth-facing app logic,
- the planned migration strategy to keep Supabase connection code in `shared/lib` and auth behaviour in `domain/auth`,
- known technical debt and likely next steps now that a manual connection helper exists.

This update adds a helper only. It does not wire Supabase into the UI, sign users in, create tables, or change saved-passage persistence.

## `260705.1.c`

This version updates Supabase key terminology for the current API key model.

It updates:

- `.env.example` from `VITE_SUPABASE_ANON_KEY` to `VITE_SUPABASE_PUBLISHABLE_KEY`,
- the Supabase browser client to read the publishable key environment variable,
- backend documentation to describe publishable keys for browser use,
- backend documentation to describe secret keys as frontend-forbidden server-side credentials.

This update aligns the project with Supabase's current publishable/secret key naming while keeping runtime behaviour unchanged.

## `260705.1.b`

This version documents the Supabase client configuration commit.

It updates:

- the tech stack notes to include the installed Supabase JavaScript client,
- the current file tree to include `.env.example` and `src/shared/lib/supabaseClient.ts`,
- key file responsibilities for the browser-safe Supabase client,
- planned environment variable guidance for local `.env.local` and Vercel,
- known technical debt to clarify that auth, RLS policies, and cloud persistence are not implemented yet,
- likely next backend steps now that the client configuration exists.

This update documents the client configuration only. Runtime saved passages, practice stats, and Bible data still use the existing local behaviour.

## `260705.1.a`

This version documents the planned Supabase backend foundation.

It updates:

- the tech stack notes to record Supabase/Postgres as the planned backend direction,
- the architecture documentation with a planned backend flow from Vercel-hosted frontend to Supabase Auth and Postgres,
- the initial backend scope for auth, cloud saved passages, practice attempts, guest localStorage, and local import,
- the out-of-scope backend items for the first phase, including hosted Bible text and custom Node/Express APIs,
- planned Vite/Supabase environment variables,
- the initial database table design for `profiles`, `saved_passages`, and `practice_attempts`,
- the initial Row Level Security policy shape,
- the migration strategy for keeping existing repository and service boundaries,
- the architecture diagram with planned Supabase dependencies,
- known technical debt, confirmed product decisions, and likely next backend steps.

This update is documentation-only. It prepares the branch for incremental Supabase setup work without changing runtime behaviour.

## `260704.1.b`

This version documents Vercel deployment readiness.

It updates:

- the README deployment section with the Vercel build, output, install, and environment variable settings,
- the architecture documentation to include `vercel.json`,
- deployment notes explaining the SPA route rewrite for hosted browser routes,
- known technical debt now that Vercel configuration exists,
- the stale saved-passage removal note to clarify that confirmation exists but undo does not.

This update documents the `Add Vercel SPA routing config` commit and prepares the app for hosted Vercel verification.

## `260704.1.a`

This version documents the featured passage content and category cleanup branch.

It updates:

- the README feature list to mention focused featured themes,
- Home behaviour to note the balanced desktop category grid,
- featured-passage domain wording to describe focused category derivation,
- data documentation to record 22 curated featured passages,
- the current broad featured theme set,
- confirmed product decisions to keep featured themes broad and navigational,
- known technical debt to clarify that categories are generated from featured themes.

This update documents the friend-suggested passage additions, theme consolidation, and Home category grid balancing.

## `260626.1.a`

This version documents the structural refactor from feature folders to app, pages, domain, and shared layers.

It updates:

- the high-level architecture description to explain the page/domain/shared split,
- the current file tree after moving page UI into `src/pages`,
- the current file tree after moving app logic into `src/domain`,
- the current file tree after moving generic UI, utilities, and types into `src/shared`,
- key file paths for `Button`, `verseService`, and shared type files,
- responsibilities for page folders, domain modules, and shared helpers,
- the architecture diagram to replace old `features/*` nodes with `domain/*` and `pages/*` nodes,
- the README architecture summary.

This update documents the refactor only. It does not add product behaviour.

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
