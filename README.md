# The Word per Minute

A Bible passage typing practice app built with React, TypeScript, Vite, and Tailwind CSS.

The app helps users discover scripture, practise typing curated passages, read Bible chapters, and save passages for later practice.

## Current Features

- Featured passage typing practice
- Curated featured passages grouped into focused themes
- Fixed-height, automatically scrolling passage view
- WPM and accuracy tracking
- Responsive Practice source controls and a compact live-metrics summary
- Local personal-best statistics
- Bible chapter reader with verse selection
- Saved passage library with search, filters, editing, and Bible/Practice actions
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
- Environment Variables: none required yet

`vercel.json` rewrites all routes to `index.html` so direct links and refreshes work for `/practice`, `/bible`, and `/library`.

## Project Documentation

- Current architecture and file structure: [`docs/documentation.md`](docs/documentation.md)
- Documentation history: [`docs/update-notes.md`](docs/update-notes.md)

## Architecture

The source is organised around `app`, `pages`, `domain`, and `shared` layers:

- `app` wires routing, shell UI, navigation, and cross-page coordination.
- `pages` owns route-level screens and page-specific visual components.
- `domain` owns Bible, Practice, featured-passage, and saved-passage logic.
- `shared` owns generic UI primitives, utilities, and shared TypeScript types.

## Data

The app currently uses local public-domain Bible data and `localStorage`. It does not require a backend, user account, or external Bible API.
 
