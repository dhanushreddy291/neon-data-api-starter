# Neon Notes Starter

<picture>
	<source media="(prefers-color-scheme: dark)" srcset="https://neon.com/brand/neon-logo-dark-color.svg">
	<source media="(prefers-color-scheme: light)" srcset="https://neon.com/brand/neon-logo-light-color.svg">
	<img width="250px" alt="Neon logo" src="https://neon.com/brand/neon-logo-dark-color.svg">
</picture>

### Vite Starter with Neon Auth, Neon Data API, React Router, and Drizzle ORM

A production-ready starter for building authenticated React apps with Neon.

---

This template gives you a complete baseline for shipping fast with Neon Auth and Neon Data API in a pure client-side Vite app. It includes a real notes workflow (create, edit, share, and browse team notes), protected routes, schema management with Drizzle, and a polished UI built with shadcn/ui.

## Key Features

- Neon Auth integration with ready-to-use sign-in, sign-up, and account routes.
- Neon Data API client setup for typed CRUD operations from React.
- Protected route layout using React Router v7 and Neon auth guards.
- Notes demo with personal notes, team-shared notes, autosave editor, and delete flow.
- Drizzle ORM schema and migrations for repeatable database setup.
- Row-level security policies for user-scoped and shared note access.
- Modern UI foundation with Tailwind CSS v4 and shadcn/ui components.

## Tech Stack

