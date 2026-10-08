import { useState } from 'react'
import { K, DAYS, P } from '../lib/constants'

export default function Persona({ a }) {
  const [m, setM] = useState('')
  const pk = a.wd.indexOf(Math.max(...a.wd))
  let p = P[a.cats[0][0]] || P.Other
  if (a.night >= 0.15)
    p = ['🦉', 'The Midnight M-Pesa Owl', `${Math.round(a.night * 100)}% of your payments happen between 10pm and 5am. Sleep is optional, apparently.`]

  const txt = `Kioo cha Pesa · My M-Pesa recap\n${p[0]} ${p[1]}\nSpent ${K(a.spent)} · Fees ${K(a.fees)}\nTop category: ${a.cats[0]?.[0] || 'Other'}\nStormiest day: ${DAYS[pk]}\nPrivate by design: no recipient or transaction details included.`
  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My M-Pesa recap | Kioo cha Pesa', text: txt })
        setM('Recap shared.')
      } else {
        await navigator.clipboard.writeText(txt)
        setM('Recap copied to clipboard.')
      }
    } catch (e) {
      if (e.name !== 'AbortError') setM('Sharing is unavailable in this browser.')
    }
  }

  return (
    <div className="card persona" style={{ '--i': 1 }}>
      <small>Your money personality</small>
      <div className="big">{p[0]}</div>
      <h2>{p[1]}</h2>
      <p>{p[2]}</p>
      <p>⛈️ <b>Forecast:</b> {DAYS[pk]}s are your stormy days — {Math.round((a.wd[pk] / a.spent) * 100)}% of all spending lands there.</p>
      <div className="acts">
        <button className="btn" onClick={share}>Share my recap</button>
        <span>{m}</span>
      </div>
    </div>
  )
}
