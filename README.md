# AlumConnect

## Run locally

Start the backend and frontend in separate terminals.

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API runs at `http://localhost:5001` by default. MongoDB must be available,
or set `USE_MEMORY_DB=true` in `backend/.env` for temporary local data.

Frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend connects to `http://localhost:5001/api` by default. If the app
shows “API unavailable,” make sure the backend is running and
`http://localhost:5001/api/health` returns a healthy response. Set
`VITE_API_URL` in the frontend environment if the API uses a different URL.
