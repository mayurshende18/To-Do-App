# 📝 Todo Manager v3 — MERN Stack

A production-grade full-stack Todo application with a modern dark/light UI, categories, keyboard shortcuts, export, activity logging, and more.

---

## ⚡ Quick Start

```bash
# Clone / unzip the project, then:
bash setup.sh          # installs all deps, creates .env

# Terminal 1 — Backend
cd backend && npm start     # → http://localhost:5000

# Terminal 2 — Frontend  
cd frontend && npm start      # → http://localhost:3000
```

> **MongoDB required.** Set `MONGO_URI` in `backend/.env`. Defaults to `mongodb://localhost:27017/todo_db`.

---

## 📁 Project Structure

```
todo-app/
├── backend/
│   ├── server.js                     ← Express app entry point
│   ├── middleware/
│   │   ├── logger.js                 ← Coloured request logger
│   │   ├── validate.js               ← Reusable validation factory
│   │   └── errorHandler.js           ← Global error handler
│   ├── models/
│   │   ├── Task.js                   ← Task schema (priority, dueDate, tags, notes, category)
│   │   └── Category.js               ← Category schema (name, color, icon)
│   ├── controllers/
│   │   ├── taskController.js         ← CRUD + stats + reorder + export
│   │   └── categoryController.js     ← Category CRUD w/ task count
│   └── routes/
│       ├── taskRoutes.js
│       └── categoryRoutes.js
│
└── frontend/src/
    ├── App.js                        ← Root with ErrorBoundary + providers
    ├── index.js
    ├── context/
    │   └── ThemeContext.jsx          ← Dark/light mode (persisted)
    ├── hooks/
    │   ├── useTasks.js               ← All task state + API + logging
    │   ├── useCategories.js          ← Category state + API
    │   └── useKeyboard.js            ← Global keyboard shortcut registration
    ├── services/
    │   └── api.js                    ← Axios wrappers for all endpoints
    ├── components/
    │   ├── TodoForm.jsx              ← Task input (priority, due date, tags, notes, category)
    │   ├── TodoTable.jsx             ← Drag-to-reorder task list with inline editing
    │   ├── StatsBar.jsx              ← Overview stat cards
    │   ├── FilterBar.jsx             ← Search + filter + sort + category + reset
    │   ├── ProgressRing.jsx          ← Animated SVG completion ring
    │   ├── ActivityLog.jsx           ← Floating activity history panel
    │   ├── ExportButton.jsx          ← JSON / CSV export with download
    │   ├── ErrorBoundary.jsx         ← React error boundary
    │   ├── Toast.jsx                 ← Context-based toast notifications
    │   └── modals/
    │       ├── Modal.jsx             ← Reusable modal shell
    │       ├── CategoryModal.jsx     ← Create/delete categories
    │       └── ShortcutsModal.jsx    ← Keyboard shortcuts reference
    └── pages/
        └── Home.jsx                  ← Main page, wires everything together
```

---

## 🔌 REST API Reference

### Tasks

| Method | Endpoint              | Description                         |
|--------|-----------------------|-------------------------------------|
| GET    | /api/tasks            | List tasks (filterable + sortable)  |
| GET    | /api/tasks/stats      | Counts: total, done, pending, overdue |
| GET    | /api/tasks/export     | Download as JSON or CSV (`?format=csv`) |
| POST   | /api/tasks            | Create a task                       |
| PUT    | /api/tasks/reorder    | Bulk reorder `{ orderedIds: [...] }`|
| PUT    | /api/tasks/:id        | Update any task fields              |
| DELETE | /api/tasks/:id        | Delete a task                       |
| DELETE | /api/tasks/completed  | Delete all completed tasks          |

**GET /api/tasks query params:**

| Param     | Values                               |
|-----------|--------------------------------------|
| search    | string (searches task, tags, notes)  |
| priority  | all / low / medium / high            |
| completed | all / true / false                   |
| category  | all / none / `<categoryId>`          |
| sortBy    | order / createdAt / priority / dueDate / task |
| sortDir   | asc / desc                           |

### Categories

| Method | Endpoint           | Description                  |
|--------|--------------------|------------------------------|
| GET    | /api/categories    | List all + task counts       |
| POST   | /api/categories    | Create `{ name, color, icon }` |
| PUT    | /api/categories/:id | Update                      |
| DELETE | /api/categories/:id | Delete + unlink tasks       |

---

## ✨ Feature Overview

### Task Management
| Feature | Detail |
|---------|--------|
| Create  | Text (min 10 chars), priority, due date, tags, notes, category |
| Read    | Server-side filter, search, sort |
| Update  | Inline edit — text, priority, due date; complete toggle |
| Delete  | Per-task with confirmation; bulk-clear completed |
| Reorder | Native HTML5 drag-and-drop, persisted to DB |

### UI / UX
| Feature | Detail |
|---------|--------|
| Dark / Light | Toggle with `Ctrl+T`; persisted in localStorage |
| Stats bar | Total, Done, Pending, Overdue at a glance |
| Progress ring | Animated SVG showing % complete |
| Priority badges | 🔴 High · 🟡 Medium · 🟢 Low with colour coding |
| Due dates | Overdue shown in red; Today highlighted amber |
| Tags | Stored per task, searchable |
| Category filter | Workspace-style grouping |
| Keyboard shortcuts | N, Ctrl+T, Ctrl+F, Ctrl+E, Ctrl+/ |
| Activity log | In-memory event history with timestamp |
| Export | Download tasks as JSON or CSV |
| Toast notifications | Success / Error / Info |
| Loading skeletons | Animated placeholders during fetch |
| Empty state | Context-aware illustration |
| Error boundary | Catches render crashes, shows reload UI |

### Architecture
| Feature | Detail |
|---------|--------|
| Custom hooks | `useTasks`, `useCategories`, `useKeyboard` |
| Contexts | `ThemeContext`, `ToastContext` |
| Middleware | Logger, Validator, ErrorHandler |
| Validation | Frontend (real-time) + Backend (middleware) |
| Optimistic UI | State updated before server confirms |

---

## 🛠 Tech Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18, Tailwind CSS (CDN), Axios |
| Backend  | Node.js 18+, Express 4 |
| Database | MongoDB 6+, Mongoose 8 |
| Fonts    | Syne (display), DM Sans (body) — Google Fonts |

---

## ⌨️ Keyboard Shortcuts

| Key       | Action |
|-----------|--------|
| `N`       | Focus new task input |
| `Ctrl+F`  | Focus search bar |
| `Ctrl+T`  | Toggle dark / light theme |
| `Ctrl+/`  | Show keyboard shortcuts |
| `Ctrl+K`  | Show keyboard shortcuts |
| `Escape`  | Close any open modal |

---

## 🐛 Troubleshooting

**"Failed to connect to backend"** → Ensure `cd backend && npm start` is running on port 5000.

**MongoDB error on start** → Check `MONGO_URI` in `backend/.env`; for local MongoDB ensure `mongod` is running.

**CORS errors** → Both servers must be running. Set `CLIENT_URL` in `.env` if deploying.

**Drag-to-reorder not saving** → Ensure the PUT `/api/tasks/reorder` route is reachable from the frontend.

**Fonts not loading** → Requires internet access; falls back gracefully to system sans-serif.
