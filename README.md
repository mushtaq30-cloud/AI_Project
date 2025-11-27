# Next.js App Router (v16+) + Tailwind CSS v4 + FastAPI + SSE + Markdown + CI/CD

## AI_Project — Business Idea Generator

This repository contains a small full-stack project demonstrating a production-style architecture:

- Frontend: Next.js (App Router) + Tailwind CSS v4, React Markdown rendering
- Backend: FastAPI streaming endpoint (SSE) that relays AI-generated content from OpenAI
- CI/CD scaffolding: `Jenkinsfile`, Dockerfiles, and Ansible playbooks for deployment

Repository layout (high level)

```
AI_Project/
├─ backend/                    # FastAPI app, Dockerfile, requirements
├─ frontend/                   # Next.js app (app/), Tailwind, Dockerfile
├─ infra/ansible/              # Ansible inventory & playbooks
├─ Jenkinsfile                 # Multibranch pipeline (GitFlow aware)
├─ ci/CD_README.md             # CI/CD integration notes
└─ README.md                   # (this file)
```

This README provides project-specific setup steps for local development, container builds, and CI/CD usage.

---

## Prerequisites

- Node.js 18+ and npm (or pnpm/yarn)
- Python 3.10+ and `pip`
- Docker (for building images locally)
- An OpenAI API key (for the backend)

Check versions:

```bash
node -v && npm -v && python -V && pip -V && docker -v
```

---

## Backend — local setup & run

1. Enter backend folder and (optionally) create a venv:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # macOS/Linux
# .\.venv\Scripts\activate # Windows (PowerShell)
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Add environment variables (create `backend/.env`):

```
OPENAI_API_KEY=sk-...your-key...
```

4. Run the API locally:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

5. Test the SSE endpoint:

```bash
curl -N http://localhost:8000/stream
```

Notes:

- In `backend/main.py` CORS is permissive for development. Restrict `allow_origins` in production.

---

## Frontend — local setup & run

1. Enter frontend folder and install node dependencies:

```bash
cd frontend
npm install
# or: pnpm install
```

2. Create `frontend/.env.local` and point to your backend:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

3. Start dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Notes on Tailwind/PostCSS:

- This project targets Tailwind CSS v4. The repo includes `tailwind.config.js` and `postcss.config.mjs` configured for v4 (`@tailwindcss/postcss`).
- If you see `Cannot apply unknown utility class` errors, ensure:
  - `frontend/postcss.config.mjs` contains the Tailwind plugin (`@tailwindcss/postcss`) and `autoprefixer` is installed if required.
  - `tailwind.config.js` `content` globs include `./app/**/*.{js,ts,jsx,tsx,mdx,css}` so classes used in CSS via `@apply` are discovered.
  - Restart the dev server after changing configs.

---

## Docker: build images locally

From repository root you can build both images:

```bash
docker build -t myrepo/ai_project_backend:latest ./backend
docker build -t myrepo/ai_project_frontend:latest ./frontend
```

Push images to your registry (Docker Hub, ECR, etc.) before deploying from CI.

---

## CI/CD (Jenkins + Ansible)

- `Jenkinsfile` is included and implements a multibranch pipeline aligned with GitFlow:
  - `feature/*`: build checks
  - `develop`: build and push images (staging)
  - `release/*`, `main`: build, push, and deploy via Ansible
- Jenkinsfile expects credentials to be configured in Jenkins (placeholders in file):
  - `DOCKER_REGISTRY` (secret text)
  - `docker-hub-credentials` (username/password)
  - `ansible-ssh-creds` (SSH key for target hosts)
- Ansible playbook: `infra/ansible/playbooks/deploy_app.yml` uses the `community.docker` collection to pull images and start containers on hosts defined in `infra/ansible/inventory/hosts.ini`.

CI quick notes:

- The pipeline tags Docker images with `${BRANCH}-${BUILD_NUMBER}` so artifacts are traceable.
- You can adapt the Jenkinsfile to trigger Ansible Tower/AWX job templates (the CI README explains options).

---

## Run both services locally (developer convenience)

Open two terminals:

