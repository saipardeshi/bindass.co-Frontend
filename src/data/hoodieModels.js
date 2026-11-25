/**
 * Real 3D hoodie models for the "Spin the drop" section.
 *
 * HOW TO ADD ONE
 *   1. Put the .glb file in  public/models/   (e.g. public/models/club-black-hoodie.glb)
 *   2. Register it below, keyed by the product's slug (the last part of its /product/<slug> URL).
 *
 * Products with no entry — and no 'default' — keep the built-in stylised hoodie, so you can
 * add models one at a time. A model that fails to load also falls back to the stylised hoodie.
 *
 * Entry options
 *   url        path of the .glb file                                       (required)
 *   rotationY  radians, if the model comes in facing sideways/backwards     (default 0; Math.PI = turn it round)
 *   tint       true  → multiply the model's colours by the colour sampled from the product photo. Export ONE generic hoodie
 *                       in white / light grey and every product gets its own colour (dark parts stay darker).
 *              false → leave the model's own colours / textures untouched    (default — right for real product models)
 *
 * WHAT TO ASK FOR  (a 3D artist, a scan, or an image-to-3D tool all need to hit this)
 *   - format .glb, Y-up, hoodie only (no mannequin / hanger), centred, facing the +Z axis
 *   - 20k–60k triangles, textures ≤ 2048 px, file ≤ ~5 MB   (Draco / Meshopt compression is supported)
 *   - PBR materials with the product's real colours, print and embroidery baked into the textures
 */
export const HOODIE_MODELS = {
  // 'club-black-hoodie': { url: '/models/club-black-hoodie.glb' },
  // 'monogram-fleece-hoodie': { url: '/models/monogram-fleece-hoodie.glb' },
  //
  // one shared, un-textured model recoloured per product:
  // default: { url: '/models/hoodie.glb', tint: true },
}

export const modelFor = (slug) => HOODIE_MODELS[slug] ?? HOODIE_MODELS.default ?? null
