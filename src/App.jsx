import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Recorder from './components/Recorder'
import Dashboard from './components/Dashboard'

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.2 } },
}

export default function App() {
  const [view, setView] = useState('record')
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('speaklog_notes') || '[]') }
    catch { return [] }
  })

  const saveNote = (note) => {
    const updated = [note, ...notes]
    setNotes(updated)
    localStorage.setItem('speaklog_notes', JSON.stringify(updated))
  }

  const deleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    localStorage.setItem('speaklog_notes', JSON.stringify(updated))
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header view={view} setView={setView} noteCount={notes.length} />

      <main style={{ flex: 1, maxWidth: 780, margin: '0 auto', width: '100%', padding: '48px 20px 80px' }}>
        <AnimatePresence mode="wait">
          {view === 'record' ? (
            <motion.div key="record" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Recorder onSave={saveNote} />
            </motion.div>
          ) : (
            <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Dashboard notes={notes} onDelete={deleteNote} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}