/**
 * Pulls the two main colours out of a product photo so the 3D hoodie can wear them.
 *
 * Works on a tiny downscaled copy, looks only at the middle of the picture (where the hoodie is,
 * not the studio backdrop), groups pixels into colour buckets and returns the biggest bucket plus
 * the biggest bucket that is clearly different from it.
 *
 * Resolves to ['#rrggbb', '#rrggbb'] or null when the image can't be read (CORS, network…) —
 * callers must have a fallback.
 */
const cache = new Map()

const toHex = (r, g, b) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])

function analyse(img) {
  const W = 48
  const H = 56
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, W, H)
  const { data } = ctx.getImageData(0, 0, W, H)

  const buckets = new Map() // 4 bits per channel → { n, r, g, b }
  for (let y = Math.round(H * 0.18); y < Math.round(H * 0.88); y++) {
    for (let x = Math.round(W * 0.22); x < Math.round(W * 0.78); x++) {
      const i = (y * W + x) * 4
      if (data[i + 3] < 200) continue // transparent (cut-out photos)
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4)
      const bucket = buckets.get(key) || { n: 0, r: 0, g: 0, b: 0 }
      bucket.n++
      bucket.r += r
      bucket.g += g
      bucket.b += b
      buckets.set(key, bucket)
    }
  }

  const ranked = [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .map((b) => [b.r / b.n, b.g / b.n, b.b / b.n])
  if (ranked.length === 0) return null

  const first = ranked[0]
  const second = ranked.find((c) => dist(c, first) > 70) || first
  return [toHex(...first), toHex(...second)]
}

export function getPalette(url) {
  if (!url) return Promise.resolve(null)
  if (!cache.has(url)) {
    cache.set(
      url,
      new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          try {
            resolve(analyse(img))
          } catch {
            resolve(null) // tainted canvas etc.
          }
        }
        img.onerror = () => resolve(null)
        img.src = url
      }),
    )
  }
  return cache.get(url)
}
