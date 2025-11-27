# AI_Project — Business Idea Generator

Welcome! This repository contains a small full-stack project that generates business ideas using an AI backend (FastAPI) streaming endpoint and a Next.js frontend that displays streamed ideas in real time.

This README is an interactive, step-by-step guide to get you from zero → running locally (frontend + backend), plus troubleshooting and deployment tips.

---

## Quick overview
- Backend: `backend/` — FastAPI + Uvicorn, streams AI-generated ideas from OpenAI (SSE).
- Frontend: `frontend/` — Next.js (app router) + Tailwind CSS, displays streamed content with `EventSource`.

## Table of contents
- Prerequisites
- Backend: Install & Run
- Frontend: Install & Run
- Run both together (manual)
- Environment variables
- Common errors & troubleshooting
- Optional: Docker (quick example)
- Project structure
- Contributing & License

---

## Prerequisites
- Node.js (18+ recommended) and npm (or Yarn / pnpm)
- Python 3.10+ and `pip`
- An OpenAI API key (or other LLM provider key) for the backend

When in doubt, run these checks:
```bash
node -v
npm -v
python -V
pip -V
```

---

## Backend — Install & Run (step-by-step)
1. Open a terminal and go to the backend folder:
```bash
cd backend
```

2. (Recommended) Create and activate a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate   # macOS / Linux
# .\.venv\Scripts\activate # Windows PowerShell
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in `backend/` with your OpenAI API key (example):
```
OPENAI_API_KEY=sk-...your-openai-key...
```

5. Run the development server with Uvicorn:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

6. Verify the backend is running by opening:
- `http://localhost:8000/` (you may add an index route) or
- hitting the SSE endpoint directly:
```bash
curl -N http://localhost:8000/stream
```

Notes:
- In production, replace `allow_origins=["*"]` in `main.py` with the exact origins for security.
- If you get an OpenAI auth error, ensure `OPENAI_API_KEY` is set and valid.

---

## Frontend — Install & Run (step-by-step)
1. Open a terminal and go to the frontend folder:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
# or: pnpm install
# or: yarn
```

3. Create `.env.local` (frontend) to point to the backend API base URL:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

4. Start the Next.js dev server:
```bash
npm run dev
```

5. Open `http://localhost:3000` in your browser and you should see the Business Idea Generator.

Notes & tips:
- If you encounter `Cannot apply unknown utility class` errors, restart the dev server after changing `tailwind.config.js` or `postcss.config.mjs` and ensure dependencies are installed.
- If PostCSS/Tailwind reports missing plugin errors, run `npm install` from the `frontend/` folder and ensure `@tailwindcss/postcss` is present in `devDependencies`.

---

## Run both (manual)
Open two terminals (or use your editor terminal splits):

- Terminal A — Backend
```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --port 8000
```

- Terminal B — Frontend
```bash
cd frontend
npm install    # if not already installed
npm run dev
```

Then visit `http://localhost:3000`.

---

## Environment variables (summary)
- Backend (`backend/.env`):
	- `OPENAI_API_KEY` — required to call OpenAI. Example: `OPENAI_API_KEY=sk-...`
- Frontend (`frontend/.env.local`):
	- `NEXT_PUBLIC_API_BASE_URL` — the base URL for the backend (example: `http://localhost:8000`). Must be public-prefixed so Next.js exposes it to the browser.

---

## Common errors & troubleshooting
- Error: `Cannot apply unknown utility class` (Tailwind @apply issue)
	- Ensure `tailwind.config.js` `content` includes `./app/**/*.css` (or `./**/*.{js,ts,jsx,tsx,mdx,css}`) so classes used in CSS are detected.
	- Restart the dev server after changing Tailwind or PostCSS config.

- Error: `Cannot find module '@tailwindcss/postcss'` or PostCSS plugin errors
	- Run `npm install` inside `frontend/` and verify `@tailwindcss/postcss` in `devDependencies`.

- SSE stream is empty or not updating
	- Confirm the backend is running at `NEXT_PUBLIC_API_BASE_URL`.
	- Verify there is no proxy blocking `EventSource` and the URL path is `/stream`.

---

## Optional: Docker example (quick)
Below is a minimal `docker-compose.yml` example to run both services locally. This is optional — you can create files and tweak as needed.

```yaml
version: '3.8'
services:
	backend:
		build: ./backend
		command: uvicorn main:app --host 0.0.0.0 --port 8000
		environment:
			- OPENAI_API_KEY=${OPENAI_API_KEY}
		ports:
			- 8000:8000

	frontend:
		build: ./frontend
		command: npm run dev
		environment:
			- NEXT_PUBLIC_API_BASE_URL=http://backend:8000
		ports:
			- 3000:3000
		depends_on:
			- backend
```

Notes: you'll need Dockerfiles for each service and to pass `OPENAI_API_KEY` into the compose environment (or use secrets).

---

## Project structure (high level)
```
AI_Project/
├─ backend/         # FastAPI app, streaming endpoint
├─ frontend/        # Next.js app with Tailwind
├─ .gitignore
└─ README.md        # (this file)
```

---

## Contributing
- Feel free to open issues or PRs. For changes to Tailwind/PostCSS or Next.js config, restart dev servers after editing configs.

---

If you'd like, I can also:
- add a `docker-compose.yml` + Dockerfiles for quick local containerized development,
- add a root `Makefile` with `make dev` to start both services in background,
- or create a single command that runs both servers concurrently for developer convenience.

Which of those would you like next?

