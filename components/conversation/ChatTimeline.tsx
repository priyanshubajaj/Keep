'use client'

type Message = {
  id: string
  speaker: 'family' | 'persona'
  text: string
  audioUrl?: string
}

export function ChatTimeline({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      {messages.map((msg) => {
        const isPersona = msg.speaker === 'persona'
        return (
          <div
            key={msg.id}
            className={`flex gap-3 ${isPersona ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-xs px-5 py-4 rounded-lg font-cormorant text-lg leading-relaxed ${
                isPersona
                  ? 'bg-amber-100 text-gray-900'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
