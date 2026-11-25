/* eslint-disable react-hooks/immutability -- r3f useFrame loops intentionally mutate refs/three objects */
import { Component, lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  CanvasTexture,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  LatheGeometry,
  MathUtils,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  RepeatWrapping,
  Vector2,
  Vector3,
} from 'three'

/* ──────────────────────────────────────────────────────────────
   A stylised 3D hoodie, built from code, that you can turn all the way round.

   - drag / swipe to spin it (it keeps its momentum), move the mouse to tilt it
   - idle for a moment → it starts a slow turntable on its own
   - changing product (spinKey) → it does one full turn and lands facing front
   - body / hood / ribbing colours ease towards the palette it is given

   It is a stand-in for a photographed 3D model: when a real .glb exists, only
   <Hoodie> has to be replaced — the rig, controls and lighting stay.
   ────────────────────────────────────────────────────────────── */

const TAU = Math.PI * 2
const DRAG_SPEED = 0.011 // radians per pixel
const IDLE_AFTER = 2200 // ms of no interaction before the turntable starts
const IDLE_SPEED = 0.55 // rad/s
const BODY_Z = 0.66 // torso is oval: this much thinner front-to-back than side-to-side

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// real .glb models (see src/data/hoodieModels.js) — separate chunk, only fetched when one is registered
const HoodieModel = lazy(() => import('./HoodieModel'))

// a model that fails to download / parse must never leave an empty stage: show the stylised hoodie instead
class ModelBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error) { console.warn('3D hoodie model failed to load — using the stylised hoodie.', error?.message) }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

/* ─── geometry (built once) ─── */

// torso silhouette, hem → neck: x = radius, y = height
const TORSO_PROFILE = new CatmullRomCurve3([
  new Vector3(0.93, -1.5, 0),
  new Vector3(0.99, -1.38, 0),
  new Vector3(1.02, -1.0, 0),
  new Vector3(1.03, -0.4, 0),
  new Vector3(1.02, 0.2, 0),
  new Vector3(0.98, 0.65, 0),
  new Vector3(0.87, 1.02, 0),
  new Vector3(0.63, 1.22, 0),
  new Vector3(0.48, 1.3, 0),
])
  .getPoints(48)
  .map((p) => new Vector2(p.x, p.y))

const radiusAt = (y) =>
  TORSO_PROFILE.reduce((best, p) => (Math.abs(p.y - y) < Math.abs(best.y - y) ? p : best)).x

// sleeve: rounded shoulder cap that tapers to the wrist, in its own space (shoulder at y=0, hand at y≈-1.5)
const SLEEVE_PROFILE = [
  [0, 0.34], [0.16, 0.32], [0.28, 0.24], [0.34, 0.08], [0.345, -0.2],
  [0.33, -0.7], [0.3, -1.2], [0.26, -1.45], [0.25, -1.6], [0, -1.6],
].map(([x, y]) => new Vector2(x, y))

function useGeometries() {
  return useMemo(() => {
    const pocketY = -0.76
    const pocketR = radiusAt(pocketY) + 0.02
    const pocket = new CylinderGeometry(1, 1, 0.62, 40, 1, true, -0.78, 1.56)
    pocket.scale(pocketR, 1, pocketR)
    pocket.translate(0, pocketY, 0)
    return {
      torso: new LatheGeometry(TORSO_PROFILE, 72),
      sleeve: new LatheGeometry(SLEEVE_PROFILE, 40),
      // ribbed bands sit clearly OUTSIDE the cloth they finish (equal radii would z-fight into a jagged edge)
      hem: new CylinderGeometry(radiusAt(-1.35) + 0.02, radiusAt(-1.5) + 0.0, 0.3, 56, 1, true),
      cuff: new CylinderGeometry(0.285, 0.265, 0.3, 32, 1, true),
      pocket,
      pocketEdges: new EdgesGeometry(pocket, 20),
      neckHole: new CircleGeometry(0.44, 40),
      cuffHole: new CircleGeometry(0.24, 24),
      string: new CylinderGeometry(0.026, 0.026, 0.78, 10),
      tip: new CylinderGeometry(0.05, 0.05, 0.13, 12),
    }
  }, [])
}

