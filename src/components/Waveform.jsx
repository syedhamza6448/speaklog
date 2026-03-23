export default function Waveform({ data, isActive }) {
  const bars = Array.from(data).slice(0, 32)
  const maxVal = 255

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2.5,
      height: 44,
      width: '100%',
      overflow: 'hidden',
      padding: '0 8px',
    }}>
      {bars.map((val, i) => {
        const pct    = val / maxVal
        const height = isActive ? Math.max(3, pct * 40) : 3
        const center = Math.abs(i - bars.length / 2) / (bars.length / 2)
        const opacity = isActive ? 0.4 + pct * 0.6 : 0.2 + (1 - center) * 0.2

        return (
          <div key={i} style={{
            width: 2.5,
            height: `${height}px`,
            maxHeight: 40,
            borderRadius: 99,
            flexShrink: 0,
            background: isActive
              ? `rgba(94,234,212,${opacity})`
              : `rgba(255,255,255,${opacity})`,
            transition: 'height 0.06s ease, background 0.3s ease',
          }} />
        )
      })}
    </div>
  )
}