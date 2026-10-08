import { CE, K } from '../lib/constants'

export default function Compare({ current, previous, currentLabel, previousLabel, partial }) {
  if (!previous) {
    return (
      <section className="comparison comparison-empty">
        <div>
          <small>WHAT CHANGED?</small>
          <h3>Not enough previous-month data</h3>
          <p>Include {previousLabel} in your statement to see a month-to-month comparison.</p>
        </div>
      </section>
    )
  }

  const difference = current.spent - previous.spent
  const percent = previous.spent ? Math.round(Math.abs(difference) / previous.spent * 100) : null
  const categories = [...new Set([...current.cats.map(([name]) => name), ...previous.cats.map(([name]) => name)])]
  const currentCategories = Object.fromEntries(current.cats)
  const previousCategories = Object.fromEntries(previous.cats)
  const largestShift = categories
    .map(name => ({ name, amount: (currentCategories[name] || 0) - (previousCategories[name] || 0) }))
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0]
  const title = difference === 0
    ? 'Spending stayed level'
    : previous.spent === 0
      ? `Spending started at ${K(current.spent)}`
      : `Spent ${percent}% ${difference > 0 ? 'more' : 'less'}`

  return (
    <section className="comparison">
      <div className="comparison-top">
        <div>
          <div className="comparison-title">
            <small>WHAT CHANGED?</small>
            {partial && <span className="comparison-tag">PARTIAL PERIOD</span>}
          </div>
          <h3>{title}{previous.spent > 0 && difference !== 0 ? ` than ${previousLabel}` : ''}</h3>
          <p>{K(current.spent)} in {currentLabel} vs {K(previous.spent)} in {previousLabel}</p>
        </div>
        <strong className="mono">{difference > 0 ? '+' : difference < 0 ? '−' : ''}{K(Math.abs(difference))}</strong>
      </div>
      <div className="comparison-details">
        <div>
          <small>FEES & FULIZA</small>
          <b>{K(Math.abs(current.fees - previous.fees))} {current.fees > previous.fees ? 'more' : current.fees < previous.fees ? 'less' : 'unchanged'}</b>
          <span>than {previousLabel}</span>
        </div>
        {largestShift && (
          <div>
            <small>BIGGEST CATEGORY SHIFT</small>
            <b>{CE[largestShift.name]} {largestShift.name}</b>
            <span>{largestShift.amount > 0 ? 'up' : largestShift.amount < 0 ? 'down' : 'unchanged'} {K(Math.abs(largestShift.amount))} from {previousLabel}</span>
          </div>
        )}
      </div>
      <p className="comparison-note">{partial ? 'Partial date range in this statement; totals reflect the transactions provided.' : 'Compared with the previous calendar month in this statement.'}</p>
    </section>
  )
}