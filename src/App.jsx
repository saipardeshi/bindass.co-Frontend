import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnnouncementBar from './components/AnnouncementBar'
import ScrollToTop from './components/ScrollToTop'

// Pages (Part 2)
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AuthPage from './pages/AuthPage'
import OrdersPage from './pages/OrdersPage'
import AboutPage from './pages/AboutPage'

// Info Pages
import SizeGuidePage from './pages/SizeGuidePage'
import ShippingReturnsPage from './pages/ShippingReturnsPage'
import FaqPage from './pages/FaqPage'
import ContactPage from './pages/ContactPage'
import SustainabilityPage from './pages/SustainabilityPage'
import CareersPage from './pages/CareersPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-black flex flex-col">
          {/* Reset scroll position on route change */}
          <ScrollToTop />

          {/* Grain texture overlay */}
          <div className="grain-overlay" />

          <AnnouncementBar />
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
              
              {/* Info & Legal Routes */}
              <Route path="/size-guide" element={<SizeGuidePage />} />
              <Route path="/shipping" element={<ShippingReturnsPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/sustainability" element={<SustainabilityPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}