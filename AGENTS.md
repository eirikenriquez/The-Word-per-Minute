# The Word per Minute - Agent Instructions

## Project Overview

The Word per Minute is a Bible verse typing practice web app. The goal is to help users practise typing while engaging with Bible verses.

Keep the project simple, clean, and beginner-friendly. The current priority is building a strong MVP before adding backend features.

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Local JSON data for verses
- localStorage for saved stats and personal bests

## MVP Scope

The MVP should include:

- A typing practice screen using Bible verses
- Local verse data stored in `src/data/verses.json` or a similar local data file
- A typing input area
- Real-time character matching or progress tracking
- WPM calculation
- Accuracy calculation
- Completion state when the verse is finished
- Start and reset controls
- A verse picker or random verse option
- localStorage stats, such as personal best WPM and accuracy
- Responsive layout
- Basic dark mode support if already set up

## Future Features

Do not add these unless specifically asked:

- Backend API
- User accounts
- Database
- Authentication
- Cloud sync
- Bible API integration
- Leaderboards
- Complex analytics
- Payment features

## Coding Style

- Prefer clear, readable React components.
- Use TypeScript types where helpful.
- Avoid huge components; split UI and logic when it becomes messy.
- Keep naming simple and descriptive.
- Avoid adding unnecessary dependencies.
- Use Tailwind utility classes consistently.
- Keep the UI clean, modern, and not too cluttered.

## Suggested Folder Structure

Use or preserve a structure similar to this:

```txt
src/
  components/
  data/
    verses.json
  hooks/
  pages/
  types/
  utils/
```
