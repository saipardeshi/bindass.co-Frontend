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
export const thumbUrl = (id) => getImageUrl(id, { width: 600, height: 700, crop: 'fill' })
export const heroUrl  = (id) => getImageUrl(id, { width: 1400, quality: 85 })
export const cardUrl  = (id) => getImageUrl(id, { width: 800, height: 900, crop: 'fill' })