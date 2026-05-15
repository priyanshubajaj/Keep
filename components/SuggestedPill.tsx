'use client'

import { useState } from 'react'

interface SuggestedPillProps {
  question: string
  onSelect: (q: string) => void
  large?: boolean
}

export function SuggestedPill({ question, onSelect, large }: SuggestedPillProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={() => onSelect(question)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-block',
        padding: large ? '12px 20px' : '6px 14px',
        border: `1px solid ${hovered ? 'var(--accent)' : 'var(--rule)'}`,
        borderRadius: '2px',
        background: hovered ? 'var(--paper-deep)' : 'transparent',
        color: hovered ? 'var(--accent)' : 'var(--ink-soft)',
        fontFamily: 'var(--font-body)',
        fontSize: large ? 'var(--body)' : 'var(--small)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: `all var(--fast) var(--ease-settle)`,
        lineHeight: 1.4,
      }}
    >
      {question}
    </button>
  )
}
