# Data, Storage, and Security

This document explains where application data lives, who owns it, and how access is protected. It describes the intended data boundaries rather than duplicating every implementation detail.

The executable source of truth for the current cloud schema, constraints, indexes, grants, database functions, and Row Level Security policies is [`supabase/schema.sql`](../supabase/schema.sql). Product priorities and future work live in [`product-status.md`](product-status.md).

## Data Landscape

The application uses three data locations:

```mermaid
flowchart LR
  browser["React app in the browser"]
  content["Bundled Bible and featured-passage JSON"]
  local["Browser localStorage"]
  auth["Supabase Auth"]
  database["Supabase Postgres with RLS"]

  content --> browser
  browser --> local
  browser --> auth
  browser --> database
```

- Bundled JSON contains public scripture and curated passage data.
- Browser `localStorage` contains saved passages belonging to the current guest browser.
- Supabase Auth owns accounts and sessions.
- Supabase Postgres contains signed-in users' profiles, saved passages, practice attempts, and reflections.

Bible text is not currently uploaded to Supabase. The first cloud-data phase is limited to user-owned information.

## Trust Boundary and Configuration

The Vite application communicates directly with Supabase from the browser. This is an intentional architecture: database access is protected through authentication, table grants, and Row Level Security rather than by hiding the browser client.

The frontend requires:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Vite exposes variables prefixed with `VITE_` to browser code. The Supabase publishable key is designed for this use and may be configured in local development and Vercel.

Supabase secret keys provide privileged backend access and must never be:

- prefixed with `VITE_`,
- added to frontend code,
- committed to the repository,
- or configured for the client-side Vercel build.

`.env.example` records required variable names without values. Real local values belong in `.env.local`, which is excluded by the repository's `*.local` ignore rule.

## Data Ownership by Session

The active saved-passage store depends on authentication state:

| Session | Saved passages | Practice history |
| --- | --- | --- |
| Signed out | Current browser's `localStorage` | Not persisted |
| Signed in | Current user's Supabase rows | Current user's Supabase rows |

Guest and account data are deliberately separate:

- Signing in does not silently upload or merge local saved passages.
- The app clears the previous store's in-memory list before loading the newly active store.
- Local passages are not shown while signed in, avoiding records that the active cloud store cannot edit or delete.
- A future import flow must be explicit and should handle duplicates before writing to the account.

## Cloud Data Model

```mermaid
erDiagram
  AUTH_USERS ||--|| PROFILES : owns
  AUTH_USERS ||--o{ SAVED_PASSAGES : saves
  AUTH_USERS ||--o{ PRACTICE_ATTEMPTS : completes
  SAVED_PASSAGES ||--o{ PRACTICE_ATTEMPTS : can_reference

  AUTH_USERS {
    uuid id PK
  }

  PROFILES {
    uuid id PK, FK
    text display_name
    timestamptz created_at
    timestamptz updated_at
  }

  SAVED_PASSAGES {
    uuid id PK
    uuid user_id FK
    text passage_identity
    text user_metadata
    timestamptz created_at
    timestamptz updated_at
  }

  PRACTICE_ATTEMPTS {
    uuid id PK
    uuid user_id FK
    uuid saved_passage_id FK
    text featured_passage_id
    text passage_identity
    integer typing_metrics
    text reflection
    timestamptz completed_at
  }
```

The grouped fields in this conceptual diagram represent several columns in the SQL schema. They are intentionally summarised here to keep the diagram readable.

### Profiles

Each Supabase Auth user receives one matching `profiles` row. A database trigger creates it when the account is created. `display_name` is optional, so a newly created profile may validly contain `null` until profile editing is added.

Deleting the Auth user cascades to the profile and other user-owned rows.

### Saved passages

`saved_passages` stores one user's saved passage identity, display metadata, translation information, exact verse selection, source, and timestamps.

The database prevents the same user from saving the same translation, book, chapter, range, and selected-verse combination more than once. Different users can independently save the same passage.

### Practice attempts

`practice_attempts` stores completed typing metrics and the passage identity needed to understand the attempt later. Each attempt contains at least one source reference: a saved passage, a featured passage, or both. A saved-passage reference becomes `null` if that saved passage is later deleted, preserving the historical attempt itself.

Reflections remain nullable and can be added or changed after completion. Attempts currently have no browser-accessible delete operation.

