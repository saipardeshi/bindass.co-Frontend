import { Component, lazy, Suspense, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useFeatured, useNewArrivals, useBestSellers } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import Newsletter from '../components/Newsletter'
import HoodieShowcase from '../components/HoodieShowcase'
import { ProductCardSkeleton } from '../components/SkeletonLoader'
import { heroUrl, sectionUrl } from '../utils/cloudinaryHelpers'
import { formatINR as formatCurrency } from '../utils/formatCurrency'

// three.js is heavy — load it in its own chunk, after the page shell renders
const HeroScene3D = lazy(() => import('../components/HeroScene3D'))

// If WebGL fails, silently fall back to the static hero image
class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

/* ─── Hero Section ─── */
function HeroSection({ products }) {
  const ref = useRef(null)
  const navigate = useNavigate()
  const [activeIdx, setActiveIdx] = useState(0)
  const ringProducts = (products ?? []).slice(0, 8)
  const showRing = ringProducts.length >= 3 // a ring of 1–2 cards looks broken
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const SLIDES = [
    {
      id: 1,
      image: 'hoodies_-removebg-preview_pigjwx',
      label: 'New Drop 01',
      heading: ['STYLE', 'VIBE', 'REFLECT'],
      sub: 'Luxury staples for the modern disruptor.',
      cta: 'Shop Now',
      to: '/shop',
    },
    {
      id: 2,
      image: 'samples/ecommerce/accessories-bag',
      label: 'Limited Edition',
      heading: ['DARE', 'TO BE', 'DIFFERENT'],
      sub: 'Precision-tailored pieces that redefine presence.',
      cta: 'Explore',
      to: '/shop?sort=featured',
    },
  ]

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">

      {/* Static fallback image (shows while the 3D chunk loads / if WebGL is unavailable) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y, zIndex: 1 }}
      >
        <img
          src={heroUrl(SLIDES[0].image)}
          alt="Bindass hero"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-top opacity-20 mix-blend-luminosity"
        />
      </motion.div>

      {/* Draggable 3D product ring + caption — if WebGL/textures fail, BOTH disappear together */}
      {showRing && (
        <ErrorBoundary fallback={null}>
          <motion.div
            className="absolute inset-x-0 top-[4%] h-[96%]"
            style={{ opacity, zIndex: 1, WebkitMaskImage: 'linear-gradient(to bottom, #000 62%, transparent 92%)', maskImage: 'linear-gradient(to bottom, #000 62%, transparent 92%)' }}
          >
            <Suspense fallback={null}>
              <HeroScene3D
                products={ringProducts}
                scroll={scrollYProgress}
                onActive={setActiveIdx}
                onSelect={(p) => navigate(`/product/${p.slug}`)}
              />
            </Suspense>
          </motion.div>

          <div className="absolute right-6 md:right-16 top-24 md:top-28 text-right pointer-events-none" style={{ zIndex: 2 }}>
            <p className="section-label text-gray-500 text-[9px]">Drag to explore</p>
            <p className="font-display text-2xl md:text-3xl tracking-wider uppercase text-white mt-1">
              {ringProducts[activeIdx]?.name}
            </p>
            <p className="font-mono text-xs text-accent mt-1">
              {formatCurrency(ringProducts[activeIdx]?.price)}
            </p>
          </div>
        </ErrorBoundary>
      )}

      {/* Content */}
      <motion.div
        style={{ opacity, zIndex: 2 }}
        className="absolute inset-0 flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-16 max-w-screen-xl mx-auto left-0 right-0 pointer-events-none [&_a]:pointer-events-auto"
      >
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="section-label text-accent mb-6"
        >
          {SLIDES[0].label}
        </motion.p>

        <div className="overflow-hidden">
          {SLIDES[0].heading.map((line, i) => (
            <motion.h1
              key={line}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="hero-text text-[13vw] md:text-[10vw] lg:text-[8vw] text-white leading-none"
            >
              {line}
            </motion.h1>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="font-sans text-sm text-gray-300 mt-5 mb-8 max-w-sm"
        >
          {SLIDES[0].sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex gap-4"
        >
          <Link to={SLIDES[0].to} className="btn-primary">
            {SLIDES[0].cta}
          </Link>
          <Link to="/about" className="btn-outline">
            Our Story
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 right-8 flex flex-col items-center gap-3"
        style={{ zIndex: 3 }}
      >
        <span className="section-label text-gray-600 text-[9px] rotate-90 tracking-widest3">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-px h-12 bg-gradient-to-b from-gray-600 to-transparent"
        />
      </motion.div>
    </section>
  )
}

/* ─── Section Header ─── */
function SectionHeader({ label, title, subtitle, cta, ctaTo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
    >
      <div>
        {label && <p className="section-label text-silver mb-3">{label}</p>}
        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-wider uppercase text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="font-sans text-sm text-gray-500 mt-3 max-w-md leading-relaxed">{subtitle}</p>
        )}
      </div>
      {cta && (
        <Link
          to={ctaTo}
          className="font-mono text-xs tracking-widest uppercase text-silver hover:text-white 
                     border-b border-gray-700 hover:border-white pb-0.5 transition-all duration-300 whitespace-nowrap"
        >
          {cta} →
        </Link>
      )}
    </motion.div>
  )
}

/* ─── Designed to Disrupt Banner ─── */
function DisruptBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-20 px-6 md:px-16 border-y border-white/5 text-center"
    >
      <p className="section-label text-silver mb-6">Our Philosophy</p>
      <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wider uppercase text-white mb-6">
        DESIGNED TO DISRUPT
      </h2>
      <p className="font-sans text-sm text-gray-500 max-w-2xl mx-auto leading-loose tracking-wide uppercase text-xs">
        Luxury staples for the modern disruptor. Precision-tailored pieces that break convention
        and redefine presence. This isn't just fashion — it's a statement.
      </p>
    </motion.section>
  )
}

/* ─── Featured Products ─── */
function FeaturedSection({ products, loading }) {
  if (!loading && (!products || products.length === 0)) return null
  return (
    <section className="py-20 px-6 md:px-16 max-w-screen-xl mx-auto">
      <SectionHeader
        label="— Drop 01"
        title="FEATURED"
        subtitle="Carefully curated pieces for the discerning wardrobe."
        cta="View All"
        ctaTo="/shop"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : (products ?? []).map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
      </div>
    </section>
  )
}



/* ─── New Arrivals ─── */
function NewArrivalsSection({ products, loading }) {
  if (!loading && (!products || products.length === 0)) return null
  return (
    <section className="py-20 px-6 md:px-16 max-w-screen-xl mx-auto">
      <SectionHeader
        label="— Just Dropped"
        title="NEW ARRIVALS"
        cta="Shop New"
        ctaTo="/shop?sort=newest"
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : (products ?? []).map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
      </div>
    </section>
  )
}

/* ─── Mission / Vision Sections ─── */
function MissionVisionSection() {
  return (
    <section className="py-0">
      {/* Mission */}
      <div className="grid md:grid-cols-2 min-h-[500px]">
        <div className="relative overflow-hidden bg-black/30">
          <img
            src={sectionUrl('09c14caaec87319b9505427d1fa1ae53_snesau')}
            alt="Our Mission"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover opacity-70 hover:opacity-90 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-black/40 backdrop-blur-md flex flex-col justify-center px-12 md:px-16 py-20"
        >
          <p className="section-label text-silver mb-6">01 / Mission</p>
          <h3 className="font-display text-5xl md:text-6xl tracking-wider uppercase text-white mb-6">
            OUR MISSION
          </h3>
          <p className="font-sans text-sm text-gray-400 leading-loose mb-8 max-w-sm">
            To create precision-tailored pieces that empower the modern generation
            to express their authentic identity. Fashion that speaks before you do.
          </p>
          <Link to="/about#mission" className="btn-outline self-start">Learn More</Link>
        </motion.div>
      </div>

      {/* Vision */}
      <div className="grid md:grid-cols-2 min-h-[500px]">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-black/30 backdrop-blur-md flex flex-col justify-center px-12 md:px-16 py-20 order-2 md:order-1"
        >
          <p className="section-label text-silver mb-6">02 / Vision</p>
          <h3 className="font-display text-5xl md:text-6xl tracking-wider uppercase text-white mb-6">
            OUR VISION
          </h3>
          <p className="font-sans text-sm text-gray-400 leading-loose mb-8 max-w-sm">
            To become India's most coveted streetwear brand — where dark luxury
            meets raw street culture. Global in reach, fearless in spirit.
          </p>
          <Link to="/about#vision" className="btn-outline self-start">Learn More</Link>
        </motion.div>
        <div className="relative overflow-hidden bg-black/30 order-1 md:order-2">
          <img
            src={sectionUrl('04fa1b239c87c925221839f4fdd14fbe_jpc0xg')}
            alt="Our Vision"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover opacity-70 hover:opacity-90 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
        </div>
      </div>
    </section>
  )
}

