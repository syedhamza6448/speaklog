import { useState, useRef, useCallback } from 'react'

export default function useRecorder() {
  const [state, setState]               = useState('idle')
  const [audioBlob, setAudioBlob]       = useState(null)
  const [audioUrl, setAudioUrl]         = useState(null)
  const [duration, setDuration]         = useState(0)
  const [analyserData, setAnalyserData] = useState(new Uint8Array(32))

  const mediaRecorder  = useRef(null)
  const audioChunks    = useRef([])
  const timerRef       = useRef(null)
  const animFrameRef   = useRef(null)
  const audioCtxRef    = useRef(null)
  const analyserRef    = useRef(null)
  const streamRef      = useRef(null)

  const stopAnimation = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
  }

  const startAnimation = (analyser) => {
    stopAnimation()
    const data = new Uint8Array(analyser.frequencyBinCount)
    const tick = () => {
      analyser.getByteFrequencyData(data)
      setAnalyserData(new Uint8Array(data))
      animFrameRef.current = requestAnimationFrame(tick)
    }
    tick()
  }

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      })
      streamRef.current = stream

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = audioCtx
      if (audioCtx.state === 'suspended') await audioCtx.resume()

      const source   = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize               = 128
      analyser.smoothingTimeConstant = 0.8
      source.connect(analyser)
      analyserRef.current = analyser

      const mimeType = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
      ].find(m => MediaRecorder.isTypeSupported(m)) || ''

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})
      mediaRecorder.current = recorder
      audioChunks.current   = []

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunks.current.push(e.data)
        }
      }

      // ✅ KEY FIX: onstop fires AFTER the final ondataavailable
      // So all chunks are collected before we build the blob
      recorder.onstop = () => {
        const finalMime = mimeType || 'audio/webm'
        const blob = new Blob(audioChunks.current, { type: finalMime })
        console.log('🎙️ Final blob:', blob.size, 'bytes', blob.type, '| chunks:', audioChunks.current.length)
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stopAnimation()
        streamRef.current?.getTracks().forEach(t => t.stop())
      }

      // ✅ KEY FIX: request data every 1000ms instead of 250ms
      // This ensures larger, more reliable chunks
      recorder.start(1000)

      setState('recording')
      setDuration(0)
      startAnimation(analyser)
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)

    } catch (err) {
      console.error('❌ Recorder error:', err.name, err.message)
      if (err.name === 'NotAllowedError') {
        alert('Microphone permission denied. Please allow mic access in your browser settings.')
      } else if (err.name === 'NotFoundError') {
        alert('No microphone found. Please connect a microphone and try again.')
      } else {
        alert(`Could not start recording: ${err.message}`)
      }
    }
  }, [])

  const pause = useCallback(() => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.pause()
      clearInterval(timerRef.current)
      stopAnimation()
      setState('paused')
    }
  }, [])

  const resume = useCallback(() => {
    if (mediaRecorder.current?.state === 'paused') {
      mediaRecorder.current.resume()
      if (analyserRef.current) startAnimation(analyserRef.current)
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
      setState('recording')
    }
  }, [])

  const stop = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      // ✅ KEY FIX: request final chunk explicitly before stopping
      mediaRecorder.current.requestData()
      setTimeout(() => {
        mediaRecorder.current?.stop()
        clearInterval(timerRef.current)
        setState('done')
      }, 300) // wait 300ms for requestData to flush
    }
  }, [])

  const reset = useCallback(() => {
    stopAnimation()
    clearInterval(timerRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    audioCtxRef.current?.close()
    audioCtxRef.current = null
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioBlob(null)
    setAudioUrl(null)
    setDuration(0)
    setAnalyserData(new Uint8Array(32))
    setState('idle')
    mediaRecorder.current = null
    audioChunks.current   = []
  }, [audioUrl])

  const formatTime = (s) => {
    const m   = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  return {
    state, audioBlob, audioUrl, duration, analyserData,
    formatTime, start, pause, resume, stop, reset
  }
}