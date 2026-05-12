'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatTimeline } from '@/components/conversation/ChatTimeline'
import { AudioPlayer } from '@/components/conversation/AudioPlayer'
import { ThinkingState } from '@/components/conversation/ThinkingState'
import { SuggestionChips } from '@/components/conversation/SuggestionChips'

const SUGGESTION_QUESTIONS = [
  'Tell me about your childhood.',
  'Who was the most important person in your life?',
  'What was your happiest memory?',
  'How did you meet your spouse?',
  'What brought you the most joy?',
]

type Message = {
  id: string
  speaker: 'family' | 'persona'
  text: string
  audioUrl?: string
}

export default function MemorialPage({ params }: { params: { personaId: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [audioSrc, setAudioSrc] = useState<string>()
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function handleAsk(question: string) {
    if (!question.trim() || isLoading || isPlayingAudio) return

    setInput('')
    const userMsg: Message = {
      id: Date.now().toString(),
      speaker: 'family',
      text: question,
    }

    setMessages((m) => [...m, userMsg])
    setIsLoading(true)

    try {
      const res = await fetch('/api/persona/converse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          personaId: params.personaId,
          mode: 'staged',
        }),
      })

      const data = await res.json()

      const personaMsg: Message = {
        id: (Date.now() + 1).toString(),
        speaker: 'persona',
        text: data.response_text,
        audioUrl: data.audio_url,
      }

      setMessages((m) => [...m, personaMsg])

      if (data.audio_url) {
        setAudioSrc(data.audio_url)
        setIsPlayingAudio(true)
      }
    } catch (err) {
      console.error(err)
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        speaker: 'persona',
        text: "I don't think I ever wrote about that.",
      }
      setMessages((m) => [...m, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="h-screen bg-sepia flex flex-col">
      <div className="border-b border-amber-200 p-4">
        <h1 className="font-cormorant text-3xl text-amber-900">Memorial</h1>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="font-cormorant text-xl text-gray-600">Ask a question to begin</p>
          </div>
        )}
        <ChatTimeline messages={messages} />
        {isLoading && (
          <div className="p-4">
            <ThinkingState />
          </div>
        )}
      </div>

      <AudioPlayer
        src={audioSrc}
        onEnd={() => {
          setIsPlayingAudio(false)
          setAudioSrc(undefined)
        }}
      />

      <div className="border-t border-amber-200 p-4">
        <SuggestionChips
          questions={SUGGESTION_QUESTIONS}
          onSelect={handleAsk}
          disabled={isLoading || isPlayingAudio}
        />

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk(input)}
            placeholder="Ask a question..."
            disabled={isLoading || isPlayingAudio}
            className="flex-1 px-4 py-2 bg-white border border-amber-200 rounded-lg font-cormorant text-lg focus:outline-none focus:border-amber-600 disabled:opacity-50"
          />
          <button
            onClick={() => handleAsk(input)}
            disabled={isLoading || isPlayingAudio}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg font-cormorant text-lg hover:bg-amber-700 disabled:opacity-50 transition"
          >
            Ask
          </button>
        </div>
      </div>
    </main>
  )
}
