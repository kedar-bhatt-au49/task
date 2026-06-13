# Smart Spaced-Repetition Vocabulary Builder

A full-stack MERN application that helps users learn vocabulary through spaced repetition. Add words, get definitions from a free dictionary API, and review them on an optimized schedule.

## Tech Stack

- **MongoDB** — Database (with in-memory fallback)
- **Express.js** — Backend framework
- **React (Vite)** — Frontend framework
- **Node.js** — Runtime
- **TailwindCSS** — Styling
- **React Query** — Server state management
- **Helmet** — Security headers
- **express-rate-limit** — API rate limiting
- **express-validator** — Request validation
- **Jest + Supertest** — Backend testing
- **Vitest + React Testing Library** — Frontend testing

## Architecture

### Folder Structure

```
vocab-builder/
├── server/
│   └── src/
│       ├── config/          # DB connection & env validation
│       ├── controllers/     # HTTP request handlers
│       ├── middleware/       # Error handler & validation
│       ├── models/          # Mongoose schemas
│       ├── repositories/    # Data access layer
│       ├── routes/          # Express routes
│       ├── services/        # Business logic & external APIs
│       ├── utils/           # Utility functions
│       └── index.js         # Server entry point
├── client/
│   └── src/
│       ├── api/             # Axios API client
│       ├── components/      # Reusable UI components
│       ├── hooks/           # React Query hooks
│       ├── pages/           # Route pages
│       ├── test/            # Test setup
│       └── App.jsx          # Root component
├── .env.example
└── README.md
```

### Layers

| Layer | Responsibility |
|-------|---------------|
| **Routes** | Define API endpoints, apply validation middleware, wire to controllers |
| **Controllers** | Parse request, call services, send response via next() for error handling |
| **Services** | Business logic, coordinate repositories and external APIs |
| **Repositories** | Data access, query the database with lean() and pagination |
| **Middleware** | Centralized error handling, request validation rules |
| **Models** | Mongoose schema definitions with indexes |

### Request Flow

```
Client → Route → Validation Middleware → Controller → Service → Repository → MongoDB
                                              ↓
                                    Error Handler Middleware → JSON Error Response
```

## Spaced Repetition Logic

| Action | Production Interval | Dev Mode Interval |
|--------|-------------------|-------------------|
| Got It Right | 3 days | 3 minutes |
| Needs Work | 1 day | 1 minute |

Only words where `nextReviewAt <= now` appear in Review Mode.

## Dev Mode

Dev Mode is persisted in MongoDB (survives server restarts). When enabled:

- Review intervals switch from days to minutes
- An "Advance Time" button appears on the Dashboard
- Clicking "Advance Time" makes all words due for review immediately

This allows testing the complete review lifecycle in under 5 minutes.

## Prerequisites

- Node.js >= 18
- npm
- MongoDB (optional — server falls back to in-memory MongoDB)

## Setup Instructions

### 1. Clone and install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure environment

```bash
# From the root directory
cp .env.example server/.env
# Edit server/.env if needed (defaults work with local MongoDB)
```

### 3. Start the app

```bash
# Terminal 1: Start the backend (port 5000)
cd server
npm run dev

# Terminal 2: Start the frontend (port 5173)
cd client
npm run dev
```

The app runs at `http://localhost:5173`. The Vite dev server proxies `/api` requests to the Express backend.

## Production Build

```bash
# Build the frontend
cd client
npm run build

# The built files are in client/dist/
# Serve using a static file server or configure Express to serve them
```

### Production Deployment

```bash
# 1. Set production environment
export NODE_ENV=production
export MONGO_URI=mongodb://your-production-db/vocab-builder
export CLIENT_ORIGIN=https://yourdomain.com
export PORT=5000

# 2. Build the frontend
cd client && npm run build && cd ..

# 3. Start the server (serves client/dist as static files if configured)
cd server && npm start
```

