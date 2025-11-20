import { motion } from 'framer-motion'
import { Play, Camera, AlertTriangle } from 'lucide-react'

const steps = [
  {
    icon: Play,
    title: 'Start the music',
    desc: 'Turn on a song. Everyone dances and has fun!'
  },
  {
    icon: Camera,
    title: 'Shout “AI Freeze!”',
    desc: 'When you call it, everyone must become a statue.'
  },
  {
    icon: AlertTriangle,
    title: 'Don’t get detected',
    desc: 'If you wiggle, the AI camera spots you and you’re out.'
  }
]

export default function HowItWorks() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white text-center"
        >
          How to Play
        </motion.h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-blue-500/20 bg-slate-800/40 backdrop-blur p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                <s.icon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-blue-200/80 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
