# The Word per Minute Update Notes

Current documentation version: `120626.1.d`
Last updated: 12/06/26

## Update Rule

Only update documentation files when explicitly requested by the project owner.

When documentation changes, include:

- the new version,
- what file or section changed,
- what the update means for the current app architecture.

## Version Format

Documentation versions use this format:

```txt
ddmmyy.major.minor
```

Example:

```txt
120626.1.a
```

- `120626` means 12/06/26.
- `1` means the first major documentation snapshot for that day.
- `a` means the first small revision of that snapshot.

Suggested next versions:

- Small same-day documentation update: `120626.1.e`
- Larger same-day documentation update: `120626.2.a`
- First update on a new day: `ddmmyy.1.a`

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
