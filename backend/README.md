# Derakhshan Premium API

Layered Express + MongoDB/Mongoose API for the public site and admin console.

## Run locally

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run check
npm run dev
```

The API listens on `http://localhost:4000` by default. MongoDB must be available for the server bootstrap; `/api/health` is available through the Express app and is covered by the smoke test.

## Main endpoints

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/properties`
- `GET /api/properties/:slug`
- `POST /api/leads`
- `GET /api/testimonials`
- `GET /api/settings/public`
- `GET /api/admin/dashboard/summary`

Admin routes require `Authorization: Bearer <access-token>`. Use `npm run seed` with `SEED_ADMIN_PASSWORD` set to create the initial superadmin and public settings.
