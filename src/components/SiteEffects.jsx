import { useEffect, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring } from 'framer-motion'
import HeroBackground from './HeroBackground'

/* Fixed aurora behind every page — the home-hero look, site-wide. */
export function SiteBackground() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden>
      <HeroBackground global />
    </div>
  )
}

/* Thin gradient bar showing scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] bg-gradient-to-r from-violet-500 via-pink-500 to-accent"
      style={{ scaleX }}
    />
  )
}

/* Soft light that trails the cursor (desktop / fine pointers only). */
export function CursorGlow() {
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const sx = useSpring(x, { stiffness: 90, damping: 20, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 90, damping: 20, mass: 0.6 })

  useEffect(() => {
    if (!enabled) return
    const move = (e) => {
      x.set(e.clientX - 250)
      y.set(e.clientY - 250)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [enabled, x, y])

  if (!enabled) return null
  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none z-[2] mix-blend-screen"
      style={{
        x: sx,
        y: sy,
        background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(190,24,93,0.08) 40%, transparent 70%)',
      }}
    />
  )
}
