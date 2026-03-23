export default function Waveform({ data, isActive }) {
  const bars = Array.from(data).slice(0, 28)
  const maxVal = 255

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      height: 40,
      width: '100%',
      overflow: 'hidden',
    }}>
      {bars.map((val, i) => {
        const pct = val / maxVal
        const height = isActive ? Math.max(3, pct * 36) : 3

        return (
          <div key={i} style={{
            width: 3,
            height: `${height}px`,
            maxHeight: 36,
            borderRadius: 99,
            flexShrink: 0,
            background: isActive
              ? `rgba(94,234,212,${0.35 + pct * 0.65})`
              : 'var(--text-muted)',
            transition: 'height 0.08s ease, background 0.3s ease',
          }} />
        )
      })}
    </div>
  )
}