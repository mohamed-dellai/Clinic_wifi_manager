# Clinic — Next.js + Prisma Starter

This folder contains a minimal Next.js (app router) + Prisma scaffold using SQLite for local development.

Quick start

1. Install (already run in this setup):
   npm install

2. Generate Prisma client and push schema to the database:
   npm run prisma:generate
   npm run prisma:dbpush

3. Start the dev server:
   npm run dev

Files added:
- `app/layout.tsx`, `app/page.tsx` — minimal app router files
- `prisma/schema.prisma` — Prisma schema (SQLite)
- `.env` — contains DATABASE_URL

Notes
- This uses `next@canary` (intended to track Next.js v15 features). If you want a stable Next.js release, change the dependency in `package.json` and reinstall.
