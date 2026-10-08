import { K } from '../lib/constants'

// GitHub-style calendar: one square per day, redder = heavier spending.
export default function Heat({ a }) {
  const W = Math.min(18, Math.max(4, Math.ceil((a.to - a.from) / 6048e5) + 1))
  const end = new Date(a.to.getFullYear(), a.to.getMonth(), a.to.getDate())
  const start = new Date(end)
  start.setDate(end.getDate() - ((end.getDay() + 6) % 7) - 7 * (W - 1))

  const cells = []
  for (let w = 0; w < W; w++)
    for (let r = 0; r < 7; r++) {
      const d = new Date(start)
      d.setDate(start.getDate() + w * 7 + r)
      if (d > end) continue
      cells.push({ w, r, d, v: a.day[+d] || 0 })
    }

  return (
    <div className="card" style={{ '--i': 5 }}>
      <h3>Money weather</h3>
      <small>Each square is a day · redder = heavier spending</small>
      <svg viewBox={`0 0 ${22 + W * 17} 120`} width="100%" style={{ marginTop: 10 }}>
        {[['M', 0], ['W', 2], ['F', 4]].map(([l, r]) => (
          <text key={l} x="0" y={r * 17 + 11} fontSize="9" fill="var(--mute)">{l}</text>
        ))}
        {cells.map(c => (
          <rect
            key={c.w + '-' + c.r} x={22 + c.w * 17} y={c.r * 17} width="14" height="14" rx="4"
            fill={c.v ? 'var(--red)' : 'var(--line)'}
            fillOpacity={c.v ? 0.18 + 0.82 * Math.sqrt(c.v / a.mx) : 1}
          >
            <title>{c.d.toDateString()} · {c.v ? K(c.v) : 'no spending'}</title>
          </rect>
        ))}
      </svg>
    </div>
  )
}
