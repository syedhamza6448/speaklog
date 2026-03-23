import { motion } from 'framer-motion'
import { FileText, CheckSquare, Calendar } from 'lucide-react'

export default function ResultCard({ result }) {
  return (
    <div className="glass" style={{ padding: '32px', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18, fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 8,
        }}>
          AI Output
        </p>
        {result.transcript && (
          <p style={{
            fontSize: 13, color: 'var(--text-secondary)',
            fontStyle: 'italic', lineHeight: 1.6,
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 8,
            borderLeft: '2px solid var(--border-bright)',
          }}>
            "{result.transcript}"
          </p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Summary */}
        {result.summary && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <FileText size={14} color="var(--accent-2)" strokeWidth={2} />
              <span className="tag tag-purple">Summary</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7 }}>
              {result.summary}
            </p>
          </motion.div>
        )}

        {/* Divider */}
        {result.summary && result.tasks?.length > 0 && (
          <div style={{ height: 1, background: 'var(--border)' }} />
        )}

        {/* Tasks */}
        {result.tasks?.length > 0 && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <CheckSquare size={14} color="var(--accent-3)" strokeWidth={2} />
              <span className="tag tag-teal">Tasks</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>
                {result.tasks.length} item{result.tasks.length !== 1 ? 's' : ''}
              </span>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.tasks.map((task, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    fontSize: 14, color: 'var(--text-primary)',
                    padding: '8px 12px',
                    background: 'rgba(52,211,153,0.05)',
                    borderRadius: 8,
                    border: '1px solid rgba(52,211,153,0.1)',
                  }}
                >
                  <span style={{
                    width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                    border: '1.5px solid rgba(52,211,153,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }} />
                  {task}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Divider */}
        {result.tasks?.length > 0 && result.events?.length > 0 && (
          <div style={{ height: 1, background: 'var(--border)' }} />
        )}

        {/* Events */}
        {result.events?.length > 0 && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Calendar size={14} color="var(--accent-warm)" strokeWidth={2} />
              <span className="tag tag-orange">Calendar Events</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.events.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(251,146,60,0.06)',
                    borderRadius: 10,
                    border: '1px solid rgba(251,146,60,0.15)',
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-warm)', marginBottom: 3 }}>
                    {event.title}
                  </p>
                  {event.datetime && (
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      📅 {event.datetime}
                    </p>
                  )}
                  {event.notes && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                      {event.notes}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}