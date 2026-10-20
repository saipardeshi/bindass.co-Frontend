import React from 'react'
import { errorTracker } from '../utils/errorTracker'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorId: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    const errorId = errorTracker.captureException(error, { componentStack: errorInfo?.componentStack })
    this.setState({ errorId })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 selection:bg-white selection:text-black">
          <div className="max-w-md w-full border border-white/10 p-8 md:p-12 text-center bg-gray-950/40 backdrop-blur-md">
            <span className="font-mono text-[10px] tracking-widest uppercase text-accent mb-4 inline-block">
              SYSTEM ANOMALY
            </span>
            <h1 className="font-display text-4xl md:text-5xl tracking-wider uppercase mb-4">
              GLITCH ENCOUNTERED
            </h1>
            <p className="font-sans text-sm text-gray-400 mb-8 leading-relaxed">
              An unexpected disruption occurred in the matrix. Our systems have logged this event and our engineers have been alerted.
            </p>

            {this.state.errorId && (
              <p className="font-mono text-[10px] text-gray-600 tracking-widest uppercase mb-8">
                REF: {this.state.errorId}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="btn-primary py-3.5 px-6 text-xs uppercase font-mono tracking-widest"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="btn-outline py-3.5 px-6 text-xs uppercase font-mono tracking-widest"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
