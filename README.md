# Rotary E-Club of Greater Nigeria website

Responsive Next.js App Router frontend for the Rotary E-Club of Greater Nigeria. The API is hosted separately; local development uses `http://localhost:3000` by default.

## Run locally

1. Install Node.js 20 or later.
2. Copy `.env.example` to `.env.local`; it is already set to `NEXT_PUBLIC_API_BASE_URL=http://localhost:3000`. Change that value to the deployed API origin at deployment.
3. Run `npm install`, then `npm run dev` and open http://localhost:3001. The frontend uses port 3001 because the API occupies port 3000.
4. Run `npm run build` to create a production build.

## API integration assumptions

The backend’s live Swagger UI at `/api-docs/` documents the following API contract:

- Every response uses `{ success, data, meta? }`; errors may include a `message` and per-field `errors`.
- Public collections: projects, bulletins, officers, past presidents, and president messages. They accept `page`, `limit`, and `search`; pages default to 1 and 10 items. The homepage displays the newest president message from `/api/president-messages`.
- Public detail engagement: project/bulletin comment list and create under `/:id/comments`; reaction counts and toggle under `/:id/reactions`. Comments use `{author_name, body}`. Reactions use `{type, visitor_id}` with types `like`, `love`, `celebrate`, `clap`, `wow`.
- Admin auth: `POST /api/auth/login` accepts `{email,password}` and returns `data.access_token`, `data.refresh_token`, and `data.user`; refresh uses `{refresh_token}` and issues a new session; logout and `/api/auth/me` are admin-only. Admin content create/update/delete and moderation are admin-only.
- Admin CRUD for projects, bulletins, officers, and past presidents uses multipart uploads. Fields are in the admin forms and match Swagger: project `title,date,description,image`; bulletin `title,image,pdf`; officer `full_name,position,display_order?,image`; past president `full_name,year_served,image`. Images are JPEG/PNG/WebP up to 5MB; bulletin PDFs up to 20MB. Updates accept optional fields and replacement files.
- President message management uses `/api/president-messages` with `president_name`, `year_served`, `message`, and a portrait `image`. Admins manage messages at `/admin/content/president-messages`; the homepage displays the newest one with line breaks preserved.
- Admin comment moderation uses `GET /api/comments` and `DELETE /api/comments/:id`.

The client centralizes requests in `src/lib/api.ts`, reads `NEXT_PUBLIC_API_BASE_URL`, unwraps success/error envelopes consistently, refreshes a 401 session with the documented refresh contract, clears invalid sessions, and sends bearer tokens for protected routes. Access and refresh tokens are held in `sessionStorage` for the browser tab; this is not equivalent to HttpOnly cookies. Admin sign-in uses `/api/auth/login`; clubhouse member sign-in uses `/api/clubhouse/auth/login`. The APIs issue separate role-appropriate sessions. Tokens are held in `sessionStorage` for the browser tab; this is not equivalent to HttpOnly cookies.

The API `/health` endpoint returned `{"status":"ok"}` during integration. The live `GET /api/projects` request returned `Database error: Could not find the table 'public.projects' in the schema cache`. That is a backend/Supabase schema issue; the site displays the API error and does not seed fake production content. Verify the `projects` table exists in the API's configured Supabase project/schema and refresh PostgREST's schema cache if the table was just created.

The API documentation includes admin member account CRUD at `/api/clubhouse/members`, authenticated member profile and password endpoints, and authenticated clubhouse articles with nested comments and reactions. These are connected in the clubhouse pages and admin member workspace. The two login pages use their role-specific endpoints. Article and comment ownership controls are shown based on the profile's `id` and `role`, and the API remains authoritative for each mutation.

The homepage About section includes the supplied weekly meeting schedule (Saturdays at 20:30 WAT). Facebook and Instagram links currently open platform searches for the club because official profile URLs were not provided or independently verified. The wordmark is text-based and is not an official Rotary mark; replace it with an approved club logo asset if supplied and preserve its clear space. The hero uses the club-provided local photo at `public/hero-image.jpg`. Primary colors follow the supplied brief (`#17458f`, `#f7a81b`) and interface typography uses Open Sans with Georgia for editorial headings.

## Routes

Public: `/`, `/projects`, `/projects/[id]`, `/officers`, `/past-presidents`, `/bulletins`, `/bulletins/[id]`, `/makeup-card`. The About content is on the homepage at `/#about`; `/about` redirects there. Login chooser: `/login`. Member sign-in and clubhouse: `/clubhouse/login`, `/clubhouse`, `/clubhouse/profile`, `/clubhouse/articles`, `/clubhouse/articles/new`, `/clubhouse/articles/[id]`, `/clubhouse/articles/[id]/edit`. Admin sign-in and workspace: `/admin/login`, `/admin/content`, `/admin/content/projects`, `/admin/content/bulletins`, `/admin/content/club-officers`, `/admin/content/past-presidents`, `/admin/content/president-messages`, `/admin/makeup-requests`, `/admin/makeup-requests/[id]`, `/admin/comments`, `/admin/members`, `/admin/profile`.
