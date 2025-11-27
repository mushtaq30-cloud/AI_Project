import time
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

# Load environment variables
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI()

# Enterprise CORS (replace * with exact domains in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # e.g., ["https://yourfrontend.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stream")
def stream_idea():
    """Real-time streaming endpoint using SSE."""

    prompt = [
        {
            "role": "user",
            "content": (
                "Give a professional business idea for AI Agents, with headings, "
                "subheadings, bullet points, and short paragraphs."
            ),
        }
    ]

    stream = client.chat.completions.create(
        model="gpt-3.5",
        messages=prompt,
        stream=True,
    )

    def generate():
        # Safari heartbeat
        yield ": ping\n\n"

        for chunk in stream:
            delta = chunk.choices[0].delta
            if not delta or not delta.content:
                continue

            for line in delta.content.split("\n"):
                yield f"data: {line}\n\n"

            time.sleep(0.01)

    return StreamingResponse(generate(), media_type="text/event-stream")
