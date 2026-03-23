import { Mic, LayoutGrid } from 'lucide-react'

export default function Header({ view, setView, noteCount }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: '1px solid var(--border)',
      background: 'rgba(7,9,15,0.82)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
    }}>
      <div style={{
        maxWidth: 780, margin: '0 auto', padding: '0 20px',
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo — click to go home */}
        <button
          onClick={() => setView('hero')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'var(--accent-dim)',
            border: '1px solid rgba(94,234,212,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Mic size={15} color="var(--accent)" strokeWidth={2.5} />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800, fontSize: 19,
            letterSpacing: '-0.03em', color: 'var(--text-primary)',
          }}>
            Speak<span style={{ color: 'var(--accent)' }}>Log</span>
          </span>
        </button>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { id: 'record',    label: 'Record',  Icon: Mic },
            { id: 'dashboard', label: noteCount > 0 ? `Notes (${noteCount})` : 'Notes', Icon: LayoutGrid },
          ].map(({ id, label, Icon }) => {
            const active = view === id
            return (
              <button key={id} onClick={() => setView(id)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 8, border: 'none',
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.18s',
                background: active ? 'var(--accent-dim)' : 'transparent',
                color:      active ? 'var(--accent)'     : 'var(--text-secondary)',
                outline:    active ? '1px solid rgba(94,234,212,0.25)' : '1px solid transparent',
              }}>
                <Icon size={13} strokeWidth={2.2} />
                {label}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}