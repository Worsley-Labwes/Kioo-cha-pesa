import { useState, useEffect } from 'react'

// Animates a number from 0 up to `v` (ease-out cubic, ~1s).
export default function useCount(v) {
  const [x, setX] = useState(0)
  useEffect(() => {
    let f, s
    const step = t => {
      s = s || t
      const p = Math.min(1, (t - s) / 1000)
      setX(v * (1 - (1 - p) ** 3))
      if (p < 1) f = requestAnimationFrame(step)
    }
    f = requestAnimationFrame(step)
    return () => cancelAnimationFrame(f)
  }, [v])
  return x
}
