# Calendar Task Planner

A fullstack calendar application for creating and organizing tasks with drag-and-drop support.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, styled-components, @dnd-kit
- **Backend**: Node.js, Express, TypeScript, Mongoose
- **Database**: MongoDB

## Features

- Monthly calendar grid (no calendar libraries)
- Inline task creation and editing with color labels
- Drag and drop to reorder tasks within a day
- Drag and drop to reassign tasks between days
- Text search with highlight matching
- Worldwide public holidays via [Nager.Date API](https://date.nager.at)
- Full CRUD persistence in MongoDB

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Configuration

Copy the example env file and adjust if needed:

```bash
cp server/.env.example server/.env
```

Default `MONGODB_URI` points to `mongodb://localhost:27017/calendar-planner`.

### Running

```bash
# Terminal 1 — start the backend
cd server && npm run dev

# Terminal 2 — start the frontend
cd client && npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API requests to the backend on port 3001.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks?from=&to= | Get tasks for a date range |
| POST | /api/tasks | Create a task |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |
| PUT | /api/tasks/reorder | Batch reorder tasks |
| GET | /api/health | Health check |

## Deployment

- **Frontend**: Deploy the `client/` folder to Vercel (`npm run build` produces `dist/`)
- **Backend**: Deploy the `server/` folder to Render, Railway, or any Node.js host
- Set `VITE_API_URL` env var on the frontend to point to the deployed backend URL