/* ─── Best Sellers ─── */
function BestSellersSection({ products, loading }) {
  if (!loading && (!products || products.length === 0)) return null
  return (
    <section className="py-20 px-6 md:px-16 max-w-screen-xl mx-auto">
      <SectionHeader
        label="— Community Favourites"
        title="BEST SELLERS"
        cta="Shop All"
        ctaTo="/shop?sort=popular"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : (products ?? []).map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
      </div>
    </section>
  )
}

/* ─── Reviews ─── */
const REVIEWS = [
  { name: 'Aryan M.', city: 'Mumbai', stars: 5, text: 'The quality hits different. Wore it to college and got stopped three times. BINDASS is on another level.' },
  { name: 'Priya S.', city: 'Delhi', stars: 5, text: 'Perfect oversized fit. The fabric is insanely soft and the drop length is exactly right. Ordering again.' },
  { name: 'Kabir R.', city: 'Bangalore', stars: 5, text: 'Finally a brand that gets it. Dark, minimal, premium. This is exactly what Gen-Z fashion should look like.' },
]

function ReviewsSection() {
  return (
    <section className="py-20 px-6 md:px-16 bg-black/30 backdrop-blur-md border-y border-white/5">
      <div className="max-w-screen-xl mx-auto">
        <SectionHeader label="— What They Say" title="REVIEWS" />
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="border border-white/8 p-8 hover:border-white/16 transition-colors duration-300"
            >
              <div className="flex gap-0.5 mb-6">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <span key={j} className="text-accent text-sm">★</span>
                ))}
              </div>
              <p className="font-sans text-sm text-gray-300 leading-loose mb-6 italic">
                "{r.text}"
              </p>
              <div className="border-t border-white/5 pt-5">
                <p className="font-sans text-sm font-medium text-white">{r.name}</p>
                <p className="font-mono text-[10px] text-gray-600 tracking-widest uppercase mt-1">{r.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── HomePage (assembled) ─── */
export default function HomePage() {
  const { data: featured, isLoading: fl } = useFeatured()
  const { data: newArrivals, isLoading: nl } = useNewArrivals()
  const { data: bestSellers, isLoading: bl } = useBestSellers()

  return (
    <>
      <HeroSection products={featured?.products} />
      <HoodieShowcase products={featured?.products} />
      <DisruptBanner />
      <FeaturedSection products={featured?.products} loading={fl} />
      <NewArrivalsSection products={newArrivals?.products} loading={nl} />
      <MissionVisionSection />
      <BestSellersSection products={bestSellers?.products} loading={bl} />
      <ReviewsSection />
      <Newsletter />
    </>
  )
}