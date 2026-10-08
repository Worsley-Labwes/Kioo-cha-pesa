import { K } from '../lib/constants'

export default function Spark({ tx }) {
  const p = tx.filter(t => typeof t.bal === 'number').sort((x, y) => x.d - y.d)
  if (p.length < 4) return null
  const t0 = +p[0].d
  const t1 = +p[p.length - 1].d
  const lo = Math.min(...p.map(t => t.bal))
  const hi = Math.max(...p.map(t => t.bal))
  const W = 320, H = 90
  const L = 'M' + p.map(t => [((t.d - t0) / (t1 - t0 || 1)) * W, H - 6 - ((t.bal - lo) / (hi - lo || 1)) * (H - 14)].map(Math.round).join(',')).join('L')

  return (
    <div className="card" style={{ '--i': 6 }}>
      <h3>Your balance, over time</h3>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%">
        <path d={L + `L${W},${H}L0,${H}Z`} fill="var(--g)" fillOpacity=".13" />
        <path d={L} fill="none" stroke="var(--g)" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
      <div className="rt">
        <span>Low <b className="mono">{K(lo)}</b></span>
        <span>High <b className="mono">{K(hi)}</b></span>
      </div>
    </div>
  )
}
