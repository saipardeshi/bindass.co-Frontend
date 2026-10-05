const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL
  || 'https://res.cloudinary.com/drxjzujjo/image/upload'

export const getImageUrl = (publicId, options = {}) => {
  const {
    width = 800,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
  } = options

  const transforms = [
    `q_${quality}`,
    `f_${format}`,
    `c_${crop}`,
    width && `w_${width}`,
    height && `h_${height}`,
    gravity && `g_${gravity}`,
  ]
    .filter(Boolean)
    .join(',')

  return `${CLOUDINARY_BASE}/${transforms}/${publicId}`
}

// Preset helpers
export const thumbUrl   = (id) => getImageUrl(id, { width: 400, height: 480, crop: 'fill' })
export const heroUrl    = (id) => getImageUrl(id, { width: 1200, quality: 80 })
export const sectionUrl = (id) => getImageUrl(id, { width: 900, height: 600, quality: 80, crop: 'fill' })
export const cardUrl    = (id) => getImageUrl(id, { width: 600, height: 700, crop: 'fill' })