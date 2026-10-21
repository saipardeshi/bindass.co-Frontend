import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnnouncementBar from './components/AnnouncementBar'
import ScrollToTop from './components/ScrollToTop'
import { initAnalytics, trackPageView } from './utils/analytics'
import { errorTracker } from './utils/errorTracker'
import { resendVerification } from './api/auth'
import toast from 'react-hot-toast'

// Core Pages
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AuthPage from './pages/AuthPage'
import OrdersPage from './pages/OrdersPage'
import AboutPage from './pages/AboutPage'

// Auth & Security Pages
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import NotFoundPage from './pages/NotFoundPage'

// Info & Legal Pages
import SizeGuidePage from './pages/SizeGuidePage'
import ShippingReturnsPage from './pages/ShippingReturnsPage'
import FaqPage from './pages/FaqPage'
import ContactPage from './pages/ContactPage'
import SustainabilityPage from './pages/SustainabilityPage'
import CareersPage from './pages/CareersPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

function UnverifiedBanner() {
  const { user } = useAuth()
  const [resending, setResending] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (!user || (user.isVerified ?? user.verified) || dismissed) return null

  const handleResend = async () => {
    setResending(true)
    try {
      await resendVerification(user.email)
      toast.success('Verification link sent! Check your inbox.')
    } catch {
      toast.error('Could not send verification email.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="bg-amber-950/80 border-b border-amber-500/30 text-amber-200 px-4 py-2 text-center font-mono text-[10px] tracking-wider uppercase flex items-center justify-center gap-3 relative z-40">
      <span>Your email address is unverified.</span>
      <button
        onClick={handleResend}
        disabled={resending}
        className="underline underline-offset-2 text-white hover:text-amber-100 disabled:opacity-50"
      >
        {resending ? 'Sending...' : 'Resend link'}
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-white ml-2 text-sm leading-none"
        aria-label="Dismiss banner"
      >
        ×
      </button>
    </div>
  )
}

function AppRoutes() {
  const location = useLocation()

  useEffect(() => {
    initAnalytics()
    errorTracker.init()
  }, [])

  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <ScrollToTop />
      <div className="grain-overlay" />
      <AnnouncementBar />
      <UnverifiedBanner />
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Password Reset & Verification Flows */}
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Info & Legal Routes */}
          <Route path="/size-guide" element={<SizeGuidePage />} />
          <Route path="/shipping" element={<ShippingReturnsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Custom 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}