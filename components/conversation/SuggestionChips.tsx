'use client'

export function SuggestionChips({
  questions,
  onSelect,
  disabled,
}: {
  questions: string[]
  onSelect: (q: string) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {questions.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect(q)}
          disabled={disabled}
          className="px-4 py-2 bg-amber-200 text-amber-900 rounded-full font-cormorant text-sm hover:bg-amber-300 disabled:opacity-50 transition"
        >
          {q}
        </button>
      ))}
    </div>
  )
}