/* tiny knit-like grain used as a bump map so the cloth isn't perfectly smooth */
function useClothBump() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')
    g.fillStyle = '#808080'
    g.fillRect(0, 0, 128, 128)
    // fixed-seed generator (mulberry32): the grain is identical on every load and render stays pure
    let seed = 0x9e3779b9
    const rand = () => {
      seed = (seed + 0x6d2b79f5) | 0
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
    for (let i = 0; i < 6500; i++) {
      const v = 90 + Math.floor(rand() * 90)
      g.fillStyle = `rgb(${v},${v},${v})`
      g.fillRect(rand() * 128, rand() * 128, 1.6, 1.6)
    }
    const t = new CanvasTexture(c)
    t.wrapS = t.wrapT = RepeatWrapping
    t.repeat.set(7, 4)
    return t
  }, [])
}

const WHITE = new Color('#ffffff')

/* ─── the hoodie itself ─── */
function Hoodie({ palette }) {
  const geo = useGeometries()
  const bump = useClothBump()

  const mats = useMemo(() => {
    const cloth = () =>
      new MeshPhysicalMaterial({
        color: '#2b2b2b',
        roughness: 0.92,
        metalness: 0,
        sheen: 1,
        sheenRoughness: 0.5,
        sheenColor: new Color('#555555'),
        bumpMap: bump,
        bumpScale: 0.45,
        side: DoubleSide,
      })
    return {
      body: cloth(),
      hood: cloth(),
      rib: cloth(),
      inner: new MeshStandardMaterial({ color: '#070707', roughness: 1, side: DoubleSide }),
      string: new MeshStandardMaterial({ color: '#e8e2d6', roughness: 0.75 }),
    }
  }, [bump])

  // colours the cloth is easing towards
  const target = useMemo(() => ({ body: new Color('#2b2b2b'), hood: new Color('#2b2b2b'), rib: new Color('#222222') }), [])
  useEffect(() => {
    const [main, accent] = palette ?? ['#2b2b2b', '#1c1c1c']
    target.body.set(main)
    target.hood.set(accent)
    target.rib.set(accent).multiplyScalar(0.82)
  }, [palette, target])

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-5 * dt)
    for (const key of ['body', 'hood', 'rib']) {
      const m = mats[key]
      m.color.lerp(target[key], k)
      m.sheenColor.copy(m.color).lerp(WHITE, 0.4)
    }
  })

  const shoulder = (side) => (
    <group position={[side * 0.82, 0.93, 0]} rotation={[0.12, 0, side * 0.36]}>
      <mesh geometry={geo.sleeve} material={mats.body} />
      <mesh geometry={geo.cuff} material={mats.rib} position={[0, -1.58, 0]} />
      <mesh geometry={geo.cuffHole} material={mats.inner} position={[0, -1.72, 0]} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  )

  return (
    <group>
      {/* torso: oval, with ribbed hem and a kangaroo pocket */}
      <group scale={[1, 1, BODY_Z]}>
        <mesh geometry={geo.torso} material={mats.body} />
        <mesh geometry={geo.hem} material={mats.rib} position={[0, -1.48, 0]} />
        <mesh geometry={geo.pocket} material={mats.body} />
        <lineSegments geometry={geo.pocketEdges}>
          <lineBasicMaterial color="#000000" transparent opacity={0.28} />
        </lineSegments>
      </group>

      {shoulder(1)}
      {shoulder(-1)}

      {/* hood: a rolled collar round the neck + the pouch that hangs down the back */}
      <mesh geometry={geo.neckHole} material={mats.inner} position={[0, 1.18, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.8, 1]} />
      <mesh position={[0, 1.33, -0.1]} rotation={[Math.PI / 2 - 0.3, 0, 0]} scale={[1.08, 0.86, 1]} material={mats.hood}>
        <torusGeometry args={[0.46, 0.25, 22, 56]} />
      </mesh>
      <mesh position={[0, 0.98, -0.55]} scale={[1, 1.15, 0.5]} material={mats.hood}>
        <sphereGeometry args={[0.55, 32, 24]} />
      </mesh>

      {/* drawstrings */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.2, 0.74, 0.64]} rotation={[0.06, 0, s * -0.03]}>
          <mesh geometry={geo.string} material={mats.string} />
          <mesh geometry={geo.tip} material={mats.string} position={[0, -0.42, 0]} />
        </group>
      ))}
    </group>
  )
}

