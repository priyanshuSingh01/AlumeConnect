# AlumConnect

## Deploy the backend

The frontend is hosted on Vercel. The backend must also be deployed for
signup/login to work on the public site.

1. Create a MongoDB Atlas cluster and database user, then copy its connection
   string. Allow your Render service to reach the cluster in Atlas Network
   Access.
2. In Render, create a Blueprint deployment from this repository and branch.
   Render will use [`render.yaml`](./render.yaml) to create the API service.
3. When prompted, provide `MONGO_URI` using the Atlas connection string. Keep
   the generated `JWT_SECRET`; do not put either secret in source control.
4. After Render deploys, check `https://<your-render-service>/api/health`.
5. In the Vercel project's Environment Variables, set `VITE_API_URL` to
   `https://<your-render-service>/api`, then redeploy the frontend.

The Render blueprint sets `CLIENT_URL` to `https://alume-connect.vercel.app`.
If the Vercel site uses a different domain, update `CLIENT_URL` in Render to
match it and redeploy the backend.

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

The frontend connects to `http://localhost:5001/api` in development. Set
`VITE_API_URL` in the frontend environment to use another API URL.
