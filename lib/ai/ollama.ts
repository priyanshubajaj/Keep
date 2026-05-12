const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'llama3.1:8b'

type OllamaMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function ollamaComplete({
  system,
  messages,
}: {
  system: string
  messages: OllamaMessage[]
}) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [{ role: 'system', content: system }, ...messages],
      stream: false,
      options: { temperature: 0.7 },
    }),
  })

  if (!res.ok) throw new Error(`Ollama ${res.status}`)

  const data = await res.json()
  return {
    content: [{ type: 'text' as const, text: data.message.content }],
    model: `ollama:${OLLAMA_MODEL}`,
    stop_reason: 'end_turn',
    _source: 'ollama',
  }
}
