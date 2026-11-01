# AlumniConnect Backend

Express + MongoDB API for the AlumniConnect React frontend.

## Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

MongoDB must be running locally, or `MONGO_URI` must point to a MongoDB Atlas database. The API uses port `5001` by default because macOS commonly reserves port `5000`.

For a temporary local demo without installing MongoDB, set `USE_MEMORY_DB=true`. Data will be cleared when the backend process stops.

Load demo users and content:

```bash
npm run seed
```

Demo login: `admin@alumconnect.test` or `ananya@alumconnect.test` with password `password123`.

## API groups

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/alumni`
- `GET /api/alumni/locations`
- `GET /api/alumni/connections`
- `POST /api/alumni/:id/connect`
- `PUT /api/alumni/me`
- `GET /api/mentorship/mentors`
- `GET /api/mentorship/requests`
- `POST /api/mentorship/request`
- `POST /api/mentorship/requests/:id/respond`
- `GET|POST /api/jobs`
- `POST /api/jobs/:id/apply`
- `POST /api/jobs/:id/refer`
- `GET|POST /api/events`
- `POST /api/events/:id/register`
- `POST /api/mentorship/requests/:id/respond`
- `GET|POST /api/messages/:userId`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `GET /api/admin/stats`
- `GET /api/admin/verification`

Protected endpoints expect `Authorization: Bearer <token>`.