**Deployment Checklist:**
- Ensure `NODE_ENV=production` is set (hides stack traces, enforces env validation)
- Use a managed MongoDB instance (Atlas, etc.) or a replica set
- Set up a reverse proxy (nginx, Caddy) for SSL termination
- Configure proper firewall rules and security groups
- Set up monitoring and log aggregation
- Use a process manager (PM2, systemd) for auto-restart

### Docker Deployment (Optional)

```bash
# Build the Docker image
docker build -t vocab-builder .

# Run the container
docker run -p 5000:5000 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/vocab-builder \
  -e NODE_ENV=production \
  vocab-builder
```

## Test Coverage

### Backend (Jest + Supertest)

- **Unit Tests**: Service layer (WordService, DictionaryService, searchSanitizer)
- **Integration Tests**: Full API endpoint testing with in-memory MongoDB
- **Coverage Target**: 80%+

```bash
cd server
npm run test:coverage
```

### Frontend (Vitest + React Testing Library)

- **Component Tests**: WordForm, Toast, ReviewCard, DevModeToggle
- **Page Tests**: Dashboard, Review page flows
- **Test Coverage**: Loading states, empty states, error states, user interactions

```bash
cd client
npm run test:coverage
```

## Performance Optimizations

- **MongoDB `lean()` queries** — All read operations use `.lean()` for faster document serialization
- **Pagination** — Word list supports page/limit parameters with total count
- **Compound Indexes** — `{ userId, word }` unique index for fast dedup checks; `{ userId, nextReviewAt }` for efficient review queries
- **Sanitized Search** — Regex special characters are escaped to prevent injection and ReDoS attacks
- **Request Size Limits** — JSON body limited to 10kb
- **Dictionary API Timeout** — 5-second timeout with 2 retries to prevent hanging requests

## Running Tests

### Backend Tests

```bash
cd server
npm test            # Run all tests
npm run test:watch  # Watch mode
npm run test:coverage  # With coverage report
```

### Frontend Tests

```bash
cd client
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # With coverage report
```

## API Routes

| Method | Endpoint | Validation | Description |
|--------|----------|-----------|-------------|
| GET | `/health` | None | Health check |
| POST | `/api/words` | `word`: 1-100 chars, letters/spaces/hyphens | Add a word (fetches definition automatically) |
| GET | `/api/words?search=&page=&limit=` | Optional search sanitized | List all words (paginated) |
| GET | `/api/words/review` | None | Get words due for review |
| PUT | `/api/words/:id/review` | `id`: valid MongoID, `gotItRight`: boolean | Submit a review |
| POST | `/api/dev/advance` | None | Advance time (make all words due now) |
| GET | `/api/dev/mode` | None | Get current dev mode status |
| POST | `/api/dev/mode` | `enabled`: boolean | Toggle dev mode |

### Auth

This project uses a hardcoded user ID (`test-user`). No authentication, login, or registration is required. This is intentional per the PRD scope.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://localhost:27017/vocab-builder` | MongoDB connection string |
| `PORT` | `5000` | Server listen port |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |
| `NODE_ENV` | `development` | Environment mode |

## Features

- **Add Word** — Enter any English word; validation ensures clean input; backend fetches definition and example from dictionaryapi.dev with timeout and retry logic
- **Word List** — Browse all saved words with search (regex-injection-proof), definition preview, review count, and next review date
- **Review Mode** — Spaced-repetition flashcards; reveal definition, rate your recall; auto-advances to next word; completion screen when done
- **Dev Mode** — Shorter review intervals (minutes instead of days) for testing; persisted in MongoDB; "Advance Time" button makes all words due immediately
- **Toast Notifications** — Success/error feedback for all actions with auto-dismiss
- **Security** — Helmet headers, rate limiting (100 req/15min), validated CORS, request body size limits, input sanitization
- **Error Handling** — Centralized error middleware with consistent JSON responses; stack traces only in development
- **Responsive Design** — Works on desktop and mobile
- **Graceful Shutdown** — Cleanly closes HTTP server and MongoDB connection on SIGTERM/SIGINT
