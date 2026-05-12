import { createHash } from 'crypto'
import fs from 'fs/promises'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'
import { ollamaComplete } from './ollama'

const USE_FIXTURES = process.env.USE_FIXTURES === 'true'
const OLLAMA_ENABLED = !!process.env.OLLAMA_URL
const FIXTURE_DIR = './fixtures'

type CompleteArgs = {
  model: string
  system: string
  messages: { role: 'user' | 'assistant'; content: string }[]
  allowFallback?: boolean
}

export async function complete({ model, system, messages, allowFallback = true }: CompleteArgs) {
  const key = createHash('sha256')
    .update(JSON.stringify({ model, system, messages }))
    .digest('hex')
    .slice(0, 16)
  const fixturePath = path.join(FIXTURE_DIR, `${model}-${key}.json`)

  if (USE_FIXTURES) {
    try {
      const cached = await fs.readFile(fixturePath, 'utf-8')
      return JSON.parse(cached)
    } catch {
      // miss → real call
    }
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const response = await client.messages.create({
      model,
      max_tokens: 4096,
      system,
      messages,
    })

    if (USE_FIXTURES) {
      await fs.mkdir(FIXTURE_DIR, { recursive: true })
      await fs.writeFile(fixturePath, JSON.stringify(response, null, 2))
    }

    return response
  } catch (err: any) {
    if (allowFallback && OLLAMA_ENABLED && isFallbackable(err)) {
      console.warn(`Anthropic ${err.status ?? err.code} → Ollama fallback`)
      return ollamaComplete({ system, messages })
    }
    throw err
  }
}

function isFallbackable(err: any) {
  return [429, 503, 529].includes(err.status) || ['ETIMEDOUT', 'ECONNREFUSED'].includes(err.code)
}
