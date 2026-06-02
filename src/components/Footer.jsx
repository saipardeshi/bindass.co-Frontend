import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const LINKS = {
  Shop: [
    { label: 'All Hoodies', to: '/shop' },
    { label: 'New Arrivals', to: '/shop?sort=newest' },
    { label: 'Best Sellers', to: '/shop?sort=popular' },
    { label: 'Sale', to: '/shop?sale=true' },
  ],
  Help: [
    { label: 'Size Guide', to: '/size-guide' },
    { label: 'Shipping & Returns', to: '/shipping' },
    { label: 'FAQs', to: '/faq' },
    { label: 'Contact', to: '/contact' },
  ],
  Brand: [
    { label: 'About Us', to: '/about' },
    { label: 'Our Mission', to: '/about#mission' },
    { label: 'Sustainability', to: '/sustainability' },
    { label: 'Careers', to: '/careers' },
  ],
}

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/bindass.co', icon: 'IG' },
  { label: 'Pinterest', href: 'https://pinterest.com/bindass', icon: 'PT' },
  { label: 'YouTube', href: 'https://youtube.com/@bindass', icon: 'YT' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-gray-950">
      {/* Main footer */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-20 grid grid-cols-2 md:grid-cols-5 gap-10">
        {/* Brand column */}
        <div className="col-span-2">
          <Link to="/" className="font-display text-4xl tracking-wider text-white hover:text-accent transition-colors inline-block mb-4">
            BINDASS
          </Link>
          <p className="font-sans text-sm text-gray-500 leading-relaxed max-w-xs mb-8">
            Precision-tailored pieces that break convention and redefine presence.
            This isn't just fashion — it's a statement.
          </p>
          {/* Socials */}
          <div className="flex gap-4">
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 flex items-center justify-center 
                           font-mono text-[10px] text-gray-500 hover:text-white hover:border-white/30 
                           transition-all duration-300"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([category, links]) => (
          <div key={category}>
            <p className="section-label text-silver mb-6">{category}</p>
            <ul className="space-y-3">
              {links.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-sans text-sm text-gray-500 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-6 px-6 md:px-10">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[10px] text-gray-700 tracking-wider uppercase">
            © 2024 Bindass.co — All rights reserved
          </p>
          <div className="flex gap-8">
            <Link to="/privacy" className="font-mono text-[10px] text-gray-700 hover:text-gray-400 transition-colors tracking-wider uppercase">
              Privacy Policy
            </Link>
            <Link to="/terms" className="font-mono text-[10px] text-gray-700 hover:text-gray-400 transition-colors tracking-wider uppercase">
              Terms of Use
            </Link>
          </div>
          <p className="font-mono text-[10px] text-gray-800 tracking-wider uppercase">
            Crafted in India 🖤
          </p>
        </div>
      </div>
    </footer>
  )
}