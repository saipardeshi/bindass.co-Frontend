import { motion } from 'framer-motion'

/* Masked word-by-word rise — same reveal as the home hero headline. */
export default function AnimatedHeading({ children, as = 'h1', className = '', delay = 0 }) {
  const text = String(children)
  const Tag = motion[as] || motion.h1
  const words = text.split(' ')

  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.08em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
