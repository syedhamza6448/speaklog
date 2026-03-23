import { motion } from 'framer-motion'
import { Mic, Sparkles, CheckSquare, Calendar } from 'lucide-react'

const features = [
    { icon: Mic, label: 'Voice Recording', desc: 'One tap to capture', color: 'var(--accent)' },
    { icon: Sparkles, label: 'AI Processing', desc: 'Instant analysis', color: 'var(--accent-2)' },
    { icon: CheckSquare, label: 'Smart Tasks', desc: 'Auto-extracted to-dos', color: 'var(--accent-3)' },
    { icon: Calendar, label: 'Calendar Events', desc: 'Dates & times detected', color: 'var(--accent-warm)' },
]

export default function Hero({ onStart }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', padding: '60px 20px 80px' }}
        >
            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 99,
                    background: 'var(--accent-dim)',
                    border: '1px solid rgba(94,234,212,0.2)',
                    fontSize: 12, fontWeight: 600,
                    color: 'var(--accent)', letterSpacing: '0.05em',
                    marginBottom: 32,
                }}
            >
                <Sparkles size={11} strokeWidth={2.5} />
                AI-Powered Voice Notes
            </motion.div>

            {/* Headline */}
            <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(36px, 6vw, 64px)',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    lineHeight: 1.05,
                    marginBottom: 24, color: 'var(--text-primary)',
                }}
            >
                Your voice notes,<br />
                <span style={{ color: 'var(--accent)' }}>finally organized.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                    fontSize: 17, color: 'var(--text-secondary)',
                    maxWidth: 460, margin: '0 auto 48px',
                    lineHeight: 1.7,
                }}
            >
                Record any idea. AI turns it into tasks, a summary,
                and calendar events — automatically.
            </motion.p>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{ marginBottom: 64 }}
            >
                <button onClick={onStart} className="btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>
                    <Mic size={18} strokeWidth={2.5} />
                    Start Recording
                </button>
                <p style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                    No signup. No setup. Works in your browser.
                </p>
            </motion.div>

            {/* Feature pills */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 12, maxWidth: 680, margin: '0 auto',
                }}
            >
                {features.map(({ icon: Icon, label, desc, color }, i) => (
                    <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 + i * 0.07 }}
                        className="glass"
                        style={{ padding: '16px 20px', textAlign: 'left' }}
                    >
                        <div style={{
                            width: 34, height: 34, borderRadius: 9,
                            background: `${color}18`,
                            border: `1px solid ${color}30`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: 10,
                        }}>
                            <Icon size={15} color={color} strokeWidth={2} />
                        </div>
                        <p style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 14, fontWeight: 700,
                            color: 'var(--text-primary)', marginBottom: 3,
                        }}>
                            {label}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {desc}
                        </p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}