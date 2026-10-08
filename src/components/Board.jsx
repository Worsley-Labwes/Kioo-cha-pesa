import { K, CC, CE } from '../lib/constants'

export default function Board({ a }) {
  return (
    <div className="card" style={{ '--i': 4 }}>
      <h3>Your top places & people</h3>
      <small>Where your shillings love to go</small>
      {a.top.map(([n, w], i) => (
        <div key={n} className="row">
          <div className="rt">
            <span>{CE[w.cat]} {n}</span>
            <span className="mono">{K(w.amt)} · {w.n}×</span>
          </div>
          <div className="bar">
            <i style={{ width: (w.amt / a.top[0][1].amt) * 100 + '%', background: CC[w.cat], animationDelay: i * 90 + 'ms' }}></i>
          </div>
        </div>
      ))}
    </div>
  )
}
