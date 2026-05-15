'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createPersona } from '@/lib/api'

export default function BeginPage() {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit() {
    if (!name.trim() || submitting) return
    setSubmitting(true)
    try {
      const persona = await createPersona(name.trim())
      router.push(`/create/${persona.id}`)
    } catch {
      setSubmitting(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        minHeight: '100vh',
        background: 'var(--paper)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-xl)',
      }}
    >
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          {!submitting ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--display-3)',
                  fontWeight: 400,
                  color: 'var(--ink)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3,
                  marginBottom: 'var(--space-xl)',
                }}
              >
                What's the name of the person you're keeping?
              </p>

              <div style={{ position: 'relative', marginBottom: 'var(--space-md)' }}>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Their name"
                  style={{
                    width: '100%',
                    border: 'none',
                    borderBottom: '1px solid var(--ink-faint)',
                    background: 'transparent',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--display-3)',
                    fontWeight: 400,
                    color: 'var(--ink)',
                    letterSpacing: '-0.02em',
                    padding: '8px 0',
                    outline: 'none',
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}
                />
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--small)',
                  color: 'var(--ink-faint)',
                  marginBottom: 'var(--space-xl)',
                }}
              >
                You can change this later.
              </p>

              <motion.button
                onClick={handleSubmit}
                disabled={!name.trim()}
                whileHover={name.trim() ? { y: -2 } : {}}
                style={{
                  padding: '12px 32px',
                  background: name.trim() ? 'var(--accent)' : 'var(--rule)',
                  color: name.trim() ? 'white' : 'var(--ink-faint)',
                  border: 'none',
                  borderRadius: 2,
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--body)',
                  fontWeight: 600,
                  cursor: name.trim() ? 'pointer' : 'default',
                  transition: 'background 180ms ease',
                }}
              >
                Continue →
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', justifyContent: 'center', gap: 6 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ink-faint)', display: 'block' }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
