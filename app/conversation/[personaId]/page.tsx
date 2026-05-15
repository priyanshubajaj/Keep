'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { AppNav } from '@/components/AppNav'
import { SceneTransition } from '@/components/SceneTransition'
import { AudioPlayerInline } from '@/components/AudioPlayerInline'
import { SuggestedPill } from '@/components/SuggestedPill'
import { converse, conversationHistory, suggestedQuestions, getPersona } from '@/lib/api'
import type { ConversationTurn, Persona } from '@/lib/api'

function ThinkingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: 20 }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'var(--ink-faint)',
            display: 'block',
          }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

interface CitationProps {
  source: string
}

function Citation({ source }: CitationProps) {
  const [hovered, setHovered] = useState(false)
  if (!source) return null
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--caption)',
          color: 'var(--ink-faint)',
          fontStyle: 'italic',
          cursor: 'default',
          borderBottom: '1px dotted var(--rule)',
        }}
      >
        {source}
      </span>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: -8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              zIndex: 10,
              background: 'var(--paper)',
              border: '1px solid var(--rule)',
              borderRadius: 2,
              padding: '8px 12px',
              boxShadow: `0 4px 16px var(--shadow)`,
              maxWidth: 320,
              fontFamily: 'var(--font-prose)',
              fontSize: 'var(--small)',
              color: 'var(--ink-soft)',
              fontStyle: 'italic',
              lineHeight: 1.6,
              whiteSpace: 'normal',
            }}
          >
            {source}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}

function formatTimeAgo(isoString: string) {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 minute ago'
  if (mins < 60) return `${mins} minutes ago`
  const hours = Math.floor(mins / 60)
  if (hours === 1) return '1 hour ago'
  return `${hours} hours ago`
}

export default function ConversationPage({ params }: { params: Promise<{ personaId: string }> }) {
  const [personaId, setPersonaId] = useState<string>('')
  const [persona, setPersona] = useState<Persona | null>(null)
  const [history, setHistory] = useState<ConversationTurn[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    params.then(({ personaId: pid }) => {
      setPersonaId(pid)
    })
  }, [params])

  useEffect(() => {
    if (!personaId) return
    Promise.all([
      getPersona(personaId),
      conversationHistory(personaId),
      suggestedQuestions(personaId, 3),
    ]).then(([p, hist, sugg]) => {
      setPersona(p)
      setHistory(hist)
      setSuggestions(sugg)
    }).catch(() => {})
  }, [personaId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, thinking])

  const handleAsk = useCallback(async (question: string) => {
    if (!question.trim() || thinking || !personaId) return
    setInput('')
    setThinking(true)

    try {
      const turn = await converse(personaId, question)
      setHistory((h) => [...h, turn])
      const newSugg = await suggestedQuestions(personaId, 3)
      setSuggestions(newSugg)
    } catch {
      const fallback: ConversationTurn = {
        id: `${Date.now()}-fallback`,
        userQuestion: question,
        personaResponse: "I don't think I ever wrote about that. Ask me something else.",
        source: 'cache',
        generatedAt: new Date().toISOString(),
      }
      setHistory((h) => [...h, fallback])
    } finally {
      setThinking(false)
    }
  }, [personaId, thinking])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAsk(input)
    }
  }

  if (!persona) {
    return (
      <>
        <AppNav />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <ThinkingDots />
        </div>
      </>
    )
  }

  const lifespan = persona.lifespan.living
    ? `b. ${persona.lifespan.born ?? '—'}`
    : `${persona.lifespan.born ?? '—'}–${persona.lifespan.died ?? '—'}`

  return (
    <>
      <AppNav personaName={persona.name} breadcrumb="Conversation" />

      <SceneTransition>
        <main
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: 'var(--space-2xl) var(--space-xl) 300px',
          }}
        >
          {/* Page header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-2xl)',
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--display-2)',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  color: 'var(--ink)',
                }}
              >
                {persona.name}
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--small)',
                  color: 'var(--ink-faint)',
                  marginTop: 4,
                }}
              >
                {lifespan}
              </p>
            </div>
            <Link
              href={`/dashboard/${personaId}`}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--small)',
                color: 'var(--ink-soft)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--rule)',
              }}
            >
              About this keep →
            </Link>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', marginBottom: 'var(--space-2xl)' }} />

          {/* Empty state */}
          {history.length === 0 && !thinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: 'var(--space-3xl) 0',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-prose)',
                  fontSize: 'var(--body-lg)',
                  color: 'var(--ink-soft)',
                  fontStyle: 'italic',
                  marginBottom: 'var(--space-xl)',
                }}
              >
                You haven't spoken with {persona.name.split(' ')[0]} yet.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
                {suggestions.map((q) => (
                  <SuggestedPill key={q} question={q} onSelect={handleAsk} large />
                ))}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--small)',
                  color: 'var(--ink-faint)',
                  marginTop: 'var(--space-lg)',
                }}
              >
                {persona.name.split(' ')[0]} will answer in her own voice, in her own words.
              </p>
            </motion.div>
          )}

          {/* Conversation timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            <AnimatePresence mode="popLayout">
              {history.map((turn) => (
                <motion.div
                  key={turn.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}
                >
                  {/* User question */}
                  <div style={{ maxWidth: 480 }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--caption)',
                        color: 'var(--ink-faint)',
                        marginBottom: 'var(--space-sm)',
                        textTransform: 'lowercase',
                      }}
                    >
                      you, {formatTimeAgo(turn.generatedAt)}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--body)',
                        color: 'var(--ink-soft)',
                        lineHeight: 1.5,
                      }}
                    >
                      {turn.userQuestion}
                    </p>
                  </div>

                  {/* Persona response */}
                  <div
                    style={{
                      maxWidth: 640,
                      boxShadow: `0 12px 32px var(--shadow)`,
                      borderRadius: 8,
                      padding: 'var(--space-lg)',
                      background: 'var(--paper)',
                      border: '1px solid var(--rule)',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--caption)',
                        color: 'var(--ink-faint)',
                        marginBottom: 'var(--space-sm)',
                      }}
                    >
                      {persona.name.split(' ')[0]}{turn.audioUrl ? ' · played 0:42' : ' · text only'}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-prose)',
                        fontSize: 'var(--body-lg)',
                        color: 'var(--ink)',
                        lineHeight: 1.65,
                        marginBottom: turn.audioUrl ? 'var(--space-md)' : 0,
                      }}
                    >
                      {turn.personaResponse}
                    </p>

                    {turn.audioUrl && (
                      <div style={{ marginBottom: 'var(--space-sm)' }}>
                        <AudioPlayerInline src={turn.audioUrl} durationLabel="0:42" />
                      </div>
                    )}

                    {turn.citedSource && (
                      <div style={{ marginTop: 'var(--space-sm)' }}>
                        <Citation source={turn.citedSource} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Thinking state */}
            {thinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ maxWidth: 640 }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--caption)',
                    color: 'var(--ink-faint)',
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  {persona.name.split(' ')[0]} · thinking…
                </p>
                <ThinkingDots />
              </motion.div>
            )}
          </div>

          <div ref={bottomRef} />
        </main>

        {/* Sticky input */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: `linear-gradient(to top, var(--paper) 60%, transparent)`,
            paddingTop: 'var(--space-2xl)',
          }}
        >
          <div
            style={{
              maxWidth: 720,
              margin: '0 auto',
              padding: '0 var(--space-xl)',
            }}
          >
            {/* Suggested pills */}
            {history.length > 0 && suggestions.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--space-sm)',
                  marginBottom: 'var(--space-md)',
                  flexWrap: 'wrap',
                }}
              >
                {suggestions.map((q) => (
                  <SuggestedPill key={q} question={q} onSelect={(q) => {
                    setInput(q)
                    textareaRef.current?.focus()
                  }} />
                ))}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: 'var(--space-md)',
                alignItems: 'flex-end',
                borderTop: '1px solid var(--rule)',
                paddingTop: 'var(--space-md)',
                paddingBottom: 'var(--space-xl)',
                background: 'var(--paper)',
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${persona.name.split(' ')[0]} something…`}
                rows={1}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  background: 'transparent',
                  fontFamily: 'var(--font-prose)',
                  fontSize: 'var(--body)',
                  color: 'var(--ink)',
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                  padding: '4px 0',
                }}
              />
              <button
                onClick={() => handleAsk(input)}
                disabled={!input.trim() || thinking}
                aria-label="Send"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: input.trim() && !thinking ? 'var(--accent)' : 'var(--rule)',
                  border: 'none',
                  cursor: input.trim() && !thinking ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: `background var(--fast) var(--ease-settle)`,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L13 7L7 13M13 7H1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </SceneTransition>
    </>
  )
}
