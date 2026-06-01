# Ractysh Group Platform

Premium enterprise website and dynamic CMS foundation for the Ractysh Group.

## Apps

- `apps/web`: Next.js 15 App Router, TypeScript, Tailwind, Framer Motion, GSAP, Lenis.
- `apps/api`: Express, MongoDB, Mongoose, JWT auth, Cloudinary-ready media routes.

## Quick Start

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run dev
```

The website runs on `http://localhost:3000`.
The API runs on `http://localhost:5000`.

If MongoDB is not configured, the API serves seeded in-memory Ractysh content so the site and CMS can still run locally.
