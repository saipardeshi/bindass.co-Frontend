/* Endless scrolling text band (outlined / solid alternating). */
export default function Marquee({ items = ['STYLE', 'VIBE', 'REFLECT', 'BINDASS'], duration = 28 }) {
  const row = [...items, ...items]
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-black/30 backdrop-blur-sm py-5 select-none" aria-hidden>
      <div className="marquee-track flex w-max" style={{ animationDuration: `${duration}s` }}>
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center">
            {row.map((t, i) => (
              <span key={i} className="flex items-center">
                <span
                  className={`font-display text-5xl md:text-7xl tracking-wider px-8 ${
                    i % 2 ? 'text-white' : 'text-transparent'
                  }`}
                  style={i % 2 ? undefined : { WebkitTextStroke: '1px rgba(255,255,255,0.35)' }}
                >
                  {t}
                </span>
                <span className="text-accent text-2xl">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
