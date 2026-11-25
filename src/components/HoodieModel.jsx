import { useEffect, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { Box3, Color, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

/* ──────────────────────────────────────────────────────────────
   Shows a real .glb hoodie in place of the stylised one.
   Kept in its own lazy chunk (loaders are ~150 kB) so the site pays nothing until a model is registered.

   - auto-centres and scales the model so any export fits the same stage as the stylised hoodie
   - uses the same scene lights as the stylised hoodie (cloth is non-metallic, so no environment map is needed —
     generating one is wasted work and noticeably slow on weak GPUs)
   - understands Draco- and Meshopt-compressed files
   - tint:true recolours an un-textured model with the palette sampled from the product photo
   ────────────────────────────────────────────────────────────── */

const TARGET_H = 3.3 // same height budget the camera framing assumes
const TARGET_W = 3.9

let draco
const extendLoader = (loader) => {
  draco ??= new DRACOLoader().setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
  loader.setDRACOLoader(draco)
  loader.setMeshoptDecoder(MeshoptDecoder)
}

export default function HoodieModel({ url, rotationY = 0, tint = false, palette }) {
  const gltf = useLoader(GLTFLoader, url, extendLoader)

  // a private copy of the scene (the loader caches the original), centred and scaled to the stage
  const { root, scale, tintMaterials } = useMemo(() => {
    const clone = gltf.scene.clone(true)
    const mats = []
    clone.traverse((o) => {
      if (!o.isMesh) return
      o.frustumCulled = false // skinned / odd bounds shouldn't pop out while spinning
      if (tint) {
        const list = Array.isArray(o.material) ? o.material : [o.material]
        const copies = list.map((m) => { const c = m.clone(); c.userData.base = c.color?.clone(); return c })
        o.material = Array.isArray(o.material) ? copies : copies[0]
        mats.push(...copies)
      }
    })
    const box = new Box3().setFromObject(clone)
    const size = box.getSize(new Vector3())
    const centre = box.getCenter(new Vector3())
    clone.position.sub(centre) // centre on the origin
    const s = Math.min(TARGET_H / (size.y || 1), TARGET_W / (size.x || 1))
    return { root: clone, scale: Number.isFinite(s) && s > 0 ? s : 1, tintMaterials: mats }
  }, [gltf, tint])

  // tint: the model's own colours are MULTIPLIED by the product colour, so a white/grey model keeps its shading
  const target = useMemo(() => new Color('#ffffff'), [])
  const current = useMemo(() => new Color('#ffffff'), [])
  useEffect(() => {
    target.set(palette?.[0] ?? '#ffffff')
  }, [palette, target])

  useFrame((_, dt) => {
    if (!tint) return
    current.lerp(target, 1 - Math.exp(-5 * dt))
    for (const m of tintMaterials) if (m.color && m.userData.base) m.color.copy(m.userData.base).multiply(current)
  })

  return (
    <group scale={scale} rotation={[0, rotationY, 0]} position={[0, 0.05, 0]}>
      <primitive object={root} />
    </group>
  )
}
