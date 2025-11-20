import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, StickyNote, FileText, Sparkles, HelpCircle, ListChecks, Map as MapIcon, Download, Volume2, Trash2, Mic, Square, Loader2 } from 'lucide-react'

const TABS = [
  { key: 'notes', label: 'Notes', icon: StickyNote },
  { key: 'summary', label: 'Summary', icon: FileText },
  { key: 'flashcards', label: 'Flashcards', icon: Sparkles },
  { key: 'mcqs', label: 'MCQs', icon: HelpCircle },
  { key: 'quiz', label: 'Quiz', icon: ListChecks },
  { key: 'mindmap', label: 'Mind Map', icon: MapIcon },
]

export default function StudyHelper() {
  const [text, setText] = useState('')
  const [active, setActive] = useState('mindmap')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [recording, setRecording] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const mediaRecorderRef = useRef(null)
  const recognitionRef = useRef(null)

  const backend = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SR) {
      setVoiceSupported(true)
      const rec = new SR()
      rec.continuous = true
      rec.interimResults = true
      rec.lang = 'en-US'
      rec.onresult = (e) => {
        let interim = ''
        let finalText = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const transcript = e.results[i][0].transcript
          if (e.results[i].isFinal) finalText += transcript + ' '
          else interim += transcript
        }
        if (interim) setText((t) => (t ? t + ' ' + interim : interim))
        if (finalText) setText((t) => (t ? t + ' ' + finalText : finalText))
      }
      recognitionRef.current = rec
    }
  }, [])

  const startVoice = async () => {
    setError('')
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start()
        setRecording(true)
        return
      }
      // Fallback: record raw audio (no transcription)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      mr.start()
      setRecording(true)
    } catch (e) {
      setError('Microphone permission denied or not available.')
    }
  }

  const stopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setRecording(false)
      return
    }
    const mr = mediaRecorderRef.current
    if (mr) {
      mr.stop()
      mr.stream.getTracks().forEach((t) => t.stop())
    }
    setRecording(false)
  }

  const speakOutput = () => {
    try {
      const synth = window.speechSynthesis
      if (!synth) return
      const textToSpeak = formatForExport(result, active)
      const utter = new SpeechSynthesisUtterance(textToSpeak || 'No output yet.')
      synth.cancel()
      synth.speak(utter)
    } catch {}
  }

  const clearAll = () => {
    setText('')
    setResult(null)
    setError('')
  }

  const downloadPdf = () => {
    // Use browser print-to-PDF for broad compatibility
    const w = window.open('', '_blank')
    const content = `<html><head><title>AI Study Helper</title></head><body style="font-family: Arial, sans-serif; padding: 24px"><h2>AI Study Helper - ${active.toUpperCase()}</h2><pre style="white-space: pre-wrap; font-size: 14px">${escapeHtml(formatForExport(result, active))}</pre></body></html>`
    w.document.write(content)
    w.document.close()
    w.focus()
    w.print()
  }

  const escapeHtml = (s='') => s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

  const generate = async (type) => {
    setActive(type)
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`${backend}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type })
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError('Failed to generate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-7 w-7 text-cyan-400" />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">AI Study Helper</h1>
          </div>
          <span className="text-sm text-cyan-300/80">Neon</span>
        </header>

        <p className="mt-2 text-cyan-200/80 text-sm">Paste your lesson text below. Generate notes, summaries, flashcards, quizzes, mind maps, and download PDFs. Voice features included.</p>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste long lesson text here..."
              className="w-full h-[300px] md:h-[420px] rounded-2xl bg-slate-900/60 border border-cyan-500/20 focus:border-cyan-400/60 focus:outline-none p-4 text-slate-100 placeholder:text-slate-500 shadow-[0_0_40px_-12px_rgba(34,211,238,0.25)]"
            />

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => generate(key)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium border transition ${active===key? 'bg-cyan-500 text-black border-cyan-400' : 'bg-slate-900/60 border-cyan-500/20 text-cyan-200 hover:border-cyan-400/40'}`}
                  disabled={loading}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button onClick={downloadPdf} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium bg-slate-900/60 border border-cyan-500/20 text-cyan-200 hover:border-cyan-400/40"><Download className="h-4 w-4"/> Download PDF</button>
              <button onClick={speakOutput} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium bg-slate-900/60 border border-cyan-500/20 text-cyan-200 hover:border-cyan-400/40"><Volume2 className="h-4 w-4"/> Play Output</button>
              <button onClick={clearAll} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium bg-slate-900/60 border border-rose-500/30 text-rose-200 hover:border-rose-400/60"><Trash2 className="h-4 w-4"/> Clear</button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button onClick={startVoice} disabled={recording} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${recording? 'opacity-50 cursor-not-allowed' : ''} bg-fuchsia-900/40 border border-fuchsia-500/40 text-fuchsia-200 hover:border-fuchsia-400/70`}><Mic className="h-4 w-4"/> Start Voice Note</button>
              <button onClick={stopVoice} disabled={!recording} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${!recording? 'opacity-50 cursor-not-allowed' : ''} bg-amber-900/40 border border-amber-500/40 text-amber-200 hover:border-amber-400/70`}><Square className="h-4 w-4"/> Stop</button>
              <span className="text-xs text-cyan-300/80">{recording ? 'Recording...' : 'Not recording'} {voiceSupported ? '(Voice typing enabled)' : ''}</span>
            </div>

            {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
          </div>

          <div>
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/50 p-4 min-h-[300px] md:min-h-[420px] shadow-[0_0_50px_-18px_rgba(16,185,129,0.25)]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Output</h3>
                {loading && <span className="inline-flex items-center gap-2 text-cyan-300 text-sm"><Loader2 className="h-4 w-4 animate-spin"/> Generating...</span>}
              </div>

              <div className="mt-3 text-sm text-cyan-100/90 max-h-[360px] overflow-auto pr-2">
                <RenderResult active={active} data={result} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RenderResult({ active, data }) {
  if (!data) {
    return <p className="text-cyan-300/70">Choose what to generate to see it here.</p>
  }
  if (active === 'summary') return <p>{data.summary}</p>
  if (active === 'notes') return (
    <ul className="list-disc pl-6 space-y-1">
      {(data.notes||[]).map((n, i) => <li key={i}>{n.replace(/^•\s?/, '')}</li>)}
    </ul>
  )
  if (active === 'flashcards') return (
    <div className="space-y-3">
      {(data.flashcards||[]).map((c, i) => (
        <div key={i} className="rounded-xl border border-cyan-500/20 bg-slate-800/40 p-3">
          <p className="font-semibold">Q{i+1}. {c.question}</p>
          <p className="mt-1 text-cyan-200">{c.answer}</p>
        </div>
      ))}
    </div>
  )
  if (active === 'mcqs' || active === 'quiz') return (
    <div className="space-y-3">
      {(data.mcqs||data.quiz||[]).map((q, i) => (
        <div key={i} className="rounded-xl border border-cyan-500/20 bg-slate-800/40 p-3">
          <p className="font-semibold">{i+1}. {q.question}</p>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            {q.options.map((op, j) => (
              <div key={j} className={`rounded-lg px-3 py-2 border ${j===q.answer_index? 'border-emerald-400/50 bg-emerald-900/20' : 'border-slate-700'}`}>{op}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
  if (active === 'mindmap') return (
    <div>
      {data.mindmap && data.mindmap.nodes && (
        <div className="flex flex-wrap gap-2">
          {data.mindmap.nodes.map((n) => (
            <span key={n.id} className={`px-3 py-1 rounded-full text-xs border ${n.id==='root'? 'border-fuchsia-400/60 bg-fuchsia-900/30' : 'border-cyan-400/40 bg-cyan-900/20'}`}>{n.label}</span>
          ))}
        </div>
      )}
    </div>
  )
  return <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(data, null, 2)}</pre>
}

function formatForExport(data, active) {
  if (!data) return ''
  if (active === 'summary') return data.summary || ''
  if (active === 'notes') return (data.notes||[]).join('\n')
  if (active === 'flashcards') return (data.flashcards||[]).map((c,i)=>`Q${i+1}: ${c.question}\nA: ${c.answer}`).join('\n\n')
  if (active === 'mcqs' || active === 'quiz') return (data.mcqs||data.quiz||[]).map((q,i)=>`${i+1}. ${q.question}\n${q.options.map((o,j)=>`   ${String.fromCharCode(65+j)}. ${o}${j===q.answer_index?'  ✓':''}`).join('\n')}`).join('\n\n')
  if (active === 'mindmap') return (data.mindmap?.nodes||[]).map(n=>`${n.id==='root'?'[Root] ':''}${n.label}`).join(' \u2192 ')
  return JSON.stringify(data)
}