- Terminal 1: Backend

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --port 8000
```

- Terminal 2: Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Troubleshooting

- `Cannot find module '@tailwindcss/postcss'` — run `npm install` in `frontend/` and ensure `@tailwindcss/postcss` is present in `devDependencies`.
- `Cannot apply unknown utility class` — ensure Tailwind content globs include any CSS files using `@apply`; restart dev server after config changes.
- SSE not streaming — verify `NEXT_PUBLIC_API_BASE_URL` matches the backend and that proxies (if any) allow `EventSource` streams.

---

## Optional next steps I can add for you

- `docker-compose.yml` for local integration testing (single host)
- AWX/Tower Job Template example and Jenkins trigger via Tower API
- Root `Makefile` with convenience `make dev` to start both services locally

If you'd like, tell me which of the above I should add and I will implement it.

# 🚀 Full Enterprise Setup

### **Next.js App Router (v16+) + Tailwind CSS v4 + FastAPI + SSE + Markdown**

This guide builds a **production-grade AI SaaS application** with:

* Modern UI using **Next.js App Router**
* Styling with **Tailwind CSS v4**
* Backend using **FastAPI**
* Live AI streaming using **SSE**
* External `.env` files
* Cloud-agnostic deployment
* Clean architecture suitable for enterprise applications

---

# 0️⃣ Project Structure

You will end up with:

```
saas-app/
│
├── frontend/        → Next.js App Router (UI)
└── backend/         → FastAPI (SSE API)
```

---

# 1️⃣ Create Your Project Root

```bash
mkdir saas-app
cd saas-app
```

---

# 2️⃣ Backend Setup — FastAPI (Enterprise)

## 2.1 Create backend folder

```bash
mkdir backend
cd backend
```

---

## 2.2 Create `.env`

```
OPENAI_API_KEY=your-openai-key
APP_ENV=local
```

---

## 2.3 `requirements.txt`

```
fastapi
uvicorn
openai
python-dotenv
```

---

## 2.4 Create `main.py` (Final, production-ready)

```python
import time
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

# Load env
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

# CORS - enterprise safe defaults
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stream")
def stream_idea():

    prompt = [
        {
            "role": "user",
            "content": "Generate a structured business idea for AI Agents with headings and bullet points."
        }
    ]

    stream = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=prompt,
        stream=True,
    )

    def generate():
        yield ": ping\n\n"
        for chunk in stream:
            delta = chunk.choices[0].delta
            if delta and delta.content:
                for line in delta.content.split("\n"):
                    yield f"data: {line}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
```

---

## 2.5 Run Backend

```bash
uvicorn main:app --reload --port 8000
```

Backend is ready.

---

# 3️⃣ Frontend Setup — Next.js App Router + Tailwind v4

Move back to project root:

```bash
cd ..
```

---

## 3.1 Create the Next.js App Router project

```bash
npx create-next-app@latest frontend --typescript --app --tailwind --eslint
```

### Use these answers:

| Prompt                  | Answer        |
| ----------------------- | ------------- |
| React Compiler          | **No**  |
| Use `/src` directory? | **No**  |
| Use App Router?         | **Yes** |
| Customize import alias? | **No**  |
| Use Turbopack?          | **No**  |

---

## 3.2 Create `.env.local` inside `frontend/`

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

For production:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
```

---

## 3.3 Install Markdown dependencies

```bash
cd frontend
npm install react-markdown remark-gfm remark-breaks @tailwindcss/typography
```

---

# 4️⃣ Configure Tailwind CSS v4 (Important)

### Tailwind v4 uses **new syntax**.

---

## 4.1 Create `tailwind.config.js`

Create:

```
frontend/tailwind.config.js
```

Add:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
```

---

## 4.2 Fix PostCSS config (v4 format)

Open:

```
frontend/postcss.config.mjs
```

Ensure EXACT content:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

---

## 4.3 Fix `globals.css` for Tailwind v4

Open:

```
frontend/app/globals.css
```

Replace EVERYTHING with:

```css
@import "tailwindcss";

/* custom global styles go here */
```

---

# 5️⃣ Create the Frontend UI (App Router)

Final streaming page:

`frontend/app/page.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function HomePage() {
  const [idea, setIdea] = useState("…loading");

  useEffect(() => {
    const evt = new EventSource(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/stream`
    );

    let buffer = "";

    evt.onmessage = (e) => {
      if (e.data === "[DONE]") {
        evt.close();
        return;
      }
      buffer += e.data + "\n";
      setIdea(buffer);
    };

    evt.onerror = () => {
      console.error("SSE connection error. Closing stream.");
      evt.close();
    };

    return () => evt.close();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Business Idea Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-3">
            Real-time AI-powered innovation
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
            <div className="prose dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {idea}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

## 5.2 Layout file

`frontend/app/layout.tsx`

```tsx
import "./globals.css";

export const metadata = {
  title: "Business Idea Generator",
  description: "AI-powered business idea generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

---

# 6️⃣ Running Everything

---

## 6.1 Run backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

---

## 6.2 Run frontend

```bash
cd frontend
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 7️⃣ Deployment (Cloud-Agnostic)

---

## Backend can be deployed to:

* AWS EC2
* GCP Cloud Run
* Azure App Service
* Railway / Render / Fly.io
* Docker + Kubernetes

Frontend can be deployed to:

* Vercel
* Netlify
* AWS Amplify
* Cloudflare Pages
* Any static hosting

Just set your environment variable:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
```

---

# 🎉 Final Result
![Screenshot of UI](./Screenshot.png "UI Example")

You now have a fully working:

* **Next.js App Router frontend**
* **FastAPI backend**
* **Streaming SSE AI responses**
* **Markdown rendering**
* **Tailwind CSS v4 styling**
* **Cloud-agnostic deployment**
* **Enterprise folder structure**
* **Zero confusion, fully stable build**

This is the **production-ready architecture** used in real SaaS products.

---
