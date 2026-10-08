import { K } from '../lib/constants'

export default function Fees({ a }) {
  return (
    <div className="card" style={{ '--i': 2 }}>
      <small>The fee reality-check</small>
      <div className="big mono">{K(a.fees)}</div>
      {a.fees > 0 ? (
        <>
          <p>
            That's about <b>{Math.round(a.fees / 10).toLocaleString()} mandazis 🍩</b> (at KSh 10 each) — {((a.fees / a.spent) * 100).toFixed(1)}% of what you spent — gone to transaction costs and Fuliza charges.
          </p>
          <p className="tip">💡 Paying merchants via Till usually costs you nothing, while Send Money has tiered fees. Bundling small sends into one can save real shillings.</p>
        </>
      ) : (
        <p>No fees found 🎉 — or your data didn't include them (SMS messages do; some CSV exports list charges as separate rows).</p>
      )}
    </div>
  )
}
