import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'

/* ──────────────────────────────────────────────
   3D tilt wrapper — the surface leans toward the cursor
   and a soft light "glare" follows the pointer.
   Mouse only (touch devices keep normal scrolling).
   ────────────────────────────────────────────── */
export default function TiltSurface({ children, max = 10, glare = true, className = '', style, ...rest }) {
  const ref = useRef(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const hover = useMotionValue(0)

  const spring = { stiffness: 220, damping: 22, mass: 0.6 }
  const sx = useSpring(px, spring)
  const sy = useSpring(py, spring)
  const sh = useSpring(hover, { stiffness: 160, damping: 20 })

  const rotateY = useTransform(sx, [0, 1], [-max, max])
  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const gx = useTransform(sx, [0, 1], [0, 100])
  const gy = useTransform(sy, [0, 1], [0, 100])
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.22), transparent 55%)`

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
    hover.set(1)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
    hover.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
      style={{ ...style, rotateX, rotateY, transformPerspective: 900 }}
      {...rest}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{ background: glareBg, opacity: sh }}
        />
      )}
    </motion.div>
  )
}
