'use client'

import Link from 'next/link'

interface AppNavProps {
  personaName?: string
  breadcrumb?: string
}

export function AppNav({ personaName, breadcrumb }: AppNavProps) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px var(--space-xl)',
        borderBottom: '1px solid var(--rule)',
        backgroundColor: 'var(--paper)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          color: 'var(--ink)',
          textDecoration: 'none',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}
      >
        Keep
      </Link>

      {personaName && breadcrumb && (
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--caption)',
            color: 'var(--ink-faint)',
            letterSpacing: '0.02em',
          }}
        >
          {personaName} · {breadcrumb}
        </span>
      )}
    </nav>
  )
}
