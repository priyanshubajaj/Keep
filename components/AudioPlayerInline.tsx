'use client'

import { useState, useRef, useEffect } from 'react'

interface AudioPlayerInlineProps {
  src?: string
  durationLabel?: string
}

export function AudioPlayerInline({ src, durationLabel }: AudioPlayerInlineProps) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration)
    }
    const onLoadedMetadata = () => {
      setDuration(audio.duration)
    }
    const onEnded = () => {
      setPlaying(false)
      setProgress(0)
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio || !src) return
    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }
    setPlaying(!playing)
  }

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audio.currentTime = pct * audio.duration
    setProgress(pct)
  }

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return durationLabel ?? '—'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        width: 320,
        maxWidth: '100%',
      }}
    >
      {src && <audio ref={audioRef} src={src} preload="metadata" />}

      <button
        onClick={togglePlay}
        disabled={!src}
        aria-label={playing ? 'Pause' : 'Play'}
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: '1px solid var(--ink)',
          background: 'var(--paper)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: src ? 'pointer' : 'default',
          flexShrink: 0,
          padding: 0,
          opacity: src ? 1 : 0.35,
          transition: `opacity var(--fast) var(--ease-settle)`,
        }}
      >
        {playing ? (
          <svg width="8" height="10" viewBox="0 0 8 10" fill="var(--ink)">
            <rect x="0" y="0" width="3" height="10" />
            <rect x="5" y="0" width="3" height="10" />
          </svg>
        ) : (
          <svg width="8" height="10" viewBox="0 0 10 12" fill="var(--ink)">
            <polygon points="0,0 10,6 0,12" />
          </svg>
        )}
      </button>

      <div
        onClick={handleProgressClick}
        style={{
          flex: 1,
          height: 2,
          background: 'var(--rule)',
          borderRadius: 1,
          cursor: src ? 'pointer' : 'default',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${progress * 100}%`,
            background: 'var(--accent)',
            borderRadius: 1,
            transition: playing ? 'none' : undefined,
          }}
        />
      </div>

      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--caption)',
          color: 'var(--ink-faint)',
          flexShrink: 0,
          minWidth: 32,
        }}
      >
        {duration ? formatTime(duration) : (durationLabel ?? '—')}
      </span>
    </div>
  )
}
