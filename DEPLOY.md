Local dev and Vercel deployment notes

1) Install dependencies

Run locally:

```bash
npm install
npm run dev
```

2) Environment variables

- Create `.env.local` in project root for local development (do NOT commit this file):

```
DATABASE_URL="mysql://user:pass@127.0.0.1:4000/movie_reviews"
JWT_SECRET="replace-with-a-strong-random-secret"
```

3) Vercel

- In the Vercel dashboard, open your project, go to Settings → Environment Variables and add `DATABASE_URL` and `JWT_SECRET` with the same values (production values).
- Deploy the project; serverless routes will have access to those variables.

4) Notes

- The project now uses TiDB (MySQL-compatible) directly; the previous `data/db.json` file-based DB and migration script have been removed. Ensure your `DATABASE_URL` and `JWT_SECRET` are set for local and Vercel environments.
