import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-slate-100">
      {/* Subtle starry background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(14,165,233,0.12),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.08),transparent_35%)]" />
      <div className="relative">
        <Hero />
        <HowItWorks />
        <div className="px-6 mx-auto max-w-5xl">
          <div className="rounded-2xl border border-blue-500/20 bg-slate-800/30 p-6">
            <h3 className="text-xl font-semibold">Teacher’s Callouts</h3>
            <ul className="mt-3 list-disc list-inside text-blue-200/90 text-sm space-y-1">
              <li>“AI Freeze!” everyone must stop</li>
              <li>“AI Scan!” hold still while the camera looks for movers</li>
              <li>“Reset!” back to dancing</li>
            </ul>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default App
