import { createHash } from 'crypto'
import fs from 'fs/promises'
import path from 'path'
import OpenAI from 'openai'

const USE_FIXTURES = process.env.USE_FIXTURES === 'true'
const FIXTURE_DIR = './fixtures'

export async function embed(text: string): Promise<number[]> {
  const key = createHash('sha256').update(`embed:${text}`).digest('hex').slice(0, 16)
  const fixturePath = path.join(FIXTURE_DIR, `embedding-${key}.json`)

  if (USE_FIXTURES) {
    try {
      const cached = await fs.readFile(fixturePath, 'utf-8')
      return JSON.parse(cached)
    } catch {
      // miss → real call
    }
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })

  const embedding = response.data[0].embedding

  if (USE_FIXTURES) {
    await fs.mkdir(FIXTURE_DIR, { recursive: true })
    await fs.writeFile(fixturePath, JSON.stringify(embedding))
  }

  return embedding
}
