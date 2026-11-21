import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/* ──────────────────────────────────────────────
   Aurora / Mesh-Gradient Background
   – Large glowing blobs drift and breathe
   – Thin mesh-line overlay for depth
   – SVG film-grain texture layer
   – Mouse parallax on the blob layer
   Used by the home hero AND (with `global`) as the
   fixed site-wide background.
   ────────────────────────────────────────────── */

const BLOBS = [
  /* color,          size,  top,   left,  animDur, delay */
  { color: '#7c3aed', size: '70vw', top: '-20%', left: '-20%', dur: 20, delay: 0   },  // deep violet — top-left
  { color: '#6d28d9', size: '55vw', top: '30%',  left: '55%',  dur: 25, delay: 3   },  // indigo — right-center
  { color: '#be185d', size: '45vw', top: '55%',  left: '-10%', dur: 18, delay: 6   },  // deep pink — bottom-left
  { color: '#1d4ed8', size: '40vw', top: '-10%', left: '60%',  dur: 22, delay: 2   },  // blue — top-right
  { color: '#5b21b6', size: '35vw', top: '65%',  left: '65%',  dur: 28, delay: 8   },  // violet — bottom-right
]

/* Each blob drifts on a unique path using JS keyframes */
const DRIFT_PATHS = [
  { x: [0, 80, -40, 60, 0],  y: [0, 60, 120, 40, 0]  },
  { x: [0, -60, 40, -80, 0], y: [0, -50, 80, -30, 0] },
  { x: [0, 100, 20, 60, 0],  y: [0, -40, -80, 20, 0] },
  { x: [0, -50, -100, 20, 0],y: [0, 80, 20, -60, 0]  },
  { x: [0, 60, -30, -70, 0], y: [0, -60, 60, 20, 0]  },
]

function AuroraBlob({ color, size, top, left, dur, delay, driftX, driftY, still }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none will-change-transform"
      style={{
        width: size,
        height: size,
        top,
        left,
        background: `radial-gradient(circle at 40% 40%, ${color}cc 0%, ${color}66 35%, transparent 70%)`,
        filter: 'blur(80px)',
        mixBlendMode: 'screen',
      }}
      animate={still ? undefined : { x: driftX, y: driftY }}
      transition={{
        duration: dur,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
        delay,
        times: [0, 0.25, 0.5, 0.75, 1],
      }}
    />
  )
}

/* ── SVG film-grain ── */
function FilmGrain() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
        opacity: 0.55,
        animation: 'grain 0.4s steps(2) infinite',
      }}
    />
  )
}

/* ── A subtle radial vignette in the center to make text pop ── */
function CenterLight() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 70%)',
      }}
    />
  )
}

/* ── Mouse-parallax wrapper — only moves the blobs layer slightly.
      Listens on `window` because the background itself is pointer-events:none. ── */
function MouseLayer({ children, disabled }) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 20, damping: 25 })
  const y = useSpring(rawY, { stiffness: 20, damping: 25 })

  useEffect(() => {
    if (disabled) return
    const handler = (e) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 40)
      rawY.set((e.clientY / window.innerHeight - 0.5) * 28)
    }
    window.addEventListener('pointermove', handler, { passive: true })
    return () => window.removeEventListener('pointermove', handler)
  }, [rawX, rawY, disabled])

  return (
    <motion.div className="absolute inset-0" style={{ x, y, scale: 1.08 }}>
      {children}
    </motion.div>
  )
}

/* ──────────── Main Export ──────────── */
export default function HeroBackground({ global = false }) {
  const reduce = useReducedMotion()

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Pure black base */}
      <div className="absolute inset-0 bg-black" />

      {/* Aurora blobs — mouse-parallax */}
      <MouseLayer disabled={reduce}>
        {BLOBS.map((b, i) => (
          <AuroraBlob
            key={i}
            {...b}
            still={reduce}
            driftX={DRIFT_PATHS[i].x}
            driftY={DRIFT_PATHS[i].y}
          />
        ))}
      </MouseLayer>

      {/* Center glow to lift mid-screen */}
      <CenterLight />

      {/* Film grain on top */}
      <FilmGrain />

      {global ? (
        /* Site-wide: dim the whole aurora a touch so body text stays readable */
        <div className="absolute inset-0 bg-black/35" />
      ) : (
        <>
          {/* Strong bottom fade so nav/footer are clean */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{ height: '40%', background: 'linear-gradient(to top, #000 0%, transparent 100%)' }}
          />
          {/* Soft top fade */}
          <div
            className="absolute inset-x-0 top-0 pointer-events-none"
            style={{ height: '20%', background: 'linear-gradient(to bottom, #000 0%, transparent 100%)' }}
          />
        </>
      )}
    </div>
  )
}
