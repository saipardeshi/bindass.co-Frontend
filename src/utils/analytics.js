/**
 * BINDASS.co — Analytics & Event Tracking Utility
 * Supports Google Analytics 4 (GA4) with graceful local dev fallbacks.
 */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || ''

export const initAnalytics = () => {
  if (typeof window === 'undefined') return

  if (GA_ID && !window.gtag) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', GA_ID, { send_page_view: false })
  }
}

export const trackPageView = (path, title) => {
  if (typeof window === 'undefined') return

  if (window.gtag && GA_ID) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
    })
  } else if (import.meta.env.DEV) {
    console.debug(`[Analytics:PageView] ${path}`)
  }
}

export const trackEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined') return

  if (window.gtag && GA_ID) {
    window.gtag('event', eventName, params)
  } else if (import.meta.env.DEV) {
    console.debug(`[Analytics:Event] ${eventName}`, params)
  }
}

// ── E-commerce Specific Tracking ──────────────────────────
export const trackAddToCart = (product, size, quantity = 1) => {
  trackEvent('add_to_cart', {
    currency: 'INR',
    value: (product.price || 0) * quantity,
    items: [
      {
        item_id: product.id || product._id,
        item_name: product.name,
        item_category: 'Hoodie',
        item_variant: size,
        price: product.price,
        quantity,
      },
    ],
  })
}

export const trackBeginCheckout = (items, totalAmount) => {
  trackEvent('begin_checkout', {
    currency: 'INR',
    value: totalAmount,
    items: items.map(item => ({
      item_id: item.id || item._id,
      item_name: item.name,
      item_variant: item.size,
      price: item.price,
      quantity: item.quantity,
    })),
  })
}

export const trackPurchase = (orderId, totalAmount, items = []) => {
  trackEvent('purchase', {
    transaction_id: orderId,
    currency: 'INR',
    value: totalAmount,
    items: items.map(item => ({
      item_id: item.productId || item.id || item._id,
      item_name: item.name,
      item_variant: item.size,
      price: item.price,
      quantity: item.quantity,
    })),
  })
}