/* soft dark blob under the hoodie so it doesn't float */
function Shadow({ bob }) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    grad.addColorStop(0, 'rgba(0,0,0,0.7)')
    grad.addColorStop(0.5, 'rgba(0,0,0,0.28)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 128, 128)
    return new CanvasTexture(c)
  }, [])
  const mesh = useRef()
  useFrame(() => {
    if (!mesh.current) return
    const s = 1 - bob.current * 0.6
    mesh.current.scale.set(s, s, 1)
  })
  return (
    <mesh ref={mesh} position={[0, -1.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4.6, 3]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  )
}

/* ─── rig: rotation / inertia / tilt / bobbing / camera fit ─── */
function Rig({ palette, rim, control, model }) {
  const rig = useRef()
  const float = useRef()
  const bob = useRef(0)
  const { camera, size } = useThree()
  const rimColor = useMemo(() => new Color('#ffffff'), [])
  const rimTarget = useMemo(() => new Color('#ffffff'), [])
  const rimLight = useRef()

  useEffect(() => {
    rimTarget.set(rim || '#ffffff')
  }, [rim, rimTarget])

  useFrame(({ clock }, dt) => {
    const c = control.current
    const now = performance.now()

    if (c.target != null && !c.dragging) {
      // product changed: ease round to the next "facing front" angle
      c.rot = MathUtils.damp(c.rot, c.target, 3.4, dt)
      if (Math.abs(c.target - c.rot) < 0.01) {
        c.rot = c.target
        c.target = null
      }
    } else if (!c.dragging) {
      const idle = c.reduced ? 0 : MathUtils.clamp((now - c.lastInteraction - IDLE_AFTER) / 1500, 0, 1)
      c.rot += (c.vel + IDLE_SPEED * idle) * dt
      c.vel *= Math.exp(-3.2 * dt)
    }

    c.tiltX = MathUtils.damp(c.tiltX, c.pointerY * 0.1, 4, dt)
    c.shiftX = MathUtils.damp(c.shiftX, c.pointerX * 0.2, 4, dt)

    if (rig.current) {
      rig.current.rotation.y = c.rot
      rig.current.rotation.x = c.tiltX
      rig.current.position.x = c.shiftX
    }
    bob.current = Math.sin(clock.elapsedTime * 1.1) * 0.5 + 0.5
    if (float.current) float.current.position.y = (bob.current - 0.5) * 0.12

    // the hoodie should fill ~71% of the stage height (or 92% of its width on tall/narrow screens)
    // (skip until the canvas has a real size — a 0×0 first frame would give a NaN camera that never recovers)
    if (size.width > 0 && size.height > 0) {
      const aspect = size.width / size.height
      const half = Math.tan((camera.fov * Math.PI) / 360)
      const z = Math.max(3.6 / 0.71 / 2 / half, 4.1 / 0.92 / aspect / 2 / half)
      if (Number.isFinite(z)) camera.position.z = MathUtils.damp(camera.position.z, z, 6, dt)
    }
    camera.lookAt(0, 0.05, 0)

    if (rimLight.current) {
      rimColor.lerp(rimTarget, 1 - Math.exp(-4 * dt))
      rimLight.current.color.copy(rimColor)
    }
  })

  return (
    <>
      <ambientLight intensity={0.6} />
      <hemisphereLight args={['#ffffff', '#1a1a2e', 0.55]} />
      <directionalLight position={[3.5, 4.5, 5]} intensity={2.3} />
      <directionalLight position={[-4.5, 1.5, 3]} intensity={0.9} color="#c8d6ff" />
      {/* coloured back light = the edge glow that separates the hoodie from the backdrop */}
      <pointLight ref={rimLight} position={[0, 1.8, -4]} intensity={70} distance={16} decay={2} />
      <group ref={rig}>
        <group ref={float}>
          {model ? (
            <ModelBoundary key={model.url} fallback={<Hoodie palette={palette} />}>
              {/* while the file downloads, the stylised hoodie holds the spot */}
              <Suspense fallback={<Hoodie palette={palette} />}>
                <HoodieModel url={model.url} rotationY={model.rotationY} tint={model.tint} palette={palette} />
              </Suspense>
            </ModelBoundary>
          ) : (
            <Hoodie palette={palette} />
          )}
        </group>
      </group>
      <Shadow bob={bob} />
    </>
  )
}

/* ─── public component ─── */
export default function HoodieCanvas({ palette, rim, spinKey, onInteract, model, allModelUrls = [] }) {
  const wrapRef = useRef(null)

  // warm the browser cache with every registered model so switching products doesn't wait on the network
  // (a plain fetch: a missing file here is harmless — the real load handles errors and falls back)
  const preloadKey = allModelUrls.join('|')
  useEffect(() => {
    if (!preloadKey) return
    preloadKey.split('|').forEach((u) => fetch(u).catch(() => {}))
  }, [preloadKey])

  const [visible, setVisible] = useState(true)
  const control = useRef({
    rot: 0,
    vel: 0,
    target: null,
    dragging: false,
    lastX: 0,
    lastT: 0,
    lastInteraction: 0,
    pointerX: 0,
    pointerY: 0,
    tiltX: 0,
    shiftX: 0,
    reduced: false,
  })

  useEffect(() => {
    control.current.lastInteraction = performance.now()
    control.current.reduced = prefersReducedMotion()
  }, [])

  // new product → one full turn, landing facing front (skipped on first mount)
  const firstSpin = useRef(true)
  useEffect(() => {
    if (firstSpin.current) {
      firstSpin.current = false
      return
    }
    const c = control.current
    if (c.reduced) {
      c.rot = Math.round(c.rot / TAU) * TAU
      c.target = null
    } else {
      c.target = (Math.floor(c.rot / TAU) + 2) * TAU
    }
    c.vel = 0
    c.lastInteraction = performance.now() - 700
  }, [spinKey])

  // don't render while scrolled out of view
  useEffect(() => {
    const el = wrapRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // drag to spin (window-level up/cancel so a drag can leave the canvas), mouse to tilt
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const c = control.current

    const onDown = (e) => {
      c.dragging = true
      c.target = null
      c.lastX = e.clientX
      c.lastT = performance.now()
      c.vel = 0
      c.lastInteraction = performance.now()
      el.style.cursor = 'grabbing'
      onInteract?.()
    }
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      c.pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      c.pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      if (!c.dragging) return
      const now = performance.now()
      const dx = e.clientX - c.lastX
      const dtMs = Math.max(now - c.lastT, 1)
      c.rot += dx * DRAG_SPEED
      c.vel = MathUtils.clamp(((dx * DRAG_SPEED) / dtMs) * 1000, -22, 22)
      c.lastX = e.clientX
      c.lastT = now
      c.lastInteraction = now
    }
    const onUp = () => {
      if (!c.dragging) return
      c.dragging = false
      // a stopped finger shouldn't fling: ignore stale velocity
      if (performance.now() - c.lastT > 90) c.vel = 0
      c.lastInteraction = performance.now()
      el.style.cursor = 'grab'
    }
    const onLeave = () => {
      c.pointerX = 0
      c.pointerY = 0
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
  }, [onInteract])

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label="Interactive 3D hoodie. Drag to turn it around."
      className="absolute inset-0 select-none outline-none"
      style={{ touchAction: 'pan-y' }} // vertical page scroll still works on touch
    >
      <Canvas
        flat // no tone mapping: keeps the sampled product colours true
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ fov: 28, position: [0, 0.3, 11], near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Rig palette={palette} rim={rim} control={control} model={model} />
      </Canvas>
    </div>
  )
}
