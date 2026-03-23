import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, Pause, Play, RotateCcw, Sparkles } from 'lucide-react'
import useRecorder from '../hooks/useRecorder'
import Waveform from './Waveform'
import ResultCard from './ResultCard'
import { processVoiceNote } from '../services/openrouter'

export default function Recorder({ onSave }) {
  const {
    state, audioUrl, audioBlob, duration, analyserData,
    formatTime, start, pause, resume, stop, reset
  } = useRecorder()

  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const isRecording = state === 'recording'
  const isPaused = state === 'paused'
  const isDone = state === 'done'
  const isIdle = state === 'idle'

  const handleProcess = async () => {
    if (!audioBlob) return
    setIsProcessing(true)
    setError(null)
    try {
      const output = await processVoiceNote(audioBlob)
      setResult(output)
      onSave({
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        transcript: output.transcript,
        summary: output.summary,
        tasks: output.tasks,
        events: output.events,
      })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    reset()
    setResult(null)
    setError(null)
  }

  return (
    <div>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ textAlign: 'center', marginBottom: 48 }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 38, fontWeight: 800,
          letterSpacing: '-0.04em', lineHeight: 1.1,
          marginBottom: 12,
        }}>
          Speak your mind.<br />
          <span style={{ color: 'var(--accent)' }}>We'll handle the rest.</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 400, margin: '0 auto' }}>
          Record any idea — AI turns it into tasks, a summary, and calendar events.
        </p>
      </motion.div>

      {/* Recorder card */}
      <motion.div
        className="glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ padding: '40px 32px', textAlign: 'center' }}
      >
        {/* Timer */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 52, fontWeight: 700,
          letterSpacing: '-0.04em',
          color: isRecording ? 'var(--accent)' : 'var(--text-muted)',
          marginBottom: 24, transition: 'color 0.3s',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {formatTime(duration)}
        </div>

        {/* Waveform */}
        <div style={{ marginBottom: 24 }}>
          <Waveform data={analyserData} isActive={isRecording} />
        </div>

        {/* Status label */}
        <div style={{
          fontSize: 12, fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          marginBottom: 32, transition: 'color 0.3s',
          color: isRecording ? 'var(--accent)'
            : isPaused ? 'var(--accent-warm)'
              : isDone ? 'var(--accent-3)'
                : 'var(--text-muted)',
        }}>
          {isRecording ? '● Recording'
            : isPaused ? '⏸ Paused'
              : isDone ? '✓ Ready to process'
                : 'Tap to start recording'}
        </div>

        {/* Idle — big record button */}
        <AnimatePresence mode="wait">
          {isIdle && (
            <motion.div key="idle"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}
            >
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <div className="animate-ping-slow" style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'var(--accent)', opacity: 0.15,
                }} />
                <button onClick={start} style={{
                  position: 'relative',
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'var(--accent)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 40px rgba(94,234,212,0.35)',
                  transition: 'box-shadow 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 60px rgba(94,234,212,0.55)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(94,234,212,0.35)'}
                >
                  <Mic size={30} color="#07090f" strokeWidth={2.5} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Recording / Paused controls */}
          {(isRecording || isPaused) && (
            <motion.div key="controls"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 24 }}
            >
              <button onClick={isPaused ? resume : pause} className="btn-ghost"
                style={{ borderRadius: '50%', width: 52, height: 52, padding: 0 }}>
                {isPaused ? <Play size={18} strokeWidth={2.2} /> : <Pause size={18} strokeWidth={2.2} />}
              </button>

              <button onClick={stop} style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'var(--accent-red)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 32px rgba(248,113,113,0.3)', transition: 'box-shadow 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 48px rgba(248,113,113,0.5)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 32px rgba(248,113,113,0.3)'}
              >
                <Square size={26} color="#fff" strokeWidth={2.5} fill="#fff" />
              </button>

              <button onClick={handleReset} className="btn-ghost"
                style={{ borderRadius: '50%', width: 52, height: 52, padding: 0 }}>
                <RotateCcw size={16} strokeWidth={2.2} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Done state */}
        <AnimatePresence>
          {isDone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {audioUrl && (
                <div style={{ marginBottom: 20 }}>
                  <audio src={audioUrl} controls style={{
                    width: '100%', maxWidth: 340, borderRadius: 8,
                    filter: 'invert(0.85) hue-rotate(160deg)', opacity: 0.8,
                  }} />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={handleProcess} disabled={isProcessing} className="btn-primary">
                  <Sparkles size={15} />
                  {isProcessing ? 'Processing...' : 'Process with AI'}
                </button>
                <button onClick={handleReset} className="btn-ghost">
                  <RotateCcw size={14} /> Record again
                </button>
              </div>

              {error && (
                <p style={{
                  marginTop: 16, fontSize: 13,
                  color: 'var(--accent-red)',
                  background: 'rgba(248,113,113,0.08)',
                  padding: '10px 16px', borderRadius: 8,
                  border: '1px solid rgba(248,113,113,0.2)',
                }}>{error}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Processing spinner */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="glass"
            style={{ marginTop: 20, padding: 32, textAlign: 'center' }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '2px solid var(--border-bright)',
              borderTopColor: 'var(--accent)',
              margin: '0 auto 14px',
              animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Transcribing and analyzing your note...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginTop: 24 }}
          >
            <ResultCard result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}