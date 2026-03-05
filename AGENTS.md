# AGENTS.md

## Cursor Cloud specific instructions

**Project:** Tosca — a personal portfolio/blog website built with Next.js 16, TypeScript, Tailwind CSS v4, and Supabase.

### Services

| Service | Description | How to run |
|---------|-------------|------------|
| Next.js App | Single service — serves frontend + API routes + admin CMS | `npm run dev` (port 3000) |
| Supabase | External hosted PostgreSQL + storage (not local) | Requires `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` env vars |

### Commands

- **Lint:** `npx eslint .` — pre-existing warnings/errors in the codebase (7 errors, 8 warnings from react-hooks rules); these are not environment issues.
- **Build:** `npm run build`
- **Dev server:** `npm run dev`

### Environment variables

The app requires a `.env.local` file at the project root with:
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — Supabase anonymous key (respects RLS)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (bypasses RLS)
- `ADMIN_PASSWORD` — Password for `/admin` panel login

Without real Supabase credentials, the homepage (`/`), travel page (`/travel`), work page (`/work`), and admin login (`/admin`) still render. Pages that fetch data from Supabase (athenaeum, articles, etc.) will show errors.

### Gotchas

- Node.js v22+ is required (the VM comes with v22.22.0).
- The package manager is **npm** (lockfile: `package-lock.json`).
- The build succeeds even with placeholder Supabase credentials; only runtime data-fetching pages fail.
- No git hooks, CI/CD pipelines, or setup scripts exist in this repo.
- SQL schema files in `/supabase/` are meant to be run manually in the Supabase SQL Editor, not locally.
- The admin panel at `/admin` uses cookie-based auth (`admin_session`). After login it redirects to `/admin/articles`. Navigation: Articles, Notes, Books, Cities.
- Content created via admin with status "published" is immediately visible on the public Athenaeum page (`/athenaeum`).
- The `.env.local` file is gitignored. When secrets are injected as environment variables, write them to `.env.local` before starting the dev server so Next.js picks them up.
