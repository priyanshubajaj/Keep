'use client'

import { useEffect, useRef } from 'react'
import type { TopicKey } from '@/lib/api'

const TOPICS: { key: TopicKey; label: string; short: string }[] = [
  { key: 'childhood',     label: 'Childhood',      short: 'C' },
  { key: 'family',        label: 'Family',          short: 'F' },
  { key: 'work',          label: 'Work',            short: 'W' },
  { key: 'loss',          label: 'Loss',            short: 'L' },
  { key: 'travel',        label: 'Travel',          short: 'T' },
  { key: 'love',          label: 'Love',            short: '♥' },
  { key: 'beliefs',       label: 'Beliefs',         short: 'B' },
  { key: 'daily_life',    label: 'Daily life',      short: 'D' },
  { key: 'big_decisions', label: 'Big decisions',   short: '◆' },
  { key: 'politics',      label: 'Politics',        short: 'P' },
  { key: 'joy',           label: 'Joy',             short: 'J' },
]

interface CoverageRingProps {
  coverage: Record<TopicKey, number>
  size?: number
  highlightTopic?: TopicKey | null
}

export function CoverageRing({ coverage, size = 240, highlightTopic }: CoverageRingProps) {
  const count = TOPICS.length
  const strokeWidth = size * 0.055
  const radius = (size - strokeWidth * 2) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius
  const gapAngle = 0.04 // radians between segments
  const segmentAngle = (2 * Math.PI - gapAngle * count) / count

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Coverage ring showing topic depth"
      >
        {TOPICS.map((topic, i) => {
          const startAngle = -Math.PI / 2 + i * (segmentAngle + gapAngle)
          const endAngle = startAngle + segmentAngle
          const pct = coverage[topic.key] / 100

          const x1 = cx + radius * Math.cos(startAngle)
          const y1 = cy + radius * Math.sin(startAngle)
          const x2 = cx + radius * Math.cos(endAngle)
          const y2 = cy + radius * Math.sin(endAngle)
          const largeArc = segmentAngle > Math.PI ? 1 : 0

          const bgPath = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`

          const fillAngle = startAngle + segmentAngle * pct
          const fx = cx + radius * Math.cos(fillAngle)
          const fy = cy + radius * Math.sin(fillAngle)
          const fillLargeArc = segmentAngle * pct > Math.PI ? 1 : 0
          const fillPath = pct > 0
            ? `M ${x1} ${y1} A ${radius} ${radius} 0 ${fillLargeArc} 1 ${fx} ${fy}`
            : null

          const isHighlighted = highlightTopic === topic.key

          return (
            <g key={topic.key}>
              <path
                d={bgPath}
                fill="none"
                stroke="var(--paper-deep)"
                strokeWidth={strokeWidth}
                strokeLinecap="butt"
              />
              {fillPath && (
                <path
                  d={fillPath}
                  fill="none"
                  stroke={isHighlighted ? 'var(--accent)' : 'var(--ink)'}
                  strokeWidth={strokeWidth}
                  strokeLinecap="butt"
                  style={{ transition: 'stroke var(--considered) var(--ease-settle)' }}
                  opacity={isHighlighted ? 1 : 0.7}
                />
              )}
            </g>
          )
        })}
      </svg>

      <ul
        className="sr-only"
        aria-label="Topic coverage percentages"
      >
        {TOPICS.map((t) => (
          <li key={t.key}>{t.label}: {coverage[t.key]}%</li>
        ))}
      </ul>
    </div>
  )
}

export { TOPICS }
