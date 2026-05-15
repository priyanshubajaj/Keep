'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppNav } from '@/components/AppNav'
import { SceneTransition } from '@/components/SceneTransition'
import { CoverageRing } from '@/components/CoverageRing'
import { getPersona, rebuildPersona, ingestText, nextInterviewQuestion } from '@/lib/api'
import type { Persona, IngestProgress } from '@/lib/api'

type Tab = 'write' | 'speak' | 'interview'

export default function CreatePage({ params }: { params: Promise<{ personaId: string }> }) {
  const [personaId, setPersonaId] = useState<string>('')
  const [persona, setPersona] = useState<Persona | null>(null)
  const [tab, setTab] = useState<Tab>('write')
  const [hasNewMaterial, setHasNewMaterial] = useState(false)

  useEffect(() => {
    params.then(({ personaId: pid }) => {
      setPersonaId(pid)
      getPersona(pid).then(setPersona).catch(() => {})
    })
  }, [params])

  if (!persona) {
    return (
      <>
        <AppNav />
        <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0,1,2].map(i => (
              <motion.span key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--ink-faint)', display: 'block' }}
                animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} />
            ))}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AppNav personaName={persona.name} breadcrumb="Create" />
      <SceneTransition>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '360px 1fr',
            minHeight: 'calc(100vh - 61px)',
          }}
        >
          {/* Left column — Coverage */}
          <aside
            style={{
              borderRight: '1px solid var(--rule)',
              padding: 'var(--space-2xl) var(--space-xl)',
              position: 'sticky',
              top: 61,
              height: 'calc(100vh - 61px)',
              overflowY: 'auto',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--display-3)',
                fontWeight: 400,
                color: 'var(--ink)',
                letterSpacing: '-0.02em',
                marginBottom: 'var(--space-xl)',
              }}
            >
              {persona.name}
            </h2>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
              <CoverageRing coverage={persona.coverage} size={240} />
            </div>

            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--small)',
                color: 'var(--ink-soft)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-sm)',
              }}
            >
              <p>{persona.counts.memories} memories indexed</p>
              <p>{Math.round(persona.counts.audioMinutes / 60)} hours of audio</p>
              <p style={{ color: 'var(--ink-faint)' }}>
                Persona {persona.freshness === 'fresh' ? 'rebuilt' : 'last built'} {
                  persona.freshness === 'fresh'
                    ? `${Math.round((Date.now() - new Date(persona.builtAt).getTime()) / 60000)} minutes ago`
                    : 'needs rebuild'
                }
              </p>
            </div>

            {hasNewMaterial && (
              <button
                onClick={() => rebuildPersona(personaId).then(setPersona)}
                style={{
                  marginTop: 'var(--space-lg)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--small)',
                  color: 'var(--accent)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  borderBottom: '1px solid var(--accent)',
                }}
              >
                Rebuild persona
              </button>
            )}
          </aside>

          {/* Right column — Tabs */}
          <main style={{ padding: 'var(--space-2xl) var(--space-2xl)' }}>
            {/* Tab nav */}
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-xl)',
                borderBottom: '1px solid var(--rule)',
                marginBottom: 'var(--space-xl)',
              }}
            >
              {(['write', 'speak', 'interview'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--body)',
                    fontWeight: 600,
                    color: tab === t ? 'var(--ink)' : 'var(--ink-faint)',
                    background: 'none',
                    border: 'none',
                    borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
                    padding: '0 0 12px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'color 180ms ease',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {tab === 'write' && (
                <WriteTab
                  key="write"
                  personaId={personaId}
                  onIngested={() => {
                    setHasNewMaterial(true)
                    getPersona(personaId).then(setPersona)
                  }}
                />
              )}
              {tab === 'speak' && <SpeakTab key="speak" />}
              {tab === 'interview' && <InterviewTab key="interview" personaId={personaId} />}
            </AnimatePresence>
          </main>
        </div>
      </SceneTransition>
    </>
  )
}

