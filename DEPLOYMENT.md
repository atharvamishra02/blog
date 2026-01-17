# Deployment Guide for Vercel

This application is ready for deployment on [Vercel](https://vercel.com). Because it uses a database (PostgreSQL) and external services (Google OAuth, Redis), you need to configure environment variables.

## 1. Prerequisites (Database & Redis)

Ensure you have a production-ready PostgreSQL database and Redis instance.

- **PostgreSQL**: You can use **Vercel Postgres** (Recommendation: It has a **Free Tier** and is easiest to set up). Alternatively, use **Neon** (also has a Free Tier) or Supabase.

**Important regarding Docker:** You _cannot_ use your local `localhost` Docker container for the Vercel deployment, as Vercel cannot access your computer. You must create a hosted database using one of the providers above.

- **Redis**: You can use Vercel KV or Upstash.

## 2. Environment Variables

When deploying to Vercel, go to **Settings > Environment Variables** and add the following:

### Database

- `DATABASE_URL`: Your PostgreSQL connection string (e.g., `postgresql://user:pass@host/db`).

### Authentication (JWT)

- `JWT_SECRET`: A long, random string for signing tokens.

### Google OAuth

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your Google Cloud Client ID.
- **Important**: In Google Cloud Console, add your Vercel production domain (e.g., `https://your-app.vercel.app`) to:
  - **Authorized Javascript Origins**
  - **Authorized Redirect URIs**

### Redis (Caching)

- `REDIS_HOST`: Hostname of your Redis instance.
- `REDIS_PORT`: Port (default 6379).
- `REDIS_PASSWORD`: Password.
- `ENABLE_CACHE`: Set to `true` to enable caching. If `false` or missing, the app will work without Redis.

## 3. Build Settings

- **Framework Preset**: Next.js
- **Build Command**: `prisma generate && next build` (Already configured in `vercel.json`)
- **Install Command**: `npm install`

## 4. Post-Deployment

- If your database schema changes, you might need to run migrations. You can do this locally pointing to the production DB, or add a script to run migrations during build (caution advised).
- Verify Google Login works by testing it on the live URL.
