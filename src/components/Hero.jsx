import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/vZX5NNlylxke-6DM/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      {/* Soft gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-900/30 to-slate-900" />
      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">
            AI Move & Freeze
          </h1>
          <p className="mt-4 text-lg md:text-xl text-blue-100/90">
            Play music, dance, and when you hear “AI Freeze!” stay perfectly still. If you move, the camera will catch you!
          </p>
        </motion.div>
      </div>
    </section>
  )
}
