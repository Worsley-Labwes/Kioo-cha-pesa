import { useState, useEffect } from 'react'
import { K, CC, CE } from '../lib/constants'

export default function Donut({ a, f, setF }) {
  const [on, setOn] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setOn(1), 80)
    return () => clearTimeout(t)
  }, [])
  const C = 2 * Math.PI * 44
  let acc = 0

  return (
    <div className="card" style={{ '--i': 3 }}>
      <h3>Where it went</h3>
      <small>Tap a slice to filter the list below</small>
      <div className="donut">
        <svg viewBox="0 0 120 120" width="190" height="190" style={{ flex: 'none' }}>
          <circle cx="60" cy="60" r="44" fill="none" stroke="var(--line)" strokeWidth="16" />
          {a.cats.map(([c, v]) => {
            const l = (v / a.spent) * C
            const o = acc
            acc += l
            return (
              <circle
                key={c} cx="60" cy="60" r="44" fill="none" stroke={CC[c]} strokeWidth="16"
                strokeDasharray={on ? `${Math.max(l - 1.5, 0)} ${C}` : `0 ${C}`}
                strokeDashoffset={-o}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dasharray 1.1s ease', opacity: f && f !== c ? 0.25 : 1, cursor: 'pointer' }}
                onClick={() => setF(f === c ? null : c)}
              />
            )
          })}
          <text x="60" y="57" textAnchor="middle" fontSize="8" fill="var(--mute)">spent</text>
          <text x="60" y="70" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--ink)" className="mono">{K(a.spent)}</text>
        </svg>
        <div className="legend">
          {a.cats.map(([c, v]) => (
            <button key={c} className="lg" style={{ opacity: f && f !== c ? 0.4 : 1 }} onClick={() => setF(f === c ? null : c)}>
              <i style={{ background: CC[c] }}></i>
              <span>{CE[c]} {c}</span>
              <b className="mono">{Math.round((v / a.spent) * 100)}%</b>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
