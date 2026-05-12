'use client'

export function ThinkingState() {
  return (
    <div className="flex gap-2 px-5 py-4 items-center">
      <span className="text-amber-900 font-cormorant text-lg">Thinking</span>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
    </div>
  )
}
