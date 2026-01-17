# 🌈 Blogger Baba - Modern Blog Platform

A feature-rich, full-stack blog application built with Next.js 16, featuring category-specific editors, user authentication, Google OAuth, Redis caching, and a stunning animated UI.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=flat-square&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-Cache-red?style=flat-square&logo=redis)

## ✨ Features

### 🎨 Frontend

- **Rainbow-Themed UI** - Stunning animated text and gradient effects
- **Responsive Design** - Mobile hamburger menu with full-screen overlay
- **Category Editors** - Dedicated CKEditor instances for 10+ categories:
  - 💻 Tech
  - 👗 Fashion
  - 🎨 Designing
  - 🏥 Medical
  - ⚖️ Law
  - ⚽ Sports
  - 📚 Education
  - 🍔 Food
  - ✈️ Travel
  - 💰 Finance
- **Video Backgrounds** - Dynamic backgrounds on each page
- **Smooth Animations** - Framer Motion powered transitions

### 🔐 Authentication & Security

- **Google OAuth Login** - One-click sign-in with Google
- **JWT Authentication** - Secure 7-day token expiry with HTTP-only cookies
- **User Registration & Login** - Complete email/password auth flow
- **Profile Management**:
  - Edit profile (name & username)
  - Change password with verification
  - Circular avatar with first letter or Google profile picture
- **Protected Routes** - Authentication-required pages with server-side checks

### ⚡ Performance & Caching

- **Redis Integration** - Lightning-fast data retrieval
- **Smart Cache Strategy**:
  - User data: 1-hour TTL
  - Sessions: 7-day TTL
  - Automatic cache invalidation on updates
- **Performance Gains** - Cached responses reduce database load and improved response times (down to ~5-10ms)

### 🗄️ Database

- **PostgreSQL** - Robust relational database
- **Prisma ORM** - Type-safe database operations
- **Schema**:
  - **User**: Stores profile, auth method (password/Google), and metadata
  - **Post**: Stores content, category, author relation, and published state

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js
- **PostgreSQL**: Local installation or cloud provider (e.g., Neon, Supabase, Railway)
- **Redis**: Local installation or cloud provider (e.g., Redis Cloud, Upstash)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Environment Variables**

   Create a `.env.local` file in the root directory and populate it with your keys:

   ```env
   # Database (PostgreSQL)
   # Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
   DATABASE_URL="postgresql://postgres:password@localhost:5432/blogdb?schema=public"

   # Security
   # Generate a strong secret: openssl rand -base64 32
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Redis Configuration (for Caching)
   # If using local Redis, usage defaults might apply, but explicit config is safer
   REDIS_HOST=your-redis-host.redis-cloud.com
   REDIS_PORT=18577
   REDIS_PASSWORD=your-redis-password
   REDIS_USERNAME=default
   ENABLE_CACHE=true

   # Google OAuth (Get this from Google Cloud Console)
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Database Setup (Prisma)**

   Run the following commands to initialize your database schema:

   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Push schema to database (for development)
   npx prisma db push

   # OR Create a migration (for production-like workflow)
   npx prisma migrate dev --name init
   ```

5. **Start the Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Database & Redis Setup Details

Since this project relies on specific services, here are quick setup guides if you don't have them ready.

### PostgreSQL Setup

1. Install PostgreSQL locally or create a free account on [Neon.tech](https://neon.tech) or [ElephantSQL](https://www.elephantsql.com/).
2. Get your connection string.
3. Replace the `DATABASE_URL` in `.env.local`.

### Redis Setup

1. **Local**: Install Redis (`brew install redis` on Mac, or via WSL on Windows). Start with `redis-server`.
2. **Cloud (Recommended)**: Create a free account on [Redis Cloud](https://redis.com/try-free/).
   - Create a subscription (Free 30MB).
   - Get your **Public Endpoint** (Host:Port) and **Default User Password**.
   - Update `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD` in `.env.local`.

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Navigate to **APIs & Services > Credentials**.
4. Create **OAuth 2.0 Client ID**.
5. Set Application Type to **Web application**.
6. Add Authorized Javascript Origins: `http://localhost:3000` (and your production URL).
7. Copy the **Client ID** into `.env.local` as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.

## 📁 Project Structure

```
my-app/
├── app/
│   ├── api/                   # Backend API Routes
│   │   ├── auth/              # Auth endpoints (login, register, google, etc.)
│   │   └── posts/             # Post management (create, [id] for details)
│   ├── components/            # Reusable React components (Navbar, etc.)
│   ├── context/               # React Context (AuthContext)
│   ├── [category]/            # Dynamic routes for category pages
│   ├── login/                 # Login page
│   ├── register/              # Registration page
│   ├── profile/               # User profile page
│   ├── layout.jsx             # Root layout with Providers
│   └── page.jsx               # Landing page
├── lib/
│   ├── prisma.js              # Database client
│   └── redis.js               # Redis client & helpers
├── prisma/
│   └── schema.prisma          # Database schema definition
├── public/                    # Static assets
└── .env.local                 # Environment variables (local-only)
```

## 🎯 API Routes Overview

| Endpoint             | Method | Description                     |
| -------------------- | ------ | ------------------------------- |
| `/api/auth/register` | POST   | Register a new user             |
| `/api/auth/login`    | POST   | Login with email/password       |
| `/api/auth/google`   | POST   | Login/Register with Google info |
| `/api/posts/create`  | POST   | Create a new blog post          |
| `/api/posts/[id]`    | GET    | Fetch a specific post           |

## 🛠️ Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open visual database editor

## 🤝 Key Libraries

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, Framer Motion
- **Editor**: CKEditor 5
- **Auth**: `jsonwebtoken`, `bcryptjs`, `@react-oauth/google`
- **BackendUtils**: `ioredis` (Redis client), `dotenv`


