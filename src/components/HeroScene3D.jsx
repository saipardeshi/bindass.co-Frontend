/* eslint-disable react-hooks/immutability -- r3f useFrame loops intentionally mutate refs/three objects */
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader, SRGBColorSpace, MathUtils, DoubleSide, CanvasTexture, AdditiveBlending, Color } from 'three'
import { getImageUrl } from '../utils/cloudinaryHelpers'

const FLOOR_Y = -1.5

/* Small canvas-generated textures (reflection fade + floor glow) */
function makeFadeTexture() {
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 128
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 0, 128)
  grad.addColorStop(0, '#000') // far end of reflection → invisible
  grad.addColorStop(1, '#8a8a8a') // end touching the floor → soft
  g.fillStyle = grad
  g.fillRect(0, 0, 4, 128)
  return new CanvasTexture(c)
}

function makeGlowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, 'rgba(255,255,255,0.55)')
  grad.addColorStop(0.55, 'rgba(255,255,255,0.12)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  return new CanvasTexture(c)
}

/* Smaller images on narrow screens */
const imgFor = (id) =>
  window.innerWidth < 640
    ? getImageUrl(id, { width: 420, height: 490, crop: 'fill' })
    : getImageUrl(id, { width: 700, height: 817, crop: 'fill' })

/* Placeholder ring shown while textures download */
function SkeletonRing({ count }) {
  const g = useRef()
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.35
  })
  return (
    <group ref={g}>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS]} rotation={[0, a, 0]}>
            <planeGeometry args={[CARD_W, CARD_H]} />
            <meshBasicMaterial color="#1C1C1C" transparent opacity={0.6} side={DoubleSide} />
          </mesh>
        )
      })}
    </group>
  )
}

/* ──────────────────────────────────────────────────────────────
   Draggable 3D product ring (react-three-fiber)
   – Drag / swipe to spin, release to snap to the nearest product
   – Auto-advances when idle (off if user prefers reduced motion)
   – Mouse Y tilts the ring, cards float, fog fades the back ones
   – Click the front card → onSelect(product)
   ────────────────────────────────────────────────────────────── */

const RADIUS = 4.6
const CARD_W = 2.4
const CARD_H = 2.8
const DRAG_SPEED = 0.0065 // radians per pixel
const IDLE_MS = 3500

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function Card({ texture, fade, index, step, control, onSelect, product }) {
  const mesh = useRef()
  const refl = useRef()
  const lean = useRef()
  const angle = index * step

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const c = control.current
    const bob = Math.sin(clock.elapsedTime * 0.9 + index * 1.7) * 0.07
    mesh.current.position.y = bob
    if (refl.current) refl.current.position.y = FLOOR_Y * 2 - bob

    // how much this card faces the camera (1 = dead front)
    const facing = Math.max(0, Math.cos(angle + c.rot + c.scrollRot))
    const f4 = facing ** 4
    const s = MathUtils.damp(mesh.current.scale.x, 1 + 0.12 * f4, 6, 0.016)
    mesh.current.scale.setScalar(s)
    // front card turns slightly toward the cursor
    if (lean.current) lean.current.rotation.y = MathUtils.damp(lean.current.rotation.y, c.pointerX * 0.28 * f4, 5, 0.016)
  })

  return (
    <group rotation={[0, angle, 0]} position={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]}>
      {/* mirrored reflection on the floor */}
      <mesh ref={refl} scale={[1, -1, 1]} position={[0, FLOOR_Y * 2, 0]}>
        <planeGeometry args={[CARD_W, CARD_H]} />
        <meshBasicMaterial map={texture} alphaMap={fade} transparent opacity={0.55} side={DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={lean}>
      <group ref={mesh}>
        {/* thin frame */}
        <mesh position={[0, 0, -0.012]}>
          <planeGeometry args={[CARD_W + 0.06, CARD_H + 0.06]} />
          <meshBasicMaterial color="#C8B89A" transparent opacity={0.35} side={DoubleSide} />
        </mesh>
        {/* product image */}
        <mesh
          onClick={(e) => {
            e.stopPropagation()
            onSelect?.(product)
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = '')}
        >
          <planeGeometry args={[CARD_W, CARD_H]} />
          <meshBasicMaterial map={texture} side={DoubleSide} toneMapped={false} />
        </mesh>
      </group>
      </group>
    </group>
  )
}

