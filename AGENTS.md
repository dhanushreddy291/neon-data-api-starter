# Agents

## Stack

- React 19 + TypeScript + Vite 7 + Tailwind CSS v4
- shadcn/ui (style: `radix-vega`, prefix: none)
- Neon Postgres via `@neondatabase/neon-js` (auth + data API)
- Drizzle ORM + drizzle-kit (migrations)
- React Router v7

## Key Commands

```bash
npm run dev          # start dev server
npm run build        # tsc -b && vite build
npm run lint         # eslint .
npm run typecheck    # tsc --noEmit
npm run format       # prettier --write
npm run db:generate  # drizzle-kit generate
npm run db:migrate   # drizzle-kit migrate
```

## Path Aliases

`@/*` maps to `./src/*` (configured in tsconfig.app.json and vite.config.ts).

## Environment Variables

- `VITE_NEON_AUTH_URL` - Neon auth endpoint (client-side)
- `VITE_NEON_DATA_API_URL` - Neon data API endpoint (client-side)
- `DATABASE_URL` - Postgres connection string for drizzle-kit (server-side)

## Database

- Schema: `src/db/schema.ts`
- Drizzle config: `drizzle.config.ts` (loads `.env` via `dotenv/config`)
- Two schemas: `neon_auth` (built-in auth tables) and `public` (app tables)
- The `notes` table uses Row Level Security via `pgPolicy` with `auth.uid()` from Neon

## Code Conventions

- `verbatimModuleSyntax: true` - no type-only imports without `type`
- `noUnusedLocals: true`, `noUnusedParameters: true`
- shadcn components live in `src/components/ui/`
- shadcn config: `components.json` with `@/components`, `@/lib/utils` aliases

## Skills

Two skills are registered in `skills-lock.json`:

- `neon-postgres` - Neon connection, auth, data API guidance
- `shadcn` - shadcn/ui component management
