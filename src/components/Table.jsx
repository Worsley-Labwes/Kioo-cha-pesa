import { CC, CE } from '../lib/constants'

export default function Table({ tx, f, setF }) {
  const rows = tx.filter(t => !f || t.cat === f).sort((a, b) => b.d - a.d).slice(0, 40)
  return (
    <div className="card" style={{ '--i': 7, marginTop: 16 }}>
      <div className="rt">
        <h3>Latest transactions</h3>
        {f && <button className="btn alt" onClick={() => setF(null)}>{f} ✕</button>}
      </div>
      <div className="sc">
        <table>
          <thead>
            <tr><th>When</th><th>What</th><th>Type</th><th style={{ textAlign: 'right' }}>Amount</th><th>Fee</th></tr>
          </thead>
          <tbody>
            {rows.map((t, i) => (
              <tr key={i}>
                <td>{t.d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}</td>
                <td>{t.who}</td>
                <td><span className="pill" style={{ background: CC[t.cat] || 'var(--g)' }}>{CE[t.cat]} {t.cat}</span></td>
                <td className={'mono ' + t.dir} style={{ textAlign: 'right' }}>{t.dir === 'in' ? '+' : '−'}{Math.round(t.amt).toLocaleString()}</td>
                <td className="mono">{t.fee || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