### Practice summary

`get_practice_attempt_summary()` calculates all-time completed attempts, reflection count, best WPM, and average accuracy for the authenticated user. It runs with the caller's permissions, so the existing RLS policies continue to limit its data.

Profile history is loaded separately in pages of 20 recent attempts. Pagination limits the amount rendered at once without limiting the all-time summary.

## Row Level Security

RLS is enabled for every user-owned public table. Access requires both a Postgres grant and an applicable RLS policy:

- Grants determine which table operations the authenticated role may attempt.
- RLS determines which rows the current authenticated user may access.

Current policy intent:

| Data | Allowed operations |
| --- | --- |
| Own profile | Select, insert, and update |
| Own saved passages | Select, insert, update, and delete |
| Own practice attempts | Select and insert |
| Own practice reflection | Update the `reflection` column |

The policies compare `auth.uid()` with the row owner. A publishable key without an authenticated user does not grant access to another user's data.

Practice-attempt updates are intentionally narrower than the row-level policy alone: the authenticated role receives column-level update permission for `reflection`, not general update permission for stored metrics.

## Frontend Storage Boundaries

UI components do not call `localStorage` or Supabase persistence directly. Domain hooks depend on store contracts, and the active implementation is selected outside the visual components.

### Saved passages

```mermaid
flowchart TD
  ui["Page and UI components"] --> hook["useSavedPassages"]
  hook --> contract["SavedPassageStore"]
  contract --> local["localSavedPassageStore"]
  contract --> cloud["supabaseSavedPassageStore"]
  local --> browser["localStorage"]
  cloud --> table["Supabase saved_passages"]
```

This boundary keeps list, add, edit, and remove behaviour consistent while allowing guest and account persistence to remain different.

### Practice attempts

```mermaid
flowchart TD
  ui["Practice and Profile pages"] --> hook["usePracticeAttempts"]
  hook --> contract["PracticeAttemptStore"]
  contract --> cloud["supabasePracticeAttemptStore"]
  cloud --> table["Supabase practice_attempts and summary RPC"]
```

Completed signed-in attempts are sent to the cloud store. Attempt-save, history, reflection, pagination, and summary failures are kept as separate domain states so one failure does not incorrectly invalidate unrelated data.

A failed history save does not turn a completed typing session into a failed session. A reflection cannot be attached until the corresponding cloud attempt exists.

## Bundled Content

The repository currently provides:

```txt
src/data/
  featuredPassages.json
  translations.json
  bibles/
    web/
      manifest.json
      books/
        Gen.json
        Exod.json
        ...
```

- `featuredPassages.json` contains curated passage identities and broad themes.
- `translations.json` describes translations available to the reader.
- `bibles/web` contains the local World English Bible manifest and book files.

`src/domain/bible/verseService.ts` provides an API-shaped read boundary over these files. Pages should request scripture through that service rather than importing individual book JSON files.

## Additional Translation Requirements

Adding another translation is not only a UI change. Before scripture moves to hosted storage or another translation is bundled, the project must define:

- licensing and redistribution rights,
- required copyright and attribution display,
- a stable translation identifier,
- book and verse identity across translation-specific differences,
- storage and delivery strategy,
- saved-passage behaviour when a translation becomes unavailable,
- and whether users can practise or reopen a passage in a different translation.

The current saved-passage and practice-attempt records include translation and passage identity fields so this work can remain incremental. They do not yet represent a complete multi-translation content model.

## Authentication URLs

Supabase Auth must allow the environments used by email confirmation and future password recovery flows.

Local development:

```txt
http://localhost:5173
```

Production:

```txt
https://thewordperminute.vercel.app
```

The matching site URL and redirect URLs are configured in the Supabase dashboard rather than in this repository. Changes should be verified in both environments before relying on email links in production.

## Security Invariants

Future changes should preserve these rules:

- Never expose a Supabase secret key to the Vite application.
- Keep RLS enabled for every user-owned table exposed through the Data API.
- Scope every user-owned query and mutation to the authenticated user through policy, not UI assumptions.
- Keep exact database behaviour in version-controlled SQL.
- Keep persistence details behind domain store contracts rather than page components.
- Never merge guest data into an account without an explicit user action and duplicate strategy.
- Do not host or redistribute additional Bible translations until licensing and attribution are resolved.
