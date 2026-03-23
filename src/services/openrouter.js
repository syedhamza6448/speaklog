const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const GROQ_KEY       = import.meta.env.VITE_GROQ_API_KEY

const SYSTEM_PROMPT = `You are an AI assistant that processes voice note transcripts.

Given a transcript, extract and return ONLY a valid JSON object with this exact structure:
{
  "summary": "a concise 2-3 sentence summary of the key points",
  "tasks": ["task 1", "task 2"],
  "events": [
    { "title": "Event name", "datetime": "Date and time as mentioned", "notes": "any extra context" }
  ]
}

Rules:
- tasks: extract every action item, to-do, or thing that needs to be done. Empty array [] if none found.
- events: extract every meeting, appointment, deadline, or scheduled event. Empty array [] if none.
- summary: always provide this, even for very short notes.
- Return ONLY the raw JSON object. No explanation, no markdown fences, no backticks.`

async function transcribeAudio(audioBlob) {
  const mimeType  = audioBlob.type || 'audio/webm'
  const extension = mimeType.includes('ogg') ? 'ogg'
                  : mimeType.includes('mp4') ? 'mp4'
                  : 'webm'

  const file = new File([audioBlob], `recording.${extension}`, { type: mimeType })
  console.log('🎙️ Sending to Groq:', file.name, file.size, 'bytes', file.type)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('model', 'whisper-large-v3-turbo')
  formData.append('response_format', 'json')
  formData.append('language', 'en')

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${GROQ_KEY}` },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Transcription failed: ${err}`)
  }

  const data = await res.json()
  console.log('✅ Groq transcript:', data.text)
  return data.text || ''
}

async function parseTranscript(transcript) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://speaklog.app',
      'X-Title': 'SpeakLog',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: `Transcript: "${transcript.trim()}"` },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`AI parsing failed: ${err}`)
  }

  const data = await res.json()
  const raw  = data.choices?.[0]?.message?.content || '{}'

  try {
    const clean = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return { summary: raw, tasks: [], events: [] }
  }
}

export async function processVoiceNote(audioBlob) {
  if (!audioBlob) throw new Error('No audio recorded. Please try again.')
  const transcript = await transcribeAudio(audioBlob)
  if (!transcript?.trim()) throw new Error('Could not detect speech. Please speak clearly and try again.')
  const structured = await parseTranscript(transcript)
  return { ...structured, transcript }
}