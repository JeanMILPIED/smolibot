# Smolibot

**Smolibot** is a minimalist local AI chatbot powered by lightweight language models.  
It can read documents, analyze images with OCR, and interact in multiple modes — all without needing an internet connection.  
Your data stays entirely local.

say Hi! to **Smolibot** and enjoy

---

### ✨ Features

- 🧠 Tiny LLMs: Uses small language models like TinyLLaMA or SmolLm2 for fast, low-resource conversations.
- 📄 Document Context: Upload a PDF and chat with its content.
- 🖼️ Image Context (Description + OCR): Describe images with Moondream and Extract text from images using local OCR (EasyOCR).
- 🎭 Chat Modes: Choose from modes like Friendly, Expert, Playful, or Sarcastic for different conversation styles.
- 💾 Session History: Recent chats persist across tabs (but reset with each session).
- 🔐 Local & Private: Runs fully offline in Docker, no cloud or external APIs.

---

### 📦 Installation

Prerequisites

- Docker & Docker Compose
- Python 3.9+
- Modern browser (for frontend)

Tested with an Apple M3, consuming around RAM this amount :

- ~ 3 GB for TinyLLaMA
- ~ 6 GB for SmolLm2

**N.B: Theses values are indicative, just so you can setup the right amount of memory for your Docker engine**

```
git clone https://github.com/jeanmilpied/smolibot.git
cd smolibot
docker-compose up --build
```

Once running, open your browser to http://localhost:3000

---

### 🛠️ Usage

#### Chat

- Type your question in the input box.
- Choose a mode and model from the header.
- View and switch between recent conversations on the sidebar.

#### Upload Document

- Click the upload icon.
- Only PDF files are supported.
- Smolibot will use document content as context in future prompts.

#### Upload Image

- Switch to image mode.
- Upload image file.
- Click "Add image in the chat" to run Image Description and OCR using EasyOCR.

---

### 🧰 Tech Stack

- Frontend: React + TailwindCSS
- Backend: FastAPI
- Image description VLM: Moondream
- OCR: EasyOCR (local)
- LLM: TinyLLaMA, SmolLm2 via Ollama
- Containerized: Docker & Docker Compose

---

### 🤝 Contributing

Contributions are welcome! Feel free to submit a PR or open an issue.
