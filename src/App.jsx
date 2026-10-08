import { useState, useEffect } from 'react'
import { parseSMS, parseCSV } from './lib/parse'
import { analyse } from './lib/analyse'
import { sample } from './lib/sample'
import Stat from './components/Stat'
import Persona from './components/Persona'
import Fees from './components/Fees'
import Donut from './components/Donut'
import Board from './components/Board'
import Heat from './components/Heat'
import Spark from './components/Spark'
import Table from './components/Table'
import Compare from './components/Compare'
import { CE, K } from './lib/constants'

const PH = 'Paste your M-Pesa SMS messages or a statement CSV here…\n\nQJ12AB34CD Confirmed. Ksh500.00 sent to JANE DOE 0712345678 on 5/10/26 at 2:15 PM. New M-PESA balance is Ksh1,200.00. Transaction cost, Ksh7.00.'
const fd = x => x.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })
const monthKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
const monthLabel = key => {
  const [year, month] = key.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })
}
const previousMonth = key => {
  const [year, month] = key.split('-').map(Number)
  return monthKey(new Date(year, month - 2, 1))
}
const periodTotals = (txs, ex) => {
  const out = txs.filter(t => t.dir === 'out')
  const categories = {}
  out.forEach(t => { categories[t.cat] = (categories[t.cat] || 0) + t.amt })
  return {
    spent: out.reduce((sum, t) => sum + t.amt, 0),
    fees: txs.reduce((sum, t) => sum + (t.fee || 0), 0) + ex.reduce((sum, row) => sum + row.amt, 0),
    cats: Object.entries(categories).sort((a, b) => b[1] - a[1]),
  }
}

