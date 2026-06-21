# The Word per Minute

A Bible passage typing practice app built with React, TypeScript, Vite, and Tailwind CSS.

The app helps users discover scripture, practise typing curated passages, read Bible chapters, and save passages for later practice.

## Current Features

- Featured passage typing practice
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

## Project Documentation

- Current architecture and file structure: [`docs/documentation.md`](docs/documentation.md)
- Documentation history: [`docs/update-notes.md`](docs/update-notes.md)

## Data

The app currently uses local public-domain Bible data and `localStorage`. It does not require a backend, user account, or external Bible API.
 
