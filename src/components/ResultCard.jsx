import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, CheckSquare, Calendar, Copy, Check, Sparkles } from 'lucide-react'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} style={{
      display: 'flex', alignItems: 'center', gap: 5,
      background: 'none', border: 'none',
      color: copied ? 'var(--accent-3)' : 'var(--text-muted)',
      cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)',
      padding: '4px 8px', borderRadius: 6, transition: 'all 0.2s',
    }}
      onMouseEnter={e => !copied && (e.currentTarget.style.color = 'var(--accent)')}
      onMouseLeave={e => !copied && (e.currentTarget.style.color = 'var(--text-muted)')}
    >
      {copied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
}
const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
}

export default function ResultCard({ result }) {
  const [checkedTasks, setCheckedTasks] = useState({})
  const [editingTask, setEditingTask] = useState(null)
  const [taskValues, setTaskValues] = useState(() => result.tasks || [])
  const [editingEvent, setEditingEvent] = useState(null)
  const [eventValues, setEventValues] = useState(() => result.events || [])

  const toggleTask = (i) => setCheckedTasks(prev => ({ ...prev, [i]: !prev[i] }))

  const allChecked = taskValues.length > 0 && taskValues.every((_, i) => checkedTasks[i])

  return (
    <motion.div
      className="glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ overflow: 'hidden' }}
    >
      {/* Header */}
      <div style={{
        padding: '20px 24px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'var(--accent-dim)',
            border: '1px solid rgba(94,234,212,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={13} color="var(--accent)" strokeWidth={2} />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16, fontWeight: 700, color: 'var(--text-primary)',
          }}>
            AI Output
          </span>
        </div>
        {taskValues.length > 0 && (
          <span style={{
            fontSize: 12,
            color: allChecked ? 'var(--accent-3)' : 'var(--text-muted)',
            transition: 'color 0.3s',
          }}>
            {Object.values(checkedTasks).filter(Boolean).length}/{taskValues.length} done
          </span>
        )}
      </div>

      {/* Transcript */}
      {result.transcript && (
        <div style={{
          padding: '14px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(255,255,255,0.015)',
        }}>
          <p style={{
            fontSize: 13, color: 'var(--text-secondary)',
            fontStyle: 'italic', lineHeight: 1.7,
          }}>
            "{result.transcript}"
          </p>
        </div>
      )}

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}
      >

        {/* Summary */}
        {result.summary && (
          <motion.div variants={itemVariants}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <FileText size={13} color="var(--accent-2)" strokeWidth={2} />
                <span className="tag tag-purple">Summary</span>
              </div>
              <CopyButton text={result.summary} />
            </div>
            <p style={{
              fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.75,
              padding: '12px 16px',
              background: 'rgba(167,139,250,0.05)',
              borderRadius: 10,
              border: '1px solid rgba(167,139,250,0.1)',
            }}>
              {result.summary}
            </p>
          </motion.div>
        )}

        {result.summary && taskValues.length > 0 && (
          <div style={{ height: 1, background: 'var(--border)' }} />
        )}

        {/* Tasks */}
        {taskValues.length > 0 && (
          <motion.div variants={itemVariants}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <CheckSquare size={13} color="var(--accent-3)" strokeWidth={2} />
                <span className="tag tag-teal">Tasks</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {taskValues.length} item{taskValues.length !== 1 ? 's' : ''}
                </span>
              </div>
              <CopyButton text={taskValues.map((t, i) => `${i + 1}. ${t}`).join('\n')} />
            </div>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {taskValues.map((task, i) => {
                const checked = checkedTasks[i] || false
                const isEditing = editingTask === i
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 12px',
                      background: checked ? 'rgba(52,211,153,0.03)' : 'rgba(52,211,153,0.05)',
                      borderRadius: 8,
                      border: `1px solid ${checked ? 'rgba(52,211,153,0.2)' : 'rgba(52,211,153,0.1)'}`,
                      transition: 'all 0.2s',
                      userSelect: 'none',
                    }}
                  >
                    {/* Checkbox */}
                    <div
                      onClick={() => toggleTask(i)}
                      style={{
                        width: 17, height: 17, borderRadius: 4, flexShrink: 0,
                        border: `1.5px solid ${checked ? 'var(--accent-3)' : 'rgba(52,211,153,0.35)'}`,
                        background: checked ? 'var(--accent-3)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s', cursor: 'pointer',
                      }}
                    >
                      {checked && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="#07090f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    {/* Text or input */}
                    {isEditing ? (
                      <input
                        autoFocus
                        value={taskValues[i]}
                        onChange={e => {
                          const updated = [...taskValues]
                          updated[i] = e.target.value
                          setTaskValues(updated)
                        }}
                        onBlur={() => setEditingTask(null)}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditingTask(null) }}
                        style={{
                          flex: 1, background: 'transparent',
                          border: 'none', borderBottom: '1px solid var(--accent)',
                          color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
                          fontSize: 14, outline: 'none', padding: '2px 0',
                        }}
                      />
                    ) : (
                      <span style={{
                        flex: 1, fontSize: 14,
                        color: checked ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: checked ? 'line-through' : 'none',
                        cursor: checked ? 'default' : 'text',
                        transition: 'all 0.2s',
                      }}>
                        {task}
                      </span>
                    )}

                    {/* Edit icon */}
                    {!checked && !isEditing && (
                      <button
                        onClick={() => setEditingTask(i)}
                        style={{
                          background: 'none', border: 'none', padding: 4,
                          color: 'var(--text-muted)', cursor: 'pointer',
                          borderRadius: 4, transition: 'color 0.2s',
                          display: 'flex', alignItems: 'center',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        <EditIcon />
                      </button>
                    )}
                  </motion.li>
                )
              })}
            </ul>

            {/* All done */}
            <AnimatePresence>
              {allChecked && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    marginTop: 10, padding: '10px 14px',
                    background: 'rgba(52,211,153,0.08)',
                    border: '1px solid rgba(52,211,153,0.2)',
                    borderRadius: 8, fontSize: 13,
                    color: 'var(--accent-3)', textAlign: 'center',
                  }}
                >
                  🎉 All tasks done!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {taskValues.length > 0 && eventValues.length > 0 && (
          <div style={{ height: 1, background: 'var(--border)' }} />
        )}

        {/* Events */}
        {eventValues.length > 0 && (
          <motion.div variants={itemVariants}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Calendar size={13} color="var(--accent-warm)" strokeWidth={2} />
                <span className="tag tag-orange">Calendar Events</span>
              </div>
              <CopyButton text={eventValues.map(e => `${e.title} — ${e.datetime || 'No time'}`).join('\n')} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {eventValues.map((event, i) => {
                const isEditing = editingEvent === i
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.07 }}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(251,146,60,0.06)',
                      borderRadius: 10,
                      border: '1px solid rgba(251,146,60,0.15)',
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: 'rgba(251,146,60,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Calendar size={16} color="var(--accent-warm)" strokeWidth={2} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Title row */}
                      {isEditing ? (
                        <input
                          autoFocus
                          value={eventValues[i].title}
                          onChange={e => {
                            const updated = [...eventValues]
                            updated[i] = { ...updated[i], title: e.target.value }
                            setEventValues(updated)
                          }}
                          onBlur={() => setEditingEvent(null)}
                          onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditingEvent(null) }}
                          style={{
                            width: '100%', background: 'transparent',
                            border: 'none', borderBottom: '1px solid var(--accent-warm)',
                            color: 'var(--accent-warm)', fontFamily: 'var(--font-body)',
                            fontSize: 14, fontWeight: 600, outline: 'none',
                            padding: '2px 0', marginBottom: 6,
                          }}
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-warm)' }}>
                            {event.title}
                          </p>
                          <button
                            onClick={() => setEditingEvent(i)}
                            style={{
                              background: 'none', border: 'none', padding: 3,
                              color: 'var(--text-muted)', cursor: 'pointer',
                              borderRadius: 4, transition: 'color 0.2s',
                              display: 'flex', alignItems: 'center',
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-warm)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                          >
                            <EditIcon />
                          </button>
                        </div>
                      )}

                      {/* Datetime */}
                      {isEditing ? (
                        <input
                          value={eventValues[i].datetime || ''}
                          placeholder="Date & time..."
                          onChange={e => {
                            const updated = [...eventValues]
                            updated[i] = { ...updated[i], datetime: e.target.value }
                            setEventValues(updated)
                          }}
                          onBlur={() => setEditingEvent(null)}
                          onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditingEvent(null) }}
                          style={{
                            width: '100%', background: 'transparent',
                            border: 'none', borderBottom: '1px solid rgba(251,146,60,0.4)',
                            color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
                            fontSize: 12, outline: 'none', padding: '2px 0',
                          }}
                        />
                      ) : (
                        event.datetime && (
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                            {event.datetime}
                          </p>
                        )
                      )}

                      {event.notes && !isEditing && (
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                          {event.notes}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}