# Vivenu Event Monitor (Skeleton)

Minimal Cloudflare Worker skeleton preserving the structure and cron hooks, with all business logic and external API calls removed. Use this as a clean base to implement the new logic system.

## Endpoints

- `/health` (GET): returns `{ status: "ok" }`.
- `/webhook/event-updated` (POST): accepts requests and returns `{ ok: true }` without side effects.

## Scheduled jobs

Scheduled events are wired to a no-op handler. Cron schedules remain configured in `wrangler.toml`.

## Local development

```bash
npm install
npm run dev
```

## Where to add new logic

- Add HTTP logic under `src/handlers/` and wire routes in `src/index.ts`.
- Add new services under `src/services/` and import from handlers.
- Keep types in `src/types/`.

This skeleton intentionally performs no network calls and requires no secrets to boot.