import { Mic, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      marginTop: 80,
      padding: '28px 20px',
    }}>
      <div style={{
        maxWidth: 780,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: 'var(--accent-dim)',
            border: '1px solid rgba(94,234,212,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Mic size={12} color="var(--accent)" strokeWidth={2.5} />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: '-0.02em',
          }}>
            Speak<span style={{ color: 'var(--accent)' }}>Log</span>
          </span>
        </div>

        {/* Center text */}
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Built by{' '}
          <a
            href="https://syed-hamza.vercel.app"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--accent)', textDecoration: 'none' }}
          >
            Hamza
          </a>
          {' '}· Powered by Groq & OpenRouter
        </p>

        {/* GitHub */}
        <a
          href="https://github.com/syedhamza6448/speaklog"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: 'var(--text-muted)',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Github size={14} strokeWidth={2} />
          View source
        </a>

      </div>
    </footer>
  )
}