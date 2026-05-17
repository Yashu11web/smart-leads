# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack + TypeScript.

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Zustand, React Hook Form + Zod
- **Backend**: Node.js, Express, TypeScript, MongoDB + Mongoose
- **Auth**: JWT + bcrypt
- **DevOps**: Docker + Docker Compose

## Features

- JWT Authentication (Register / Login)
- Role-Based Access Control (Admin / Sales)
- Full CRUD for Leads
- Advanced Filtering by Status, Source, Search (debounced), Sort
- Backend Pagination (10 per page)
- CSV Export
- Dark Mode
- Responsive Design

## Quick Start (Local)

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

### 1. Clone & install
```bash
git clone <your-repo-url>
cd smart-leads
npm run install:all
```

### 2. Configure environment
```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and JWT secret

# Root (for Docker)
cp .env.example .env
```

### 3. Run in development
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Docker

```bash
cp .env.example .env
# Edit .env and set JWT_SECRET
docker compose up --build
```
App runs at http://localhost:5173

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /auth/register | Public | Register user |
| POST | /auth/login | Public | Login |
| GET | /auth/me | Protected | Get current user |

### Leads
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /leads | Protected | List leads (paginated) |
| GET | /leads/:id | Protected | Get single lead |
| POST | /leads | Protected | Create lead |
| PUT | /leads/:id | Protected | Update lead |
| DELETE | /leads/:id | Admin only | Delete lead |
| GET | /leads/export | Protected | Export CSV |

### Query Params for GET /leads
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter: New, Contacted, Qualified, Lost |
| source | string | Filter: Website, Instagram, Referral |
| search | string | Search by name or email |
| sort | string | latest (default) or oldest |
| page | number | Page number (default: 1) |
| limit | number | Results per page (default: 10) |

### Response Format
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Project Structure

```
smart-leads/
├── client/
│   └── src/
│       ├── api/          # Axios instances & API calls
│       ├── components/   # Reusable UI components
│       │   ├── auth/
│       │   ├── layout/
│       │   ├── leads/
│       │   └── ui/
│       ├── hooks/        # Custom hooks (useDebounce, useDarkMode)
│       ├── pages/        # Route-level pages
│       ├── store/        # Zustand stores
│       └── types/        # TypeScript interfaces
└── server/
    └── src/
        ├── config/       # DB connection
        ├── controllers/  # Route handlers
        ├── middleware/    # Auth, validation, error
        ├── models/        # Mongoose models
        ├── routes/        # Express routers
        └── types/         # TypeScript interfaces
```

## Default Roles

- **Admin**: Full access — can view all leads, delete any lead
- **Sales**: Can only create/view/edit their own leads

## Deployment

**Backend (Render):** Deploy `server/` as a Node.js web service. Set env vars in dashboard.

**Frontend (Vercel):** Deploy `client/` as a Vite project. Set `VITE_API_URL` if not using proxy.

---
