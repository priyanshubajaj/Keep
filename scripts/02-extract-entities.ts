import fs from 'fs/promises'
import path from 'path'
import { complete } from '@/lib/ai/anthropic'
import { db } from '@/lib/db/client'

const EXTRACTOR_PROMPT = await fs.readFile(path.join(process.cwd(), 'lib/ai/prompts/extractor.md'), 'utf-8')

async function main() {
  console.log('🔍 Extracting entities from segments...')

  const { data: segments, error } = await db
    .from('memory_segments')
    .select('*')
    .is('entities', null)

  if (error) throw error
  if (!segments || segments.length === 0) {
    console.log('✅ All segments already have entities')
    return
  }

  console.log(`Processing ${segments.length} segments...`)

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    process.stdout.write(`\r[${i + 1}/${segments.length}]`)

    const response = await complete({
      model: 'claude-haiku-4-5-20251001',
      system: EXTRACTOR_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Extract entities from this segment:\n\n${seg.text}`,
        },
      ],
      allowFallback: true,
    })

    const text = response.content[0]?.type === 'text' ? response.content[0].text : ''
    let entities = {}

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) entities = JSON.parse(jsonMatch[0])
    } catch {
      entities = {
        people: [],
        places: [],
        dates: [],
        topic: 'other',
        valence: 'neutral',
      }
    }

    await db
      .from('memory_segments')
      .update({
        entities,
        topic: (entities as any).topic || 'other',
      })
      .eq('id', seg.id)
  }

  console.log('\n✅ Entities extracted and stored')
}

main().catch(console.error)
