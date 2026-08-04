import { motion } from 'framer-motion'
import Newsletter from '../components/Newsletter'

export default function CareersPage() {
  const JOBS = [
    { title: 'Senior Apparel Designer', department: 'Design & Development', location: 'Mumbai (On-site)', type: 'Full-time' },
    { title: 'E-commerce Operations Specialist', department: 'Operations', location: 'Mumbai (Hybrid)', type: 'Full-time' },
    { title: 'Social Media & Brand Coordinator', department: 'Marketing', location: 'Remote / India', type: 'Full-time' }
  ]

  return (
    <div className="min-h-screen bg-black pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center mb-16"
        >
          <p className="section-label text-accent uppercase tracking-widest">JOIN THE TRIBE</p>
          <h1 className="font-display text-5xl md:text-6xl tracking-wider text-white">CAREERS</h1>
          <p className="font-sans text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            We are looking for modern disruptors, designers, and thinkers who challenge mainstream fashion limits.
          </p>
        </motion.div>

        {/* Benefits Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <div className="border border-white/5 bg-gray-950/40 p-6 rounded-lg text-center backdrop-blur-md">
            <p className="font-mono text-white text-base font-bold uppercase tracking-wider mb-2">Equity</p>
            <p className="font-sans text-xs text-gray-500">Share in our growth and brand value</p>
          </div>
          <div className="border border-white/5 bg-gray-950/40 p-6 rounded-lg text-center backdrop-blur-md">
            <p className="font-mono text-white text-base font-bold uppercase tracking-wider mb-2">Wardrobe</p>
            <p className="font-sans text-xs text-gray-500">Free hoodies and team merch allowance</p>
          </div>
          <div className="border border-white/5 bg-gray-950/40 p-6 rounded-lg text-center backdrop-blur-md">
            <p className="font-mono text-white text-base font-bold uppercase tracking-wider mb-2">Growth</p>
            <p className="font-sans text-xs text-gray-500">Mentorship and career support</p>
          </div>
          <div className="border border-white/5 bg-gray-950/40 p-6 rounded-lg text-center backdrop-blur-md">
            <p className="font-mono text-white text-base font-bold uppercase tracking-wider mb-2">Health</p>
            <p className="font-sans text-xs text-gray-500">Comprehensive medical coverage</p>
          </div>
        </div>

        {/* Open Roles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6 mb-20"
        >
          <h2 className="font-display text-2xl text-white uppercase tracking-wider mb-8">OPEN POSITIONS</h2>
          
          <div className="divide-y divide-white/5">
            {JOBS.map((job, idx) => (
              <div key={idx} className="py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/2 px-4 rounded-lg transition-colors">
                <div className="space-y-1">
                  <h3 className="font-display text-lg text-white uppercase tracking-wider">{job.title}</h3>
                  <p className="font-sans text-xs text-gray-500">{job.department} — {job.location}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] text-accent border border-accent/20 px-3 py-1 rounded-full uppercase tracking-wider">
                    {job.type}
                  </span>
                  <a 
                    href="mailto:careers@bindass.co?subject=Application for Job"
                    className="font-mono text-xs text-white border-b border-white hover:text-accent hover:border-accent pb-0.5 transition-colors uppercase tracking-widest"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <Newsletter />
    </div>
  )
}
