import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Trash2, FileText, CheckSquare, Calendar, Mic, ChevronDown, ChevronUp } from 'lucide-react'

function timeAgo(dateStr) {
  const diff  = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const EditIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

function NoteCard({ note, onDelete, index }) {
  const [expanded, setExpanded]         = useState(false)
  const [deleting, setDeleting]         = useState(false)
  const [checkedTasks, setCheckedTasks] = useState({})
  const [editingTask, setEditingTask]   = useState(null)
  const [taskValues, setTaskValues]     = useState(() => note.tasks || [])
  const [editingEvent, setEditingEvent] = useState(null)
  const [eventValues, setEventValues]   = useState(() => note.events || [])

  const handleDelete = () => {
    setDeleting(true)
    setTimeout(() => onDelete(note.id), 300)
  }

  const hasContent = taskValues.length > 0 || eventValues.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: deleting ? 0 : 1, x: deleting ? 40 : 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass"
      style={{ overflow: 'hidden' }}
    >
      {/* Card header */}
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                background: 'var(--accent-dim)',
                border: '1px solid rgba(94,234,212,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Mic size={11} color="var(--accent)" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {timeAgo(note.createdAt)}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>·</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                {taskValues.length > 0 && (
                  <span className="tag tag-teal" style={{ fontSize: 10 }}>
                    {taskValues.length} task{taskValues.length !== 1 ? 's' : ''}
                  </span>
                )}
                {eventValues.length > 0 && (
                  <span className="tag tag-orange" style={{ fontSize: 10 }}>
                    {eventValues.length} event{eventValues.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Transcript */}
            {note.transcript && (
              <p style={{
                fontSize: 14, color: 'var(--text-secondary)',
                fontStyle: 'italic', lineHeight: 1.6,
                display: '-webkit-box',
                WebkitLineClamp: expanded ? 'unset' : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                "{note.transcript}"
              </p>
            )}

            {/* Summary */}
            {note.summary && (
              <p style={{
                fontSize: 13, color: 'var(--text-primary)',
                lineHeight: 1.6, marginTop: 8,
                display: '-webkit-box',
                WebkitLineClamp: expanded ? 'unset' : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {note.summary}
              </p>
            )}
          </div>

          {/* Delete */}
          <button onClick={handleDelete} style={{
            flexShrink: 0, width: 32, height: 32,
            borderRadius: 8, border: 'none',
            background: 'transparent', color: 'var(--text-muted)',
            cursor: 'pointer', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; e.currentTarget.style.color = 'var(--accent-red)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            <Trash2 size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Expand toggle */}
        {hasContent && (
          <button onClick={() => setExpanded(e => !e)} style={{
            marginTop: 12, display: 'flex', alignItems: 'center', gap: 5,
            background: 'none', border: 'none',
            color: 'var(--text-muted)', fontSize: 12,
            cursor: 'pointer', transition: 'color 0.2s', padding: 0,
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {expanded ? 'Show less' : 'Show tasks & events'}
          </button>
        )}
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && hasContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '16px 24px 20px',
              borderTop: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}>

              {/* Tasks */}
              {taskValues.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                    <CheckSquare size={13} color="var(--accent-3)" strokeWidth={2} />
                    <span className="tag tag-teal">Tasks</span>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {taskValues.map((task, i) => {
                      const checked   = checkedTasks[i] || false
                      const isEditing = editingTask === i
                      return (
                        <li key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          fontSize: 13,
                          color: checked ? 'var(--text-muted)' : 'var(--text-primary)',
                          padding: '7px 12px',
                          background: checked ? 'rgba(52,211,153,0.03)' : 'rgba(52,211,153,0.05)',
                          borderRadius: 8,
                          border: `1px solid ${checked ? 'rgba(52,211,153,0.2)' : 'rgba(52,211,153,0.1)'}`,
                          transition: 'all 0.2s', userSelect: 'none',
                        }}>
                          {/* Checkbox */}
                          <div
                            onClick={() => setCheckedTasks(prev => ({ ...prev, [i]: !prev[i] }))}
                            style={{
                              width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                              border: `1.5px solid ${checked ? 'var(--accent-3)' : 'rgba(52,211,153,0.35)'}`,
                              background: checked ? 'var(--accent-3)' : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.2s', cursor: 'pointer',
                            }}
                          >
                            {checked && (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M2 5l2.5 2.5L8 3" stroke="#07090f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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
                                fontSize: 13, outline: 'none', padding: '2px 0',
                              }}
                            />
                          ) : (
                            <span style={{
                              flex: 1,
                              textDecoration: checked ? 'line-through' : 'none',
                              cursor: checked ? 'default' : 'text',
                            }}>
                              {task}
                            </span>
                          )}

                          {/* Edit icon */}
                          {!checked && !isEditing && (
                            <button
                              onClick={() => setEditingTask(i)}
                              style={{
                                background: 'none', border: 'none', padding: 3,
                                color: 'var(--text-muted)', cursor: 'pointer',
                                display: 'flex', alignItems: 'center',
                                borderRadius: 4, transition: 'color 0.2s',
                              }}
                              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                              <EditIcon />
                            </button>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {/* Events */}
              {eventValues.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                    <Calendar size={13} color="var(--accent-warm)" strokeWidth={2} />
                    <span className="tag tag-orange">Events</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {eventValues.map((event, i) => {
                      const isEditing = editingEvent === i
                      return (
                        <div key={i} style={{
                          padding: '10px 14px',
                          background: 'rgba(251,146,60,0.06)',
                          borderRadius: 8,
                          border: '1px solid rgba(251,146,60,0.15)',
                        }}>
                          {/* Title */}
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
                                fontSize: 13, fontWeight: 600, outline: 'none',
                                padding: '2px 0', marginBottom: 6,
                              }}
                            />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-warm)' }}>
                                {event.title}
                              </p>
                              <button
                                onClick={() => setEditingEvent(i)}
                                style={{
                                  background: 'none', border: 'none', padding: 3,
                                  color: 'var(--text-muted)', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center',
                                  borderRadius: 4, transition: 'color 0.2s',
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
                                📅 {event.datetime}
                              </p>
                            )
                          )}

                          {event.notes && !isEditing && (
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                              {event.notes}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Dashboard({ notes, onDelete }) {
  const [search, setSearch] = useState('')

  const filtered = notes.filter(n => {
    const q = search.toLowerCase()
    return (
      n.transcript?.toLowerCase().includes(q) ||
      n.summary?.toLowerCase().includes(q) ||
      n.tasks?.some(t => t.toLowerCase().includes(q)) ||
      n.events?.some(e => e.title?.toLowerCase().includes(q))
    )
  })

  if (notes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', padding: '80px 20px' }}
      >
        <div style={{
          width: 72, height: 72, borderRadius: 20, margin: '0 auto 24px',
          background: 'var(--accent-dim)',
          border: '1px solid rgba(94,234,212,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Mic size={28} color="var(--accent)" strokeWidth={1.5} />
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 24, fontWeight: 800,
          letterSpacing: '-0.03em', marginBottom: 10,
        }}>
          No notes yet
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 300, margin: '0 auto' }}>
          Record your first voice note and AI will turn it into tasks and events.
        </p>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24, gap: 16, flexWrap: 'wrap',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28, fontWeight: 800,
            letterSpacing: '-0.03em', marginBottom: 2,
          }}>
            Your Notes
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {notes.length} note{notes.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
          <Search size={14} color="var(--text-muted)" style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none',
          }} />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '9px 14px 9px 34px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 10, color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)', fontSize: 13,
              outline: 'none', transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e  => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12, marginBottom: 28,
      }}>
        {[
          { icon: Mic,         label: 'Total Notes',  value: notes.length,                                                  color: 'var(--accent)',      bg: 'var(--accent-dim)' },
          { icon: CheckSquare, label: 'Total Tasks',  value: notes.reduce((a, n) => a + (n.tasks?.length  || 0), 0),       color: 'var(--accent-3)',    bg: 'rgba(52,211,153,0.08)' },
          { icon: Calendar,    label: 'Total Events', value: notes.reduce((a, n) => a + (n.events?.length || 0), 0),       color: 'var(--accent-warm)', bg: 'rgba(251,146,60,0.08)' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="glass" style={{ padding: '16px 20px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, marginBottom: 10,
              background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={15} color={color} strokeWidth={2} />
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26, fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)', marginBottom: 2,
            }}>
              {value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Notes list */}
      <AnimatePresence>
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 14 }}
          >
            No notes match "{search}"
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((note, i) => (
              <NoteCard key={note.id} note={note} onDelete={onDelete} index={i} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}