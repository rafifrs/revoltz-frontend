# ReVoltz Frontend

Web client for ReVoltz - an EV battery second-life platform for workshop operators and buyers. This repository contains the React + Vite frontend that connects to the ReVoltz backend API and AI model service.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Features](#core-features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Routes](#routes)
6. [Quick Start](#quick-start)
7. [Environment Variables](#environment-variables)
8. [API Integration](#api-integration)
9. [Scripts](#scripts)
10. [Notes](#notes)

---

## Architecture Overview

```
User Browser
    |
    v
ReVoltz Frontend (React + Vite, port 5173)
    |
    +--> ReVoltz Backend API (FastAPI, port 8000)
    |      - auth
    |      - inventory
    |      - marketplace
    |      - workshop analytics
    |
    +--> ReVoltz AI Model Service (FastAPI, port 8001)
           - predict-pack
           - predict-cells
           - model metadata
```

---

## Core Features

- Public pages: landing, product, about, partner, marketplace, battery profile
- Authentication flow: register, login, protected routes
- Workshop operations: inventory list, battery detail, dashboard metrics
- AI-powered analysis pages:
  - Pack analysis (`/predict-pack`)
  - Cell analysis (`/predict-cells`)
- Marketplace browsing and battery profile sharing
- Client-side toasts and global error boundary handling

---

## Tech Stack

| | |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | React Router DOM 7 |
| HTTP Client | Axios |
| State Management | Zustand |
| Charts | Recharts |
| UI Icons | Lucide React |
| Styling | Tailwind CSS + custom CSS |
| Linting | ESLint |

---

## Project Structure

```
revoltz-frontend/
|-- src/
|   |-- App.jsx                         # Route tree and protected route setup
|   |-- main.jsx                        # React entry point
|   |-- pages/                          # Screen-level pages
|   |-- components/
|   |   |-- layout/                     # Header/Footer/workshop headers
|   |   |-- routing/                    # ProtectedRoute
|   |   |-- forms/                      # Reusable form controls and analysis forms
|   |   |-- specialty/                  # Domain widgets (battery cards, charts, etc.)
|   |   `-- ui/                         # Primitive UI components and Toast
|   |-- store/
|   |   |-- authStore.js                # Auth/session state
|   |   `-- analysisStore.js            # Analysis page state
|   |-- hooks/
|   |   |-- useAuth.js
|   |   `-- useToast.js
|   `-- utils/
|       |-- api.js                      # Axios client and endpoint map
|       `-- errorHandler.js
|-- public/                             # Static assets
|-- index.html
|-- vite.config.js
|-- tailwind.config.js
|-- postcss.config.js
|-- eslint.config.js
`-- package.json
```

---

## Routes

### Public

- `/`
- `/about`
- `/product`
- `/partner`
- `/marketplace`
- `/battery/:id`
- `/battery-profile/:id`
- `/login`
- `/register`

### Protected (auth required)

- `/dashboard`
- `/pack-analysis`
- `/cell-analysis`
- `/workshop-dashboard`
- `/inventory`
- `/inventory/:id`

---

## Quick Start

Node.js 20+ is recommended.

```bash
# 1) Install dependencies
npm install

# 2) Configure environment
cp .env.example .env
# or create .env manually if .env.example is not present

# 3) Start dev server
npm run dev
```

Open:

```
http://localhost:5173
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Base URL for backend API |
| `VITE_MODEL_API_BASE_URL` | `http://localhost:8001` | Base URL for AI model service |

Example `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_MODEL_API_BASE_URL=http://localhost:8001
```

---

## API Integration

`src/utils/api.js` centralizes request behavior:

- Axios instance with JSON headers and 15s timeout
- Auto-attaches `Authorization: Bearer <token>` from `localStorage`
- Handles `401 Unauthorized` by logging out and redirecting to `/login`
- Splits endpoint targets between backend and model service

Current endpoint map includes:

- Backend:
  - `/auth/login`
  - `/auth/register`
  - `/inventory`
- Model service:
  - `/predict-pack`
  - `/predict-cells`
  - `/model-info`

---

## Scripts

```bash
npm run dev      # Run Vite dev server
npm run build    # Build production bundle
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

---

## Notes

- This app expects both backend and AI model services to be running.
- Protected routes rely on token presence and auth state from `authStore`.
- Public battery verification page is exposed via `/battery-profile/:id` for shareable marketplace trust flows.
