# SpeakLog 🎙️

> Turn your voice into action. Record ideas — get tasks, summaries, and calendar events instantly.

![SpeakLog Banner](./screenshots/banner.png)

---

## What is SpeakLog?

Most people record voice notes and never replay them. SpeakLog fixes that.

You speak. AI listens. In seconds, your messy voice note becomes:
- ✅ **Actionable tasks** — a clean to-do list
- 📝 **A sharp summary** — the key points, nothing else
- 📅 **Calendar events** — dates, times, and titles extracted automatically

No typing. No manual organizing. Just speak and go.

---

## Features

- 🎙️ **One-tap recording** — start instantly, stop when done
- 🌊 **Live waveform animation** — visual feedback while you record
- 🤖 **AI-powered parsing** — OpenRouter LLM extracts structured data from natural speech
- 📋 **Three output types** — Tasks, Summary, Calendar Events
- 🗂️ **Note history** — all your past voice notes saved locally
- 🌙 **Dark command-center UI** — stunning glassmorphism design
- ⚡ **Zero backend** — runs entirely in the browser, localStorage for persistence

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Voice Recording | MediaRecorder API |
| AI Processing | OpenRouter API |
| Icons | Lucide React |
| Storage | localStorage |

---

## Getting Started

### Prerequisites
- Node.js 18+
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

Add your OpenRouter API key to `.env`:
```env
VITE_OPENROUTER_API_KEY=your_key_here
```

```bash
# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and start recording.

---

## How It Works

```
Voice Input
    ↓
MediaRecorder API captures audio
    ↓
Audio → text via OpenRouter (Whisper / LLM)
    ↓
Transcript → structured JSON via LLM prompt
    ↓
Tasks + Summary + Calendar Events rendered in UI
    ↓
Saved to localStorage
```

---

## Project Structure

```
speaklog/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Sticky nav with logo
│   │   ├── Recorder.jsx      # Voice recording + waveform
│   │   ├── ResultCard.jsx    # AI output display
│   │   └── Dashboard.jsx     # Note history
│   ├── hooks/
│   │   └── useRecorder.js    # MediaRecorder logic
│   ├── services/
│   │   └── openrouter.js     # AI API calls
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
```

> ⚠️ Never commit your `.env` file. It's already in `.gitignore`.

---

## Roadmap

- [ ] Export tasks to Notion / Todoist
- [ ] Google Calendar integration
- [ ] Multi-language voice support
- [ ] PWA support (installable on mobile)
- [ ] Next.js version with proper API route key protection

---

## Screenshots

> *(Coming soon — add screenshots to `/screenshots` folder)*

---

## License

MIT © [Hamza](https://github.com/syedhamza6448)

---

## Acknowledgements

- [OpenRouter](https://openrouter.ai) — AI model routing
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Lucide](https://lucide.dev) — icons