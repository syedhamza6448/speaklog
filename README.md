# SpeakLog 🎙️

> Turn your voice into action. Record ideas — get tasks, summaries, and calendar events instantly.

![SpeakLog Banner](./screenshots/banner.png)

🔗 **Live Demo:** [speaklog.vercel.app](https://speaklog.vercel.app)

---

## What is SpeakLog?

Most people record voice notes and never replay them. SpeakLog fixes that.

You speak. AI listens. In seconds, your messy voice note becomes:
- ✅ **Actionable tasks** — a clean to-do list you can check off
- 📝 **A sharp summary** — the key points, nothing else
- 📅 **Calendar events** — dates, times, and titles extracted automatically

No typing. No manual organizing. Just speak and go.

---

## Features

- 🎙️ **One-tap recording** — start instantly, stop when done
- 🌊 **Live waveform animation** — real-time visual feedback while you speak
- 🤖 **AI-powered parsing** — Groq Whisper transcribes, OpenRouter Gemini structures
- 📋 **Three output types** — Tasks, Summary, Calendar Events
- ✏️ **Inline editing** — edit any task or event after AI generates it
- ☑️ **Checkable tasks** — tick off tasks as you complete them
- 📋 **One-click copy** — copy summary, tasks, or events to clipboard
- 🗂️ **Note history** — all past voice notes saved and searchable
- 📊 **Stats dashboard** — total notes, tasks, and events at a glance
- 🌙 **Dark command-center UI** — glassmorphism design with dot grid background
- ⚡ **Zero backend** — runs entirely in the browser, localStorage for persistence

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Voice Recording | MediaRecorder API |
| Transcription | Groq Whisper (whisper-large-v3-turbo) |
| AI Processing | OpenRouter API (Gemini 2.0 Flash) |
| Icons | Lucide React |
| Storage | localStorage |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Groq](https://console.groq.com) API key (free, no credit card)
- An [OpenRouter](https://openrouter.ai) API key (free tier works)

### Installation

```bash
# Clone the repo
git clone https://github.com/syedhamza6448/speaklog.git
cd speaklog

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Add your API keys to `.env`:
```env
VITE_OPENROUTER_API_KEY=your_openrouter_key_here
VITE_GROQ_API_KEY=your_groq_key_here
```

```bash
# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and start recording.

---

## How It Works

```
Record audio (MediaRecorder API)
    ↓
Send audio blob → Groq Whisper → transcript text
    ↓
Send transcript → OpenRouter Gemini 2.0 Flash
    ↓
Structured JSON { summary, tasks[], events[] }
    ↓
Rendered in UI + saved to localStorage
```

---

## Project Structure

```
speaklog/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Sticky nav with logo
│   │   ├── Hero.jsx          # Landing page with feature grid
│   │   ├── Recorder.jsx      # Voice recording + waveform
│   │   ├── Waveform.jsx      # Animated frequency bars
│   │   ├── ResultCard.jsx    # AI output with edit + copy
│   │   ├── Dashboard.jsx     # Note history + search + stats
│   │   └── Footer.jsx        # Footer with links
│   ├── hooks/
│   │   └── useRecorder.js    # MediaRecorder + Web Audio logic
│   ├── services/
│   │   └── openrouter.js     # Groq + OpenRouter API calls
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css             # Design system + CSS variables
├── .env.example
├── index.html
└── vite.config.js
```

---

## Environment Variables

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_GROQ_API_KEY=your_groq_api_key
```

---

## Deployment

This project is deployed on Vercel. To deploy your own:

```bash
npm install -g vercel
npm run build
vercel
```

Or connect your GitHub repo directly at [vercel.com](https://vercel.com) and add the environment variables in the project settings.

---

## Screenshots

> *(Add screenshots to `/screenshots` folder)*

---

## License

MIT © [Hamza](https://github.com/syedhamza6448)

---

## Acknowledgements

- [Groq](https://groq.com) — blazing fast Whisper transcription
- [OpenRouter](https://openrouter.ai) — AI model routing
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Lucide](https://lucide.dev) — icons