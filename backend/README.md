# AI_Project — Backend (FastAPI)

This is the backend API for the AI Business Idea Generator.
It provides a streaming SSE endpoint that returns AI-generated business ideas using the OpenAI API.

## Tech stack
- FastAPI
- Uvicorn
- OpenAI Python client
- python-dotenv for environment variable management

## Requirements
- Python 3.10 or later
- pip

## Installation
1. Create a Python virtual environment and activate it:

```bash
python -m venv .venv
source .venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the `backend/` folder (this repo has an example pattern). Add your OpenAI API key:

```
OPENAI_API_KEY=sk-...your-api-key...
```

## Running the server (local, dev)
Run the app with Uvicorn for development:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The service will be available on `http://localhost:8000`.

## API Endpoints
- GET `/stream` — Server-Sent Events (SSE) streaming endpoint

Example using curl:

```bash
curl -N http://localhost:8000/stream
```

The endpoint streams an AI-generated business idea in a line-delimited SSE format. The backend uses the OpenAI SDK to create a streaming completion.

## Environment / Configuration
- `OPENAI_API_KEY` — your OpenAI API key. Required.
- Configure CORS in `main.py` for permitted origins. In production, replace `allow_origins=["*"]` with allowed domains.

## Production Notes
- Restrict CORS origins instead of `*`.
- Add request validation and rate limiting as needed.
- Use a process manager and a proper ASGI server (Uvicorn/Gunicorn) for production.
- Secure environment variables (use managed secret stores in CI/CD and hosting platforms).

## Troubleshooting
- If you receive an OpenAI authentication error, verify `OPENAI_API_KEY` is set and valid.
- If SSE disconnects or doesn’t stream, verify the `/stream` URL and that no intermediary (like proxies) block streaming flows.

## License
This project follows the license in the repository root.
