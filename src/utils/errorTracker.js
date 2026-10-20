/**
 * BINDASS.co — Error Tracker & Crash Reporting Utility
 * Captures uncaught runtime errors, unhandled rejections, and React boundary catches.
 * Ready for Sentry / LogRocket with VITE_SENTRY_DSN.
 */

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || ''

class ErrorTracker {
  constructor() {
    this.initialized = false
  }

  init() {
    if (this.initialized || typeof window === 'undefined') return
    this.initialized = true

    window.addEventListener('error', (event) => {
      this.captureException(event.error || new Error(event.message), {
        context: 'window.onerror',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })

    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(event.reason || new Error('Unhandled Promise Rejection'), {
        context: 'unhandledrejection',
      })
    })
  }

  captureException(error, extra = {}) {
    const errorPayload = {
      message: error?.message || String(error),
      stack: error?.stack,
      extra,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      errorId: 'err_' + Math.random().toString(36).substring(2, 10),
    }

    if (import.meta.env.DEV) {
      console.error('[ErrorTracker Captured]', errorPayload)
    }

    // If Sentry is installed / loaded on window
    if (window.Sentry && typeof window.Sentry.captureException === 'function') {
      window.Sentry.captureException(error, { extra })
    }

    return errorPayload.errorId
  }
}

export const errorTracker = new ErrorTracker()
export default errorTracker