function Ring({ products, control, scroll, onActive, onSelect }) {
  const group = useRef()
  const lastActive = useRef(-1)
  const { camera, size } = useThree()

  const urls = useMemo(() => products.map((p) => imgFor(p.images?.[0] || 'placeholder')), [products])
  const textures = useLoader(TextureLoader, urls)
  const step = (Math.PI * 2) / products.length
  const fade = useMemo(() => makeFadeTexture(), [])
  const glow = useMemo(() => makeGlowTexture(), [])
  const glowColor = useMemo(() => new Color('#C8B89A'), [])

  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = SRGBColorSpace
      t.anisotropy = 8
      t.needsUpdate = true
    })
  }, [textures])

  useFrame(({ clock }, dt) => {
    const c = control.current
    const now = performance.now()

    // auto-advance when idle
    if (!c.dragging && !c.reduced && now - c.lastInteraction > IDLE_MS) {
      c.target -= step
      c.lastInteraction = now - IDLE_MS + 2800 // next advance ~2.8s later
    }

    c.rot = MathUtils.damp(c.rot, c.target, c.dragging ? 22 : 5, dt)
    c.tilt = MathUtils.damp(c.tilt, c.tiltTarget, 4, dt)

    // scrolling the hero away spins the ring a little and pulls the camera back
    const sp = scroll?.get?.() ?? 0
    c.scrollRot = MathUtils.damp(c.scrollRot, sp * 1.6, 6, dt)

    if (group.current) {
      group.current.rotation.y = c.rot + c.scrollRot
      group.current.rotation.x = c.tilt * 0.18
      group.current.position.y = c.tilt * -0.25
    }

    // responsive camera distance (+ scroll pull-back)
    const aspect = size.width / size.height
    const z = RADIUS + (aspect < 0.8 ? 11 : aspect < 1.3 ? 9 : 8.6) + sp * 3.5
    camera.position.z = MathUtils.damp(camera.position.z, z, 4, dt)
    camera.position.y = 0.4 + Math.sin(clock.elapsedTime * 0.4) * 0.05
    camera.lookAt(0, -0.6, 0)

    // active index → parent
    const n = products.length
    const active = ((Math.round(-c.rot / step) % n) + n) % n
    if (active !== lastActive.current) {
      lastActive.current = active
      onActive?.(active)
    }
  })

  return (
    <group ref={group}>
      {/* soft glow pooled on the floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y - 0.01, 0]}>
        <planeGeometry args={[(RADIUS + 2.6) * 2, (RADIUS + 2.6) * 2]} />
        <meshBasicMaterial map={glow} color={glowColor} transparent opacity={0.5} blending={AdditiveBlending} depthWrite={false} fog={false} />
      </mesh>
      {products.map((p, i) => (
        <Card key={p._id || i} product={p} texture={textures[i]} fade={fade} index={i} step={step} control={control} onSelect={onSelect} />
      ))}
    </group>
  )
}

export default function HeroScene3D({ products, scroll, onActive, onSelect }) {
  const wrapRef = useRef(null)
  const [visible, setVisible] = useState(true)

  const step = (Math.PI * 2) / products.length
  const control = useRef({
    rot: 0,
    target: 0,
    tilt: 0,
    tiltTarget: 0,
    pointerX: 0,
    scrollRot: 0,
    dragging: false,
    lastX: 0,
    velocity: 0,
    lastInteraction: 0, // set on mount (keeps render pure)
    reduced: false,
  })

  useEffect(() => {
    control.current.lastInteraction = performance.now()
    control.current.reduced = prefersReducedMotion()
  }, [])

  // pause rendering when the hero is scrolled out of view
  useEffect(() => {
    const el = wrapRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // drag / swipe + tilt handlers (window-level so a drag can leave the canvas)
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const c = control.current

    const onDown = (e) => {
      c.dragging = true
      c.lastX = e.clientX
      c.velocity = 0
      c.lastInteraction = performance.now()
      el.style.cursor = 'grabbing'
    }
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      c.tiltTarget = ((e.clientY - rect.top) / rect.height - 0.5) * 2 // -1..1
      c.pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2 // -1..1
      if (!c.dragging) return
      const dx = e.clientX - c.lastX
      c.lastX = e.clientX
      c.velocity = dx
      c.target += dx * DRAG_SPEED
      c.lastInteraction = performance.now()
    }
    const onUp = () => {
      if (!c.dragging) return
      c.dragging = false
      el.style.cursor = 'grab'
      // flick momentum, then snap to the nearest card
      const projected = c.target + c.velocity * DRAG_SPEED * 12
      c.target = Math.round(projected / step) * step
      c.lastInteraction = performance.now()
    }
    const onLeave = () => {
      c.tiltTarget = 0
      c.pointerX = 0
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    el.style.cursor = 'grab'
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [step])

  // keyboard: arrow keys rotate (accessibility)
  const onKeyDown = (e) => {
    const c = control.current
    if (e.key === 'ArrowLeft') c.target += step
    if (e.key === 'ArrowRight') c.target -= step
    c.lastInteraction = performance.now()
  }

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      role="group"
      aria-label="3D product carousel. Drag or use arrow keys to rotate."
      onKeyDown={onKeyDown}
      className="absolute inset-0 outline-none select-none"
      style={{ touchAction: 'pan-y' }} // vertical page scroll still works on touch
    >
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ fov: 38, position: [0, 0.4, RADIUS + 6], near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#000000', 7, 19]} />
        <Suspense fallback={<SkeletonRing count={products.length} />}>
          <Ring products={products} control={control} scroll={scroll} onActive={onActive} onSelect={onSelect} />
        </Suspense>
      </Canvas>
    </div>
  )
}
