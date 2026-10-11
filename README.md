# exsymation2.0
# University Department Exam Management System

MERN-stack starter architecture for a university department examination workflow.

## Roles
- `CHAIRMAN`: manages teachers, exams, committees, remuneration rules, and broadcasts.
- `COMMITTEE_CHAIRMAN`: manages assigned committee work, examiner assignments, routines, invigilation, and proceedings.
- `TEACHER`: views duties, proceedings, bills, and notifications.

## Structure
- `server/`: Express API, Mongoose models, controllers, services, routes, middleware.
- `client/`: React + Vite frontend with role-aware route scaffolding.
- `docs/`: architecture notes and REST API route listing.

## Prerequisites
Node.js 20+, npm, and a local MongoDB instance or MongoDB Atlas URI.

## Setup
Backend:
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
Update `MONGODB_URI` and generate strong JWT secrets in `server/.env`.

Frontend, in another terminal:
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend: http://localhost:5173
API health check: http://localhost:5000/api/v1/health

## Important
This is a starter scaffold, not a complete production application. Authentication routes and most feature endpoints are placeholders. Implement and test refresh-token rotation, validation, full CRUD, resource-level authorization, scheduling conflict checks, proceedings, remuneration, notifications, and bills before production use. Never commit real `.env` values.
