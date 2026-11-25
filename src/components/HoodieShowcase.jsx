import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { getImageUrl } from '../utils/cloudinaryHelpers'
import { formatINR } from '../utils/formatCurrency'
import { getPalette } from '../utils/dominantColors'
import { modelFor } from '../data/hoodieModels'

// three.js lives in its own chunk (the hero already pulls it in)
const HoodieCanvas = lazy(() => import('./HoodieCanvas'))

// If WebGL isn't available, show the product photo instead of an empty stage
class StageBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

/* One vivid backdrop per product, cycling. The hoodie keeps its REAL colours (sampled from the photo). */
const STAGE_COLORS = ['#ea580c', '#16a34a', '#7c3aed', '#0284c7', '#e11d48', '#ca8a04', '#0d9488', '#c026d3']

/* The giant text behind the hoodie: the product name without "Hoodie" ("Club Black Hoodie" → CLUB BLACK).
   Two words on purpose: the hoodie covers the middle, so a single short word would disappear behind it. */
const wordOf = (name = '') => name.replace(/\bhoodie\b/i, '').trim().toUpperCase() || 'BINDASS'

// Bebas Neue is condensed (~0.45em per letter): size the word so it spans most of the screen
const wordSize = (word) => `${Math.min(24, 205 / word.length)}vw`

