from fastapi import FastAPI
from pydantic import BaseModel
import httpx
from typing import List, Optional

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (can be restricted to specific domains)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)
class Message(BaseModel):
    sender: str  # 'user' or 'bot'
    text: str

class PromptRequest(BaseModel):
    prompt: str
    model: str
    history: Optional[List[Message]] = []

async def summarize_history(history: List[Message], model: str = "tinyllama") -> Message:
    conversation_text = "\n".join([f"{m.sender}: {m.text}" for m in history])
    prompt = f"Summarize the following conversation:\n{conversation_text}\nSummary:"

    async with httpx.AsyncClient(timeout=httpx.Timeout(60.0)) as client:
        response = await client.post(
            "http://ollama:11434/api/generate",
            json={"model": model, "prompt": prompt, "stream": False}
        )
        summary = response.json().get("response", "").strip()
        return Message(sender="system", text=f"[Summary]: {summary}")

@app.post("/ask")
async def ask_bot(request: PromptRequest):

    # Determine if summarization is needed
    if len(request.history) > 5:
        summary_message = await summarize_history(request.history[:-5], model=request.model)
        trimmed_history = [summary_message] + request.history[-5:]
    else:
        trimmed_history = request.history

    # Construct prompt with history
    full_prompt = "\n".join([f"{m.sender}: {m.text}" for m in trimmed_history])
    full_prompt += f"\nuser: {request.prompt}"

    async with httpx.AsyncClient(timeout=httpx.Timeout(60.0)) as client:
        response = await client.post(
            "http://ollama:11434/api/generate",
            json={
                "model": request.model,
                "prompt": full_prompt,
                "stream": False  # 👈 ADD THIS!
            }
        )
        result = response.json()
        return {"response": result.get("response")}

