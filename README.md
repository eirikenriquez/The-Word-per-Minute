# The Word per Minute

A Bible passage typing practice app built with React, TypeScript, Vite, Tailwind CSS, Headless UI, and Supabase.

The app helps users discover scripture, practise typing curated passages, read Bible chapters, and save passages for later practice.

## Current Features

- Featured passage typing practice
- Curated featured passages grouped into focused themes
- Inline passage typing surface with fixed-height automatic scrolling
- WPM and accuracy tracking
- Collapsible Practice setup controls and a compact live-metrics summary
- Completion overlay with final metrics, next-passage action, reflection modal, and cloud-save feedback
- Signed-in all-time progress summary with paginated practice history and passage reflections
- Bible chapter reader with verse selection
- Saved passage library with an empty state, search, filters, inline errors, mutation feedback, and Bible/Practice actions
- Supabase email/password accounts for syncing saved passages
- Guest saved passages for signed-out users through local browser storage
- Warm light and dark themes with semantic color tokens
- Branded navigation, contextual action icons, and an adaptive favicon
- Branded footer with Bible attribution and local-data notice
- Responsive page layouts

## Run Locally

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Then open the local URL shown in the terminal, normally `http://localhost:5173`.

## Checks

```powershell
npm run lint
npm run build
```

## Deployment

The app is configured for Vercel as a Vite single page app.

Use these Vercel build settings:

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Environment Variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`

`vercel.json` rewrites all routes to `index.html` so direct links and refreshes work for `/practice`, `/bible`, `/library`, and `/profile`.

## Project Documentation

- Current architecture and file structure: [`docs/documentation.md`](docs/documentation.md)
- Documentation history: [`docs/update-notes.md`](docs/update-notes.md)

## Architecture

The source is organised around `app`, `pages`, `domain`, and `shared` layers:

- `app` wires routing, shell UI, navigation, and cross-page coordination.
- `pages` owns route-level screens and page-specific visual components.
- `domain` owns Bible, Practice, featured-passage, and saved-passage logic.
- `shared` owns generic UI primitives, utilities, and shared TypeScript types.

## Data and Accounts

The app currently reads local public-domain Bible data from the repository.

Signed-out guests can save passages in browser storage. Signed-in users save passages, completed practice attempts, and passage reflections to Supabase so their library and progress can sync across sessions.
 