const photoOf = (p, width = 400) => (p?.images?.[0] ? getImageUrl(p.images[0], { width, height: Math.round(width * 1.17), crop: 'fill' }) : null)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function HoodieShowcase({ products }) {
  const list = (products ?? []).filter((p) => p?.slug && p.images?.length).slice(0, 6)

  const sectionRef = useRef(null)
  const [idx, setIdx] = useState(0)
  const [mountCanvas, setMountCanvas] = useState(false)
  const [interacted, setInteracted] = useState(false)
  const [palettes, setPalettes] = useState({}) // slug → ['#main', '#accent']

  const count = list.length
  const listKey = list.map((p) => p.slug).join('|')
  const safeIdx = count ? idx % count : 0
  const product = list[safeIdx]
  const word = wordOf(product?.name)
  const stage = STAGE_COLORS[safeIdx % STAGE_COLORS.length]
  const modelUrls = [...new Set(list.map((p) => modelFor(p.slug)?.url).filter(Boolean))]

  // sample each product photo once → the 3D hoodie wears the real product colours
  useEffect(() => {
    let cancelled = false
    list.forEach((p) => {
      getPalette(photoOf(p, 120)).then((pal) => {
        if (!cancelled && pal) setPalettes((prev) => (prev[p.slug] ? prev : { ...prev, [p.slug]: pal }))
      })
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the slugs, not the array identity
  }, [listKey])

  // only create the WebGL canvas once the section is near the screen
  // (the section doesn't exist until products have loaded, so re-run when it appears)
  const ready = count > 0
  useEffect(() => {
    const el = sectionRef.current
    if (!ready || !el) return
    if (!('IntersectionObserver' in window)) {
      Promise.resolve().then(() => setMountCanvas(true))
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMountCanvas(true)
          io.disconnect()
        }
      },
      { rootMargin: '500px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ready])

  const go = useCallback((dir) => setIdx((i) => (count ? (i + dir + count) % count : 0)), [count])
  const onInteract = useCallback(() => setInteracted(true), [])

  // the giant word drifts against the mouse for depth
  const px = useMotionValue(0)
  const wordX = useSpring(useTransform(px, (v) => v * -34), { stiffness: 60, damping: 18 })
  const onPointerMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width - 0.5) * 2)
  }

  if (count === 0) return null

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') go(-1)
    if (e.key === 'ArrowRight') go(1)
  }

  const photoFallback = (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 3 }}>
      <img src={photoOf(product, 700)} alt={product.name} className="h-[70%] w-auto object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]" />
    </div>
  )

  return (
    <section
      ref={sectionRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerMove={onPointerMove}
      aria-label="Spin the drop: interactive 3D hoodie showcase. Use the arrows to change hoodie."
      className="relative h-[88vh] min-h-[600px] max-h-[920px] overflow-hidden outline-none"
    >
      {/* colour field (eases from one backdrop to the next) */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ backgroundColor: stage }}
        transition={{ duration: prefersReducedMotion() ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ zIndex: 0 }}
      />
      {/* light in the middle, dark at the edges + fade into the black page above/below */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'radial-gradient(ellipse 60% 55% at 50% 48%, rgba(255,255,255,0.22), transparent 70%),' +
            'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%),' +
            'linear-gradient(to bottom, #000 0%, transparent 16%, transparent 78%, #000 100%)',
        }}
      />

      {/* giant word BEHIND the hoodie */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none pb-[6%]" style={{ zIndex: 2 }}>
        <motion.div style={{ x: wordX }}>
          <AnimatePresence mode="wait">
            <motion.h2
              key={`${product.slug}-${word}`}
              initial={{ opacity: 0, y: 60, filter: 'blur(14px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -60, filter: 'blur(14px)' }}
              transition={{ duration: prefersReducedMotion() ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="hero-text text-white whitespace-nowrap"
              style={{ fontSize: wordSize(word), textShadow: '0 24px 60px rgba(0,0,0,0.28)' }}
            >
              {word}
            </motion.h2>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* the 3D hoodie (in front of the word) */}
      <StageBoundary fallback={photoFallback}>
        {mountCanvas ? (
          <div className="absolute inset-0" style={{ zIndex: 3 }}>
            <Suspense fallback={null}>
              <HoodieCanvas
                palette={palettes[product.slug]}
                rim={stage}
                spinKey={safeIdx}
                onInteract={onInteract}
                model={modelFor(product.slug)}
                allModelUrls={modelUrls}
              />
            </Suspense>
          </div>
        ) : null}
      </StageBoundary>

      {/* UI */}
      <div className="absolute inset-x-0 top-0 px-6 md:px-16 pt-24 md:pt-28 flex items-start justify-between pointer-events-none" style={{ zIndex: 4 }}>
        <div>
          <p className="section-label text-white/80">— Spin the drop</p>
          <p className="font-mono text-[10px] tracking-widest uppercase text-white/60 mt-2">360° · Drag to turn it round</p>
        </div>
        <p className="font-mono text-xs tracking-widest text-white/80 tabular-nums">
          {String(safeIdx + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 px-6 md:px-16 pb-10 md:pb-14 flex items-end justify-between gap-6 pointer-events-none" style={{ zIndex: 4 }}>
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: prefersReducedMotion() ? 0 : 0.35 }}
            >
              <p className="font-display text-3xl md:text-5xl tracking-wider uppercase text-white leading-none line-clamp-2">{product.name}</p>
              <p className="font-mono text-sm text-white/85 mt-2">{formatINR(product.price)}</p>
            </motion.div>
          </AnimatePresence>
          <Link to={`/product/${product.slug}`} className="btn-primary mt-5 inline-flex whitespace-nowrap pointer-events-auto">
            <span className="hidden sm:inline">View this hoodie</span>
            <span className="sm:hidden">View hoodie</span>
          </Link>
        </div>

        {count > 1 && (
          <div className="flex items-center gap-3 pointer-events-auto">
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => go(dir)}
                aria-label={dir < 0 ? 'Previous hoodie' : 'Next hoodie'}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/60 text-white flex items-center justify-center
                           hover:bg-white hover:text-black transition-colors duration-300 text-lg"
              >
                {dir < 0 ? '←' : '→'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* "drag me" hint: gone after the first interaction */}
      <AnimatePresence>
        {mountCanvas && !interacted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-12 pointer-events-none hidden md:flex items-center gap-3"
            style={{ zIndex: 4 }}
          >
            <motion.span animate={{ x: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }} className="text-white/80">↔</motion.span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-white/80">Drag to spin</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