function WriteTab({ personaId, onIngested }: { personaId: string; onIngested: () => void }) {
  const [text, setText] = useState('')
  const [source, setSource] = useState('memoir · chapter-1')
  const [progress, setProgress] = useState<IngestProgress | null>(null)
  const [added, setAdded] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleAdd() {
    if (!text.trim() || busy) return
    setBusy(true)
    setAdded(null)
    try {
      const stream = await ingestText(personaId, text, source)
      for await (const p of stream) {
        setProgress(p)
        if (p.stage === 'done') {
          setAdded(p.segmentsAdded ?? 0)
          setText('')
          onIngested()
        }
      }
    } catch {}
    setBusy(false)
    setProgress(null)
  }

  const stages = ['segmenting', 'extracting', 'embedding', 'done']

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type memoir text here…"
        style={{
          width: '100%',
          minHeight: 320,
          border: 'none',
          borderRadius: 2,
          padding: 'var(--space-lg)',
          background: 'var(--paper-deep)',
          fontFamily: 'var(--font-prose)',
          fontSize: 'var(--body)',
          color: 'var(--ink)',
          lineHeight: 1.65,
          resize: 'vertical',
          outline: 'none',
        }}
        disabled={busy}
      />

      {/* Footer strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'var(--space-md)',
          padding: 'var(--space-md) 0',
          borderTop: '1px solid var(--rule)',
        }}
      >
        <div>
          {busy && progress ? (
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              {stages.slice(0, 3).map((s) => (
                <span
                  key={s}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--caption)',
                    color: stages.indexOf(s) <= stages.indexOf(progress.stage)
                      ? 'var(--accent)'
                      : 'var(--ink-faint)',
                    textTransform: 'capitalize',
                    transition: 'color 300ms ease',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          ) : added !== null ? (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--small)', color: 'var(--ink-soft)' }}>
              Added {added} memories.
            </span>
          ) : (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--small)', color: 'var(--ink-faint)' }}>
              Will be added as:{' '}
              <button
                onClick={() => {
                  const s = prompt('Source label', source)
                  if (s) setSource(s)
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)', fontFamily: 'inherit', textDecoration: 'underline', fontSize: 'inherit' }}
              >
                {source}
              </button>
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={!text.trim() || busy}
          style={{
            padding: '10px 20px',
            background: text.trim() && !busy ? 'var(--accent)' : 'var(--rule)',
            color: text.trim() && !busy ? 'white' : 'var(--ink-faint)',
            border: 'none',
            borderRadius: 2,
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: 'var(--small)',
            cursor: text.trim() && !busy ? 'pointer' : 'default',
            transition: 'background 180ms ease',
          }}
        >
          Add to Keep
        </button>
      </div>
    </motion.div>
  )
}

function SpeakTab() {
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function handleToggle() {
    if (recording) {
      setRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    } else {
      setRecording(true)
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-xl)', paddingTop: 'var(--space-xl)' }}
    >
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.04 }}
        style={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: 'var(--paper-deep)',
          border: `2px solid ${recording ? 'var(--accent)' : 'var(--ink)'}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 300ms ease',
        }}
        animate={recording ? {
          boxShadow: ['0 0 0 0 rgba(184, 83, 58, 0)', '0 0 0 12px rgba(184, 83, 58, 0.15)', '0 0 0 0 rgba(184, 83, 58, 0)'],
        } : {}}
        transition={recording ? { duration: 1, repeat: Infinity } : {}}
      >
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
          <rect x="8" y="0" width="12" height="22" rx="6" fill={recording ? 'var(--accent)' : 'var(--ink)'} />
          <path d="M2 17c0 6.627 5.373 12 12 12s12-5.373 12-12" stroke={recording ? 'var(--accent)' : 'var(--ink)'} strokeWidth="2" strokeLinecap="round" fill="none" />
          <line x1="14" y1="29" x2="14" y2="35" stroke={recording ? 'var(--accent)' : 'var(--ink)'} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.button>

      {recording && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--body)', color: 'var(--ink-soft)' }}>
          {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
        </p>
      )}

      {seconds >= 20 && recording && (
        <button
          onClick={handleToggle}
          style={{
            padding: '10px 24px',
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: 2,
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: 'var(--body)',
            cursor: 'pointer',
          }}
        >
          Stop and save
        </button>
      )}

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--caption)',
          color: 'var(--ink-faint)',
          textAlign: 'center',
          maxWidth: 360,
        }}
      >
        Audio stays on your device until you save. Nothing is sent during recording.
      </p>
    </motion.div>
  )
}

function InterviewTab({ personaId }: { personaId: string }) {
  const [question, setQuestion] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    nextInterviewQuestion(personaId).then((q) => {
      setQuestion(q.questionText)
      setLoading(false)
    })
  }, [personaId])

  function handleSkip() {
    setLoading(true)
    nextInterviewQuestion(personaId).then((q) => {
      setQuestion(q.questionText)
      setLoading(false)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ maxWidth: 560 }}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => (
                <motion.span key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--ink-faint)', display: 'block' }}
                  animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key={question} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--display-3)',
                fontWeight: 400,
                color: 'var(--ink)',
                fontStyle: 'italic',
                letterSpacing: '-0.02em',
                lineHeight: 1.3,
                marginBottom: 'var(--space-xl)',
              }}
            >
              {question}
            </p>

            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <SpeakTab />
            </div>

            <button
              onClick={handleSkip}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--small)',
                color: 'var(--ink-soft)',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Skip this one →
            </button>

            <p
              style={{
                fontFamily: 'var(--font-prose)',
                fontSize: 'var(--small)',
                color: 'var(--ink-soft)',
                fontStyle: 'italic',
                marginTop: 'var(--space-xl)',
              }}
            >
              The interview adapts. The more you say, the better the next question gets.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