export default function App() {
  const [txt, setTxt] = useState('')
  const [d, setD] = useState(null)
  const [err, setErr] = useState('')
  const [f, setF] = useState(null)
  const [period, setPeriod] = useState('all')
  const [dark, setDark] = useState(null)

  useEffect(() => {
    if (dark !== null) document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  const run = t => {
    try {
      const p = /paid in/i.test(t) ? parseCSV(t) : parseSMS(t)
      if (!p.txs.some(x => x.dir === 'out')) {
        setErr("I couldn't spot any M-Pesa payments in that. Paste SMS messages (the ones starting with a code like QJ12AB34CD Confirmed…) or a CSV with Paid In / Withdrawn columns — or tap “Try sample data”.")
        return
      }
      setErr('')
      setF(null)
      setPeriod('all')
      setD({ tx: p.txs, ex: p.ex })
      setTimeout(() => document.getElementById('res')?.scrollIntoView({ behavior: 'smooth' }), 60)
    } catch (e) {
      setErr('That text confused me — ' + e.message)
    }
  }

  const load = e => {
    const fl = e.target.files[0]
    if (fl) fl.text().then(t => { setTxt(t); run(t) })
  }
  const demo = () => {
    const t = sample()
    setTxt(t)
    run(t)
  }

  const periods = d ? [...new Set(d.tx.map(t => monthKey(t.d)))].sort().reverse() : []
  const tx = d ? (period === 'all' ? d.tx : d.tx.filter(t => monthKey(t.d) === period)) : []
  const ex = d ? (period === 'all' ? d.ex : d.ex.filter(t => monthKey(t.d) === period)) : []
  const a = d ? analyse(tx, ex) : null
  const [leadCat, leadAmount] = a?.cats[0] || ['Other', 0]
  const previousKey = period !== 'all' ? previousMonth(period) : null
  const previousTx = previousKey ? d.tx.filter(t => monthKey(t.d) === previousKey) : []
  const previousEx = previousKey ? d.ex.filter(row => monthKey(row.d) === previousKey) : []
  const previous = previousTx.length || previousEx.length ? periodTotals(previousTx, previousEx) : null
  const comparisonDates = d ? [...d.tx, ...d.ex].map(row => row.d).sort((x, y) => x - y) : []
  const firstDate = comparisonDates[0]
  const lastDate = comparisonDates[comparisonDates.length - 1]
  const isPartialMonth = key => {
    if (!firstDate || !lastDate) return false
    const [year, month] = key.split('-').map(Number)
    const firstPartial = key === monthKey(firstDate) && firstDate.getDate() > 1
    const lastPartial = key === monthKey(lastDate) && lastDate.getDate() < new Date(year, month, 0).getDate()
    return firstPartial || lastPartial
  }

  return (
    <>
      <div className="strip"></div>
      <div className="wrap">
        <div className="top">
          <b>Kioo cha Pesa · M-Pesa Decoder</b>
          <button className="btn alt" onClick={() => setDark(x => (x === null ? !matchMedia('(prefers-color-scheme:dark)').matches : !x))}>🌗</button>
        </div>
        <section className="hero">
          <p className="eyebrow">M-PESA MONEY, MADE VISIBLE</p>
          <h1>Kioo cha Pesa</h1>
          <p className="sub">Your M-Pesa story, decoded. See where every shilling went, what it cost, and the habits hiding in your transactions.</p>
          <div className="hero-actions">
            <button className="btn" onClick={demo}>View sample dashboard</button>
            <button className="btn alt" onClick={() => document.getElementById('input')?.scrollIntoView({ behavior: 'smooth' })}>Use my statement ↓</button>
            <span className="privacy-note">🔒 Your data stays in this browser</span>
          </div>
        </section>

        <div className="card input-card" id="input">
          <div className="input-heading">
            <div>
              <small>START WITH YOUR OWN DATA</small>
              <h2>Bring your M-Pesa activity</h2>
            </div>
            <span className="input-note">SMS messages or CSV statement</span>
          </div>
          <textarea value={txt} placeholder={PH} onChange={e => setTxt(e.target.value)}></textarea>
          <div className="acts">
            <button className="btn" onClick={() => run(txt)}>Decode my data</button>
            <button className="btn alt" onClick={demo}>Load sample data</button>
            <label className="btn alt">
              📂 Upload CSV/TXT
              <input type="file" accept=".csv,.txt,text/*" hidden onChange={load} />
            </label>
          </div>
          {err && <div className="err">{err}</div>}
          <details>
            <summary>How do I get my data?</summary>
            <p>Easiest: copy your M-Pesa confirmation SMS messages and paste them. You can also use a statement exported as CSV with Receipt No., Completion Time, Details, Paid In, Withdrawn and Balance columns. PDF statements aren't read directly yet.</p>
          </details>
        </div>

        {a && (
          <div id="res">
            <div className="results-head">
              <div>
                <small>YOUR MONEY, IN FOCUS</small>
                <h2>Here’s what your activity says</h2>
                <p className="results-range mono">{fd(a.from)} → {fd(a.to)} · {a.n} transactions</p>
              </div>
              <label className="period-control">
                <span>Show period</span>
                <select value={period} onChange={e => { setPeriod(e.target.value); setF(null) }}>
                  <option value="all">All activity</option>
                  {periods.map(key => <option key={key} value={key}>{monthLabel(key)}</option>)}
                </select>
              </label>
            </div>
            {a.spent > 0 ? (
              <section className="insight">
                <div>
                  <small>YOUR TOP SPENDING CATEGORY</small>
                  <h2>{CE[leadCat]} {leadCat}</h2>
                  <p>{Math.round((leadAmount / a.spent) * 100)}% of your outgoing money went here.</p>
                </div>
                <strong className="mono">{K(leadAmount)}</strong>
              </section>
            ) : (
              <div className="empty-period">
                <b>No outgoing payments in this period</b>
                <span>Incoming transfers and transaction details are still shown below.</span>
              </div>
            )}
            {period !== 'all' && (
              <Compare
                current={{ spent: a.spent, fees: a.fees, cats: a.cats }}
                previous={previous}
                currentLabel={monthLabel(period)}
                previousLabel={monthLabel(previousKey)}
                partial={isPartialMonth(period) || isPartialMonth(previousKey)}
              />
            )}
            <div className="stats">
              <Stat i={0} l="Money in" v={a.got} c="var(--g)" s="everything you received" />
              <Stat i={1} l="Money out" v={a.spent} c="var(--red)" s="everything you spent" />
              <Stat i={2} l="Fees & Fuliza" v={a.fees} c="var(--gold)" s="the price of convenience" />
              <Stat i={3} l="Net flow" v={a.got - a.spent} c={a.got >= a.spent ? 'var(--g)' : 'var(--red)'} s={a.got >= a.spent ? 'more came in than went out' : 'more went out than came in'} />
            </div>
            {a.spent > 0 && (
              <div className="grid">
                <Persona a={a} />
                <Fees a={a} />
                <Donut a={a} f={f} setF={setF} />
                <Board a={a} />
                <Heat a={a} />
                <Spark tx={tx} />
              </div>
            )}
            <Table tx={tx} f={f} setF={setF} />
          </div>
        )}

        <footer>Made with React · categories are keyword-based guesses · your data never leaves this tab 💚</footer>
      </div>
    </>
  )
}
