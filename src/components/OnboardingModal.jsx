import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const FITS = [
  { id: 'relaxed', title: 'Relaxed Streetwear', desc: 'Standard drop-shoulder with effortless roominess.' },
  { id: 'boxy', title: 'Boxy Oversized', desc: 'Exaggerated drape and wider sleeves for modern street aesthetic.' },
  { id: 'tailored', title: 'Minimalist Clean', desc: 'Closer silhouette, refined ribbing, and subtle elegance.' },
]

export default function OnboardingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1)
  const [selectedFit, setSelectedFit] = useState('relaxed')
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleComplete()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleCopyCode = () => {
    navigator.clipboard.writeText('BINDASS10')
    setCopied(true)
    toast.success('Code BINDASS10 copied to clipboard!')
    setTimeout(() => setCopied(false), 2500)
  }

  const handleComplete = () => {
    localStorage.setItem('bindass_onboarded', 'true')
    localStorage.setItem('bindass_preferred_fit', selectedFit)
    onClose()
  }

  const handleStartShopping = () => {
    handleComplete()
    navigate('/shop')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg border border-white/10 bg-gray-950 p-8 md:p-10 relative overflow-hidden"
        >
          {/* Grain texture accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar with Step indicator and Skip */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 w-8 rounded-full transition-colors ${
                    s === step ? 'bg-white' : s < step ? 'bg-white/40' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleComplete}
              className="font-mono text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              Skip
            </button>
          </div>

          {/* Step 1: Welcome */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <span className="font-mono text-[10px] tracking-widest uppercase text-accent">
                WELCOME TO THE INNER CIRCLE
              </span>
              <h2 className="font-display text-4xl uppercase tracking-wider text-white">
                STYLE. VIBE. REFLECT.
              </h2>
              <p className="font-sans text-sm text-gray-400 leading-relaxed">
                BINDASS is crafted for those who reject ordinary streetwear. Every hoodie is precision-weighted with 450+ GSM French terry cotton, custom ribbed cuffs, and intentional dark luxury tailoring.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="btn-primary w-full py-4 uppercase font-mono text-xs tracking-widest"
                >
                  Personalize Your Fit →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Fit Selector */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <span className="font-mono text-[10px] tracking-widest uppercase text-accent">
                STEP 2 OF 3 · SILHOUETTE
              </span>
              <h2 className="font-display text-3xl uppercase tracking-wider text-white">
                SELECT YOUR DRAPE
              </h2>
              <p className="font-sans text-xs text-gray-500">
                Choose how you prefer your oversized pieces to sit on your frame:
              </p>

              <div className="space-y-3">
                {FITS.map((fit) => (
                  <div
                    key={fit.id}
                    onClick={() => setSelectedFit(fit.id)}
                    className={`border p-4 cursor-pointer transition-all ${
                      selectedFit === fit.id
                        ? 'border-white bg-white/5'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-sans text-sm font-medium text-white">{fit.title}</span>
                      {selectedFit === fit.id && (
                        <span className="font-mono text-[10px] text-accent uppercase tracking-widest">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-xs text-gray-500 leading-normal">{fit.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="btn-outline flex-1 py-3.5 uppercase font-mono text-xs tracking-widest"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="btn-primary flex-1 py-3.5 uppercase font-mono text-xs tracking-widest"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Perk */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 text-center"
            >
              <span className="font-mono text-[10px] tracking-widest uppercase text-accent">
                UNLOCKED · FIRST DROP PERK
              </span>
              <h2 className="font-display text-4xl uppercase tracking-wider text-white">
                10% OFF YOUR FIRST ORDER
              </h2>
              <p className="font-sans text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
                As an inaugural member, use this exclusive code at checkout to claim 10% off your first luxury hoodie:
              </p>

              <div className="border border-white/20 bg-gray-900/80 p-4 flex items-center justify-between max-w-xs mx-auto">
                <span className="font-mono text-lg tracking-widest text-white font-bold">
                  BINDASS10
                </span>
                <button
                  onClick={handleCopyCode}
                  className="font-mono text-[10px] uppercase tracking-widest bg-white text-black px-3 py-1.5 hover:bg-gray-200 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleStartShopping}
                  className="btn-primary w-full py-4 uppercase font-mono text-xs tracking-widest"
                >
                  Explore Collection
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
