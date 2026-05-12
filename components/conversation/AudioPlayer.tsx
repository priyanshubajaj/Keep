'use client'

import { useEffect, useRef, useState } from 'react'

export function AudioPlayer({
  src,
  onEnd,
}: {
  src?: string
  onEnd?: () => void
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!src) return

    const audio = audioRef.current
    if (!audio) return

    audio.src = src

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      onEnd?.()
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    audio.play().catch(() => {})

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [src, onEnd])

  return (
    <>
      <audio ref={audioRef} style={{ display: 'none' }} />
      {isPlaying && (
        <div className="flex items-center justify-center gap-1 p-2">
          <div className="w-1 h-4 bg-amber-600 rounded-full animate-pulse" />
          <div className="w-1 h-6 bg-amber-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
          <div className="w-1 h-4 bg-amber-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        </div>
      )}
    </>
  )
}
