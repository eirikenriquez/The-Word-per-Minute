# The Word per Minute

A scripture-first typing practice app for slowing down and engaging more closely with Bible passages.

**[Use The Word per Minute](https://thewordperminute.com/)**

This repository contains the application source code, Supabase schema, bundled scripture data, and technical documentation behind the public application.

## Project Status

The Word per Minute is an independently developed personal project currently in public alpha. The core reading, practice, account, and cloud-storage flows are functional, while the product continues to evolve toward a more complete and reliable release.

Current priorities and known limitations are tracked in [`docs/product-status.md`](docs/product-status.md).

## Core Capabilities

- Practise curated or personally saved Bible passages through an inline typing surface.
- Read locally bundled World English Bible chapters and select verse ranges.
- Save passages in the current browser as a guest or sync them through an account.
- Track WPM, accuracy, completed attempts, and all-time account progress.
- Add optional reflections to signed-in practice history.
- Reopen saved passages in their original Bible context.
- Use a keyboard-focused interface with light and dark themes.

## Technology

| Area | Technology |
| --- | --- |
| Application | React, TypeScript, and Vite |
| Routing | React Router |
| Interface | Tailwind CSS, Headless UI, and Heroicons |
| Authentication and cloud data | Supabase Auth and Postgres |
| Hosting | Vercel |

## Local Development

### Requirements

- Node.js compatible with Vite (`^20.19.0 || >=22.12.0`) for local development and builds
- npm
- A Supabase project configured for authentication and account-owned data

Node.js runs the project's development and build tooling. The production application is a client-side React build and does not use a custom Node backend.

### Setup

Install dependencies:

```powershell
npm install
```

Create your local environment file:

```powershell
Copy-Item .env.example .env.local
```

Add the browser-safe values from your Supabase project:

```txt
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Do not expose a Supabase secret key through a `VITE_` environment variable. The publishable key is intended for browser use when account-owned tables are protected by Row Level Security.

In the Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql) to create the account-owned tables, database functions, grants, and Row Level Security policies required by the app.

Configure the Supabase Site URL and allowed redirect URLs for the environment you are using. See [Authentication URLs](docs/data-and-security.md#authentication-urls) for the current local and production values.

Start the development server:

```powershell
npm run dev
```

Open the local URL shown by Vite, normally `http://localhost:5173`.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check and create the production build. |
| `npm run lint` | Run ESLint across the repository. |
| `npm run preview` | Preview the production build locally. |
| `npm run import:bible` | Download and rebuild the bundled public-domain Bible data. This maintenance command replaces the generated WEB data under `src/data/bibles/web`. |

## Repository Structure

```txt
src/app       Application composition, routing, and global shell
src/pages     Route-level screens and page-specific components
src/domain    Product behaviour, hooks, and persistence contracts
src/shared    Generic UI, types, utilities, and infrastructure clients
src/data      Bundled Bible, translation, and featured-passage data
supabase      Postgres schema, functions, grants, and RLS policies
docs          Architecture, data/security, and product documentation
```

## Documentation

- [System architecture](docs/architecture.md)
- [Data storage and security](docs/data-and-security.md)
- [Product status and roadmap](docs/product-status.md)
- [Release history](CHANGELOG.md)

## Production

The public application is hosted on Vercel at [thewordperminute.com](https://thewordperminute.com/). Vercel builds the Vite application into `dist` and uses `vercel.json` to support direct navigation and refreshes across client-side routes.

Production requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the Vercel environment.

## Project Ownership and Contributions

This repository is public for transparency, technical documentation, and development history. It is not currently maintained as a community open-source project, and no open-source licence has been selected.

Contribution and licensing guidelines may be introduced in the future as the project matures.
