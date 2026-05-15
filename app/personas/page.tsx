import Link from 'next/link'
import { AppNav } from '@/components/AppNav'
import { SceneTransition } from '@/components/SceneTransition'
import { listPersonas } from '@/lib/api'
import type { Persona, TopicKey } from '@/lib/api'

const TOPIC_KEYS: TopicKey[] = [
  'childhood', 'family', 'work', 'loss', 'travel',
  'love', 'beliefs', 'daily_life', 'big_decisions', 'politics', 'joy',
]

function CoverageBar({ coverage }: { coverage: Record<TopicKey, number> }) {
  return (
    <div style={{ display: 'flex', gap: 2, height: 16, alignItems: 'center' }}>
      {TOPIC_KEYS.map((key) => (
        <div
          key={key}
          title={`${key}: ${coverage[key]}%`}
          style={{
            flex: 1,
            height: `${Math.max(4, (coverage[key] / 100) * 16)}px`,
            background: coverage[key] > 0 ? 'var(--ink)' : 'var(--paper-deep)',
            borderRadius: 1,
            opacity: 0.4 + (coverage[key] / 100) * 0.6,
          }}
        />
      ))}
    </div>
  )
}

function PersonaRow({ persona }: { persona: Persona }) {
  const lifespan = persona.lifespan.living
    ? `b. ${persona.lifespan.born ?? '—'}`
    : `${persona.lifespan.born ?? '—'}–${persona.lifespan.died ?? '—'}`

  return (
    <div
      style={{
        background: 'var(--paper-deep)',
        borderRadius: 2,
        padding: 'var(--space-lg)',
        display: 'grid',
        gridTemplateColumns: '1fr 200px auto',
        alignItems: 'center',
        gap: 'var(--space-xl)',
        border: '1px solid var(--rule)',
      }}
    >
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--display-3)',
            fontWeight: 400,
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          {persona.name}
        </h3>
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

      <CoverageBar coverage={persona.coverage} />

      <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
        <Link
          href={`/create/${persona.id}`}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--small)',
            color: 'var(--ink-soft)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--rule)',
            whiteSpace: 'nowrap',
          }}
        >
          Continue building
        </Link>
        <Link
          href={`/conversation/${persona.id}`}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--small)',
            color: 'var(--accent)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Open conversation →
        </Link>
      </div>
    </div>
  )
}

export default async function PersonasPage() {
  const personas = await listPersonas()

  return (
    <>
      <AppNav />
      <SceneTransition>
        <main
          style={{
            maxWidth: 880,
            margin: '0 auto',
            padding: 'var(--space-2xl) var(--space-xl)',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--display-2)',
              fontWeight: 400,
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              marginBottom: 'var(--space-2xl)',
            }}
          >
            Your keeps
          </h1>

          {personas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
              <p
                style={{
                  fontFamily: 'var(--font-prose)',
                  fontSize: 'var(--body-lg)',
                  color: 'var(--ink-soft)',
                  fontStyle: 'italic',
                  marginBottom: 'var(--space-xl)',
                }}
              >
                You haven't begun a keep yet.
              </p>
              <Link
                href="/begin"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: 'var(--accent)',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: 'var(--body)',
                  textDecoration: 'none',
                  borderRadius: 2,
                }}
              >
                Begin one →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {personas.map((p) => (
                <PersonaRow key={p.id} persona={p} />
              ))}
            </div>
          )}
        </main>
      </SceneTransition>
    </>
  )
}
