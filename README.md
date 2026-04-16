# SkillSync App

A developer-focused portfolio + community feed app built with **React + Vite**, a **dark UI**, and a lightweight **Express** API (served from the same dev server) that also pulls **real public GitHub stats**.

> Note: This repository currently uses a **mock/in-memory backend** for most data. GitHub stats/skills are fetched from the real GitHub public API.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works (Architecture)](#how-it-works-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [GitHub Integration](#github-integration)
- [Skills Extraction (from GitHub)](#skills-extraction-from-github)
- [Posts & Feed](#posts--feed)
- [Theming & UI](#theming--ui)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

### Authentication (Mock)
- Register and login flows.
- JWT-like token stored in `localStorage` (mock token).
- Axios interceptors attach the token to API requests and redirect to `/login` on `401`.

### Profile
- Editable profile info (name, bio, links).
- GitHub connection state shown in the Profile sidebar.
- GitHub stats card (followers, repos, stars, top languages).

### GitHub Integration (Public API)
- Connect via **GitHub username** (no OAuth).
- Fetch real public GitHub stats:
  - Followers
  - Public repo count
  - Total stars across repos
  - Top languages (percentage breakdown)
- Caching to reduce repeated calls.

### Skills
- Skills list visible in the Skills page.
- “Extract”/“Sync” skills derived from GitHub repos:
  - Language skills inferred from repo primary language
  - React inferred via repo name/description and `package.json` dependency checks

### Community Feed
- View global feed posts.
- Create posts with optimistic UI updates.
- Local persistence (posts cached in `localStorage`) and backend sync attempt.

### Pages & Navigation
- `Dashboard`, `Feed`, `Projects`, `Analytics`, `Profile`, `Skills`.
- Placeholder “Coming Soon” routes for `Explore`, `Notifications`, `Messages`, `Bookmarks`, `Lists`.

---

## Tech Stack

**Frontend**
- React 18
- Vite 5
- React Router DOM
- TailwindCSS
- Axios
- lucide-react (icons)

**Backend (Dev + Mock)**
- Express (runs inside `server.js`)
- Vite middleware mode (single server: UI + API)

---

## How It Works (Architecture)

This project runs a **single dev server** on `http://localhost:3000`:

- **Express** serves API endpoints under `/api/*`
- **Vite** serves the React app (and HMR) via middleware

In production build mode:
- `vite build` outputs static assets to `dist/`
- Express serves `dist/` as a static SPA

Key pieces:
- `src/services/api.js`: Axios instance + auth interceptors
- `src/context/AuthContext.jsx`: authentication state + user hydration
- `src/context/PostContext.jsx`: feed post state + localStorage persistence + backend sync
- `server.js`: mock API + GitHub stats/skills fetch logic

---

npm install
npm run dev
to run the app