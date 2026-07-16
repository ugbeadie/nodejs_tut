# Team & Task Manager

A full-stack team and task management app with role-based access control — built while learning Node.js and Express.

Regular members, team owners, and admins each have different permissions throughout the app: creating and assigning tasks, managing team membership, and transferring members between teams are all gated by who's asking, enforced on the backend regardless of what the UI shows.

## Features

- **Auth** — JWT-based authentication with persisted sessions (stays logged in across refresh)
- **Teams** — create teams, add/remove members via username or email search, transfer members between teams (move or copy, with validation against unfinished work)
- **Tasks** — create, edit, delete, reassign, and track status, with priority levels and per-team or cross-team views
- **Role-based access control** — regular members, team owners, and global admins each see and can do different things, enforced independently on the backend
- **Admin tools** — view every team and override membership rules across teams an admin isn't personally part of

## Tech Stack

**Frontend:** React, React Router, Tailwind CSS
**Backend:** Node.js, Express, MongoDB, Mongoose
**Auth:** JWT, bcrypt

## Getting Started

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend root:
```
PORT=7001
CONNECTION_STRING=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
pnpm install
```

Create a `.env` file in the frontend root:
```
VITE_API_BASE_URL=http://localhost:7001/api
```

```bash
pnpm run dev
```

## API Overview

| Resource | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `GET /api/auth/users` |
| Teams | `POST /api/teams/create`, `GET /api/teams/my-teams`, `GET /api/teams/all` (admin), `GET /api/teams/:id`, `POST /api/teams/:id/add-member`, `POST /api/teams/:id/remove-member`, `POST /api/teams/:id/transfer-member` (admin) |
| Tasks | `POST /api/tasks/create`, `GET /api/tasks/my-tasks`, `GET /api/tasks/team/:teamId`, `PATCH /api/tasks/update/:id`, `DELETE /api/tasks/delete/:id`, `PATCH /api/tasks/:id/reassign`, `PATCH /api/tasks/:id/status` |

## What I Learned

This was my first project working with Node, Express, and Mongoose. Along the way I picked up REST API design and route ordering, building permission logic that lives on the backend rather than trusting the frontend, JWT-based session handling, and debugging real issues — including a Mongoose update option that silently returned stale data, a missing null check that could crash the server, and a field-name mismatch between two auth responses that caused permissions to intermittently not appear until a page refresh.
