import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/* ── Deterministic pseudo-random from seed ── */
const seeded = (seed) => {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

/* ── Shared slow-drift framer variant ── */
const drift = (delay = 0, duration = 12) => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 1.5, delay },
  },
})

/* ── Floating Cube ── */
function FloatingCube({ size, x, y, rotX, rotY, rotZ, color, delay, speed }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, delay }}
    >
      <motion.div
        style={{
          width: size,
          height: size,
          transformStyle: 'preserve-3d',
          perspective: 800,
        }}
        animate={{
          rotateX: [rotX, rotX + 180, rotX + 360],
          rotateY: [rotY, rotY + 240, rotY + 360],
          rotateZ: [rotZ, rotZ + 90, rotZ + 360],
          y: [0, -18, 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
          delay,
        }}
      >
        {/* Six cube faces */}
        {[
          { transform: `translateZ(${size / 2}px)` },
          { transform: `translateZ(-${size / 2}px) rotateY(180deg)` },
          { transform: `rotateY(90deg) translateZ(${size / 2}px)` },
          { transform: `rotateY(-90deg) translateZ(${size / 2}px)` },
          { transform: `rotateX(90deg) translateZ(${size / 2}px)` },
          { transform: `rotateX(-90deg) translateZ(${size / 2}px)` },
        ].map((face, i) => (
          <div
            key={i}
            style={{
              ...face,
              position: 'absolute',
              width: size,
              height: size,
              border: `1px solid ${color}`,
              background: `${color}08`,
              backfaceVisibility: 'visible',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

/* ── Spinning Ring ── */
function SpinningRing({ cx, cy, radius, color, delay, speed, tilt }) {
  const size = radius * 2
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${cx}%`,
        top: `${cy}%`,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, delay }}
    >
      <motion.div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: `1.5px solid ${color}`,
          transformStyle: 'preserve-3d',
          boxShadow: `0 0 20px ${color}22, inset 0 0 20px ${color}11`,
        }}
        animate={{
          rotateX: [tilt, tilt + 360],
          rotateZ: [0, 360],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
          delay,
        }}
      />
    </motion.div>
  )
}

/* ── Glowing Orb ── */
function GlowOrb({ cx, cy, radius, color, delay, speed }) {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      style={{
        left: `${cx}%`,
        top: `${cy}%`,
        width: radius * 2,
        height: radius * 2,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${color}30 0%, ${color}08 50%, transparent 70%)`,
        filter: `blur(${radius * 0.4}px)`,
      }}
      animate={{
        scale: [1, 1.25, 1],
        opacity: [0.4, 0.8, 0.4],
        x: [0, 20, -15, 0],
        y: [0, -25, 10, 0],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  )
}

/* ── Particle Field ── */
function ParticleField({ count = 60 }) {
  const rand = seeded(42)
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const x = rand() * 100
        const y = rand() * 100
        const size = rand() * 2.5 + 0.5
        const dur = rand() * 8 + 6
        const del = rand() * 6
        const opacity = rand() * 0.5 + 0.1
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
            animate={{
              opacity: [0, opacity, 0],
              y: [0, -(rand() * 60 + 20)],
              x: [0, (rand() - 0.5) * 30],
            }}
            transition={{
              duration: dur,
              repeat: Infinity,
              delay: del,
              ease: 'easeOut',
            }}
          />
        )
      })}
    </div>
  )
}

/* ── Grid Lines (perspective) ── */
function PerspectiveGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ perspective: '800px', perspectiveOrigin: '50% 60%' }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '55%',
          transform: 'rotateX(72deg)',
          transformOrigin: 'bottom center',
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}

/* ── Mouse-parallax wrapper ── */
function MouseParallax({ children }) {
  const ref = useRef(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 40, damping: 20 })
  const y = useSpring(rawY, { stiffness: 40, damping: 20 })

  useEffect(() => {
    const el = ref.current?.parentElement
    if (!el) return
    const handler = (e) => {
      const rect = el.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width - 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5
      rawX.set(nx * 24)
      rawY.set(ny * 16)
    }
    el.addEventListener('mousemove', handler)
    return () => el.removeEventListener('mousemove', handler)
  }, [rawX, rawY])

  return (
    <motion.div ref={ref} style={{ x, y }} className="absolute inset-0">
      {children}
    </motion.div>
  )
}

/* ── Main Export ── */
export default function HeroBackground() {
  const rand = seeded(99)

  const cubes = [
    { size: 40, x: 8,  y: 15, rotX: 20, rotY: 30, rotZ: 10, color: '#aa3bff', delay: 0.2, speed: 18 },
    { size: 24, x: 85, y: 10, rotX: 50, rotY: 10, rotZ: 30, color: '#6366f1', delay: 0.6, speed: 14 },
    { size: 32, x: 70, y: 60, rotX: 10, rotY: 60, rotZ: 20, color: '#aa3bff', delay: 1.0, speed: 20 },
    { size: 18, x: 15, y: 65, rotX: 30, rotY: 20, rotZ: 45, color: '#8b5cf6', delay: 0.4, speed: 16 },
    { size: 28, x: 92, y: 40, rotX: 15, rotY: 45, rotZ: 15, color: '#7c3aed', delay: 0.8, speed: 22 },
  ]

  const rings = [
    { cx: 20, cy: 25, radius: 70, color: '#aa3bff', delay: 0.3, speed: 12, tilt: 60 },
    { cx: 80, cy: 70, radius: 90, color: '#6366f1', delay: 0.7, speed: 18, tilt: 40 },
    { cx: 55, cy: 15, radius: 50, color: '#8b5cf6', delay: 1.2, speed: 15, tilt: 70 },
    { cx: 90, cy: 20, radius: 40, color: '#aa3bff', delay: 0.1, speed: 10, tilt: 30 },
  ]

  const orbs = [
    { cx: 15, cy: 40, radius: 120, color: '#aa3bff', delay: 0,   speed: 10 },
    { cx: 85, cy: 30, radius: 90,  color: '#6366f1', delay: 2,   speed: 13 },
    { cx: 50, cy: 80, radius: 150, color: '#7c3aed', delay: 1,   speed: 16 },
    { cx: 5,  cy: 80, radius: 60,  color: '#aa3bff', delay: 3,   speed: 11 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Deep background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900" />

      {/* Atmospheric glow blobs */}
      {orbs.map((o, i) => <GlowOrb key={i} {...o} />)}

      {/* Perspective grid floor */}
      <PerspectiveGrid />

      {/* Mouse-reactive layer */}
      <MouseParallax>
        {/* Spinning rings */}
        {rings.map((r, i) => <SpinningRing key={i} {...r} />)}

        {/* Floating cubes */}
        {cubes.map((c, i) => <FloatingCube key={i} {...c} />)}
      </MouseParallax>

      {/* Particle field (not mouse-parallax so it feels independent) */}
      <ParticleField count={55} />

      {/* Top vignette to keep text readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
    </div>
  )
}
