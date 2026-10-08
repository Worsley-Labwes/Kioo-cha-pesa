import useCount from '../hooks/useCount'
import { K } from '../lib/constants'

export default function Stat({ l, v, c, s, i }) {
  const x = useCount(v)
  return (
    <div className="card stat" style={{ '--i': i }}>
      <small>{l}</small>
      <b className="mono" style={{ color: c }}>{K(x)}</b>
      <span>{s}</span>
    </div>
  )
}
