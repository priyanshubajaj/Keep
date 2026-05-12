import fs from 'fs/promises'
import path from 'path'
import { complete } from '@/lib/ai/anthropic'
import { db } from '@/lib/db/client'
import { insertPersona } from '@/lib/db/queries'

const PERSONA_PROMPT = await fs.readFile(
  path.join(process.cwd(), 'lib/ai/prompts/persona-synthesis.md'),
  'utf-8'
)

async function main() {
  console.log('👤 Building persona from corpus...')

  const { data: segments, error } = await db.from('memory_segments').select('text')

  if (error) throw error
  if (!segments || segments.length === 0) {
    console.error('No segments found. Run scripts 01-03 first.')
    process.exit(1)
  }

  const corpus = segments.map((s) => s.text).join('\n\n')

  console.log(`Corpus size: ${corpus.length} chars across ${segments.length} segments`)

  const response = await complete({
    model: 'claude-opus-4-7',
    system: PERSONA_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Build a persona document (first person, ~600 words) from this life memoir:\n\n${corpus}`,
      },
    ],
    allowFallback: false,
  })

  const personaDocument = response.content[0]?.type === 'text' ? response.content[0].text : ''

  const persona = await insertPersona({
    name: 'Demo Persona',
    personaDocument,
  })

  console.log(`✅ Persona built: ${persona.id}`)
  console.log('\nSet env var: PERSONA_ID=' + persona.id)
  console.log('\nPersona excerpt (first 500 chars):')
  console.log(personaDocument.slice(0, 500) + '...')
}

main().catch(console.error)
