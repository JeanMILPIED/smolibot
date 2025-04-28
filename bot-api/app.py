from fastapi import FastAPI
from pydantic import BaseModel
import httpx

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

class PromptRequest(BaseModel):
    prompt: str
    model: str

@app.post("/ask")
async def ask_bot(request: PromptRequest):
    async with httpx.AsyncClient(timeout=httpx.Timeout(30.0)) as client:
        response = await client.post(
            "http://ollama:11434/api/generate",
            json={
                "model": request.model,
                "prompt": request.prompt,
                "stream": False  # 👈 ADD THIS!
            }
        )
        result = response.json()
        return {"response": result.get("response")}

