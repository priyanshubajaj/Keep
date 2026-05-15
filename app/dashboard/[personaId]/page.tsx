'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { AppNav } from '@/components/AppNav'
import { SceneTransition } from '@/components/SceneTransition'
import { CoverageRing, TOPICS } from '@/components/CoverageRing'
import { getPersona, timeline, familyGraph } from '@/lib/api'
import type { Persona, TopicKey } from '@/lib/api'

export default function DashboardPage({ params }: { params: Promise<{ personaId: string }> }) {
  const [personaId, setPersonaId] = useState<string>('')
  const [persona, setPersona] = useState<Persona | null>(null)
  const [timelineData, setTimelineData] = useState<Array<{ year: number; event: string; segmentId: string; segmentText: string }>>([])
  const [graphData, setGraphData] = useState<{
    nodes: Array<{ id: string; name: string; mentionCount: number }>
    edges: Array<{ from: string; to: string; weight: number; valence: number }>
  } | null>(null)
  const [highlightTopic, setHighlightTopic] = useState<TopicKey | null>(null)
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null)

  useEffect(() => {
    params.then(({ personaId: pid }) => {
      setPersonaId(pid)
      Promise.all([
        getPersona(pid),
        timeline(pid),
        familyGraph(pid),
      ]).then(([p, tl, graph]) => {
        setPersona(p)
        setTimelineData(tl)
        setGraphData(graph)
      }).catch(() => {})
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

  const minYear = Math.min(...timelineData.map(t => t.year))
  const maxYear = Math.max(...timelineData.map(t => t.year))

  return (
    <>
      <AppNav personaName={persona.name} breadcrumb="About this keep" />
      <SceneTransition>
        <main
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: 'var(--space-2xl) var(--space-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2xl)',
          }}
        >
          {/* Module 1 — Coverage */}
          <section>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--display-2)',
                fontWeight: 400,
                color: 'var(--ink)',
                letterSpacing: '-0.02em',
                marginBottom: 'var(--space-xl)',
              }}
            >
              {persona.name}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '320px 1fr',
                gap: 'var(--space-2xl)',
                alignItems: 'start',
              }}
            >
              <CoverageRing coverage={persona.coverage} size={320} highlightTopic={highlightTopic} />
              <div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {TOPICS.map((topic) => (
                    <li
                      key={topic.key}
                      onMouseEnter={() => setHighlightTopic(topic.key)}
                      onMouseLeave={() => setHighlightTopic(null)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'default',
                        padding: '4px 0',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--body)',
                          color: highlightTopic === topic.key ? 'var(--accent)' : 'var(--ink)',
                          transition: 'color 200ms ease',
                        }}
                      >
                        {topic.label}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--small)',
                          color: 'var(--ink-faint)',
                        }}
                      >
                        {persona.coverage[topic.key]}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid var(--rule)' }} />

          {/* Module 2 — Timeline */}
          {timelineData.length > 0 && (
            <section>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--display-3)',
                  fontWeight: 400,
                  color: 'var(--ink)',
                  letterSpacing: '-0.02em',
                  marginBottom: 'var(--space-xl)',
                }}
              >
                Timeline
              </h3>
              <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: 'var(--space-xl)' }}>
                {/* Horizontal rule */}
                <div style={{ position: 'relative', height: 40, minWidth: 600 }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: 20,
                      left: 0,
                      right: 0,
                      height: 1,
                      background: 'var(--ink)',
                    }}
                  />
                  {timelineData.map((item, i) => {
                    const pct = maxYear === minYear ? 0.5 : (item.year - minYear) / (maxYear - minYear)
                    return (
                      <TimelineDot
                        key={item.segmentId}
                        item={item}
                        left={`${pct * 100}%`}
                      />
                    )
                  })}
                </div>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--small)',
                  color: 'var(--ink-soft)',
                  marginTop: 'var(--space-md)',
                }}
              >
                {timelineData.length} dated memories. {minYear} → {maxYear}.
              </p>
            </section>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid var(--rule)' }} />

          {/* Module 3 — People */}
          {graphData && (
            <section>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--display-3)',
                  fontWeight: 400,
                  color: 'var(--ink)',
                  letterSpacing: '-0.02em',
                  marginBottom: 'var(--space-xl)',
                }}
              >
                People
              </h3>
              <FamilyGraphViz nodes={graphData.nodes} edges={graphData.edges} />
              <p
                style={{
                  fontFamily: 'var(--font-prose)',
                  fontSize: 'var(--small)',
                  color: 'var(--ink-soft)',
                  fontStyle: 'italic',
                  marginTop: 'var(--space-lg)',
                }}
              >
                Mentions are mapped without entity resolution — the same person referred to two ways may appear twice. We don't guess.
              </p>
            </section>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-xl)' }}>
            <Link
              href={`/conversation/${personaId}`}
              style={{
                padding: '12px 32px',
                background: 'var(--accent)',
                color: 'white',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: 'var(--body)',
                textDecoration: 'none',
                borderRadius: 2,
              }}
            >
              Open conversation →
            </Link>
          </div>
        </main>
      </SceneTransition>
    </>
  )
}

function TimelineDot({ item, left }: { item: { year: number; event: string; segmentText: string }; left: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: 14,
        left,
        transform: 'translateX(-50%)',
        cursor: 'default',
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: hovered ? 'var(--accent)' : 'var(--ink)',
          transition: 'background 180ms ease',
        }}
      />
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: -8 }}
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--paper)',
            border: '1px solid var(--rule)',
            borderRadius: 2,
            padding: 'var(--space-md)',
            boxShadow: `0 4px 16px var(--shadow)`,
            minWidth: 200,
            maxWidth: 280,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--caption)', color: 'var(--ink-faint)', marginBottom: 4 }}>{item.year}</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--small)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--space-sm)' }}>{item.event}</p>
          <p style={{ fontFamily: 'var(--font-prose)', fontSize: 'var(--small)', color: 'var(--ink-soft)', fontStyle: 'italic', lineHeight: 1.5 }}>{item.segmentText}</p>
        </motion.div>
      )}
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--ink-faint)', marginTop: 4, textAlign: 'center', whiteSpace: 'nowrap' }}>{item.year}</p>
    </div>
  )
}

function FamilyGraphViz({
  nodes,
  edges,
}: {
  nodes: Array<{ id: string; name: string; mentionCount: number }>
  edges: Array<{ from: string; to: string; weight: number; valence: number }>
}) {
  const width = 600
  const height = 320
  const centerX = width / 2
  const centerY = height / 2

  const primaryNode = nodes[0]
  const otherNodes = nodes.slice(1)
  const positions: Record<string, { x: number; y: number }> = {}
  positions[primaryNode.id] = { x: centerX, y: centerY }

  otherNodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / otherNodes.length
    const r = 120
    positions[node.id] = {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    }
  })

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: 'visible' }}
    >
      {edges.map((edge) => {
        const from = positions[edge.from]
        const to = positions[edge.to]
        if (!from || !to) return null
        const edgeColor = edge.valence > 0.5
          ? 'var(--accent)'
          : edge.valence < 0
          ? 'var(--ink-soft)'
          : 'var(--rule)'
        return (
          <line
            key={`${edge.from}-${edge.to}`}
            x1={from.x} y1={from.y}
            x2={to.x} y2={to.y}
            stroke={edgeColor}
            strokeWidth={Math.max(0.5, edge.weight / 50)}
            opacity={0.4}
          />
        )
      })}
      {nodes.map((node) => {
        const pos = positions[node.id]
        if (!pos) return null
        const isPrimary = node.id === nodes[0].id
        return (
          <g key={node.id}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isPrimary ? 8 : 5}
              fill={isPrimary ? 'var(--ink)' : 'var(--ink-soft)'}
            />
            <text
              x={pos.x}
              y={pos.y + (isPrimary ? -14 : -10)}
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: isPrimary ? 14 : 12,
                fill: 'var(--ink)',
              }}
            >
              {node.name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