- Framework: [React 19](https://react.dev/) + [Vite 7](https://vite.dev/)
- Routing: [React Router v7](https://reactrouter.com/)
- Database: [Neon Postgres](https://neon.com/)
- Auth + Data API: [@neondatabase/neon-js](https://www.npmjs.com/package/@neondatabase/neon-js)
- ORM + Migrations: [Drizzle ORM](https://orm.drizzle.team/) + [drizzle-kit](https://orm.drizzle.team/docs/kit-overview)
- UI: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- Language: [TypeScript](https://www.typescriptlang.org/)

## Get Started

### Prerequisites

Before you begin, make sure you have:

1. A [Neon account](https://console.neon.tech).
2. [Node.js](https://nodejs.org/) 20+ installed.
3. npm (bundled with Node.js).

### 1. Clone and install

```bash
git clone https://github.com/dhanushreddy291/neon-data-api-starter.git
cd neon-data-api-starter
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```bash
touch .env
```

Add the following values:

```env
VITE_NEON_AUTH_URL=
VITE_NEON_DATA_API_URL=
DATABASE_URL=
```

Variable details:

- `VITE_NEON_AUTH_URL`: Neon Auth endpoint used by the React client.
- `VITE_NEON_DATA_API_URL`: Neon Data API endpoint used for table queries/mutations.
- `DATABASE_URL`: Postgres connection string for Drizzle migrations.

### 3. Configure Neon project

1. Create a Neon project in the [Neon Console](https://console.neon.tech).
2. Enable Neon Auth for the project.
3. Copy your Auth URL and Data API URL into `.env`.
4. Copy your Postgres connection string into `DATABASE_URL`.

### 4. Run database migrations

```bash
npm run db:migrate
```

This applies the Drizzle migrations under the `drizzle/` folder and sets up both auth-related and app tables.

### 5. Start the app

```bash
npm run dev
```

Open `http://localhost:5173`.

- Landing page: `/`
- Auth pages: `/auth/sign-in`, `/auth/sign-up`
- Notes dashboard (protected): `/notes`
- Team notes (protected): `/shared`

## Available Scripts

- `npm run dev`: Start Vite development server.
- `npm run build`: Type-check and build for production.
- `npm run preview`: Preview production build locally.
- `npm run lint`: Run ESLint.
- `npm run typecheck`: Run TypeScript checks.
- `npm run format`: Format TypeScript files with Prettier.
- `npm run db:generate`: Generate Drizzle migration files from schema changes.
- `npm run db:migrate`: Apply migrations to the target database.

## Project Structure

```text
src/
├── App.tsx                    # Route config + protected notes layout
├── main.tsx                   # NeonAuthUIProvider + app bootstrap
├── neon.ts                    # Neon client (auth + data API)
├── types.ts                   # Database type definitions for Data API
├── db/
│   ├── schema.ts              # Drizzle schema + RLS policies
│   └── relations.ts
├── components/
│   ├── layout/Sidebar.tsx     # App navigation and user controls
│   └── ui/                    # shadcn/ui primitives
└── pages/
		├── Landing.tsx            # Marketing landing page
		├── Auth.tsx               # Neon Auth UI route wrapper
		├── Account.tsx            # Neon account management UI
		├── Dashboard.tsx          # Personal notes list + create/search
		├── NoteEditor.tsx         # Editor with autosave/share/delete
		└── TeamNotes.tsx          # Shared notes browsing view
```

## How It Works

### Authentication

- `NeonAuthUIProvider` is initialized in `src/main.tsx`.
- Auth screens are rendered via Neon UI components in `src/pages/Auth.tsx` and `src/pages/Account.tsx`.
- Protected app routes use `SignedIn` and `RedirectToSignIn` in `src/App.tsx`.

### Data Access

- A single Neon client is created in `src/neon.ts` with both auth and data API URLs.
- App pages query and mutate `notes` directly with `neon.from("notes")` patterns.
- Typed mapping is enforced through `src/types.ts` and `src/db/schema.ts` note types.

## Row-Level Security (RLS)

This starter uses PostgreSQL Row-Level Security so access control is enforced by the database, not only by client code.

With Drizzle, policies are defined in the table schema using `pgPolicy(...)` (see `src/db/schema.ts`). This maps directly to Postgres policies and keeps security rules versioned with your schema and migrations.

### What `pgPolicy` is

`pgPolicy` is Drizzle's schema API for declaring a Postgres policy on a table. In this project, each notes policy includes:

- `as`: Policy type (`permissive` or `restrictive`). Current schema uses `permissive`.
- `for`: Command scope (`select`, `insert`, `update`, `delete`, or `all`).
- `to`: Roles the policy applies to. Current schema uses `public`.
- `using`: Predicate for existing rows (read eligibility and row match for update/delete).
- `withCheck`: Predicate for rows being inserted or updated.

In practical terms:

- `using` answers "can this existing row be targeted?"
- `withCheck` answers "is this new/updated row valid to write?"

### Current notes-table policy behavior

The `notes` table in `src/db/schema.ts` currently defines four policies:

| Operation | Policy | Rule | Result |
| --- | --- | --- | --- |
| `SELECT` | `notes_select` | `(auth.uid() = owner_id) OR (is_shared = true)` | Users can read their own notes and shared notes. |
| `INSERT` | `notes_insert` | `withCheck: auth.uid() = owner_id` | Users can only create notes owned by themselves. |
| `UPDATE` | `notes_update` | `using: auth.uid() = owner_id` and `withCheck: auth.uid() = owner_id` | Users can only edit their own notes and cannot transfer ownership through update. |
| `DELETE` | `notes_delete` | `using: auth.uid() = owner_id` | Users can only delete their own notes. |

Additional schema details that support this model:

- `owner_id` defaults to `auth.uid()`, which aligns inserted rows with the authenticated user.
- Shared visibility is represented by `is_shared`.
- Ownership is tied to Neon Auth users through a foreign key to `neon_auth.user`.

### What the current schema allows

- Owner-only writes: create, edit, and delete are limited to the note owner.
- Controlled sharing: non-owners can only read notes when `is_shared = true`.
- Safe default ownership: new notes are automatically attributed to the active auth identity.

### Natural ways to extend this model

1. Team or organization permissions
Add `team_id`/`organization_id` and include membership checks in `using` predicates so members can read or collaborate on team notes.

2. Role-based authoring
Store a role (owner/editor/viewer/admin) and allow updates/deletes only for editor/admin roles while keeping broader read access.

3. Visibility states beyond boolean sharing
Replace `is_shared` with a status field (for example `private`, `team`, `public`) and map select policies to each visibility level.

4. Soft delete support
Add `deleted_at` (or `is_deleted`) and include `deleted_at IS NULL` in read policies while retaining owner/admin restore workflows.

5. Auditing and governance
Add immutable audit fields (`created_by`, `updated_by`) and corresponding checks for stricter compliance requirements.

### Drizzle RLS notes

- Drizzle policy declarations are table-scoped by design and compile to SQL in migrations.
- If you add policies to a table in Drizzle, RLS is handled as part of that policy-driven model.
- Keep client-side checks for UX, but treat database policies as the source of truth for access control.

## Customization Guide

### Add new app tables

1. Update `src/db/schema.ts`.
2. Run `npm run db:generate`.
3. Run `npm run db:migrate`.
4. Add corresponding types (if needed) in `src/types.ts`.

### Extend auth providers

The starter currently enables Google in `src/main.tsx`:

```tsx
social={{ providers: ["google"] }}
```

Update this list to match the providers configured in your Neon Auth project.

### Build additional protected features

Use the existing notes pages as patterns for:

- Session-aware data fetching
- Route protection
- Mutations with optimistic UX and loading states

## Deployment Notes

This is a client-side Vite app, so you can deploy to any static host (for example Vercel, Netlify, Azure Static Web Apps, or Cloudflare Pages).

Before deploying:

1. Set production environment variables:
	 - `VITE_NEON_AUTH_URL`
	 - `VITE_NEON_DATA_API_URL`
2. Set `DATABASE_URL` in your migration/CI environment.
3. Add your deployed domain to Neon Auth trusted origins and redirect settings.
4. Run `npm run db:migrate` against your production database.

## Learn More

- [Neon Auth docs](https://neon.com/docs/auth/overview)
- [Neon Data API with neon-js](https://neon.com/docs/serverless/serverless-driver)
- [Drizzle ORM docs](https://orm.drizzle.team/)
- [Drizzle RLS docs](https://orm.drizzle.team/docs/rls)
- [React Router docs](https://reactrouter.com/home)
- [Tailwind CSS docs](https://tailwindcss.com/docs)
