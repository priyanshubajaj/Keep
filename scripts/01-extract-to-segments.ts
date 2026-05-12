import fs from 'fs/promises'
import path from 'path'
import { complete } from '@/lib/ai/anthropic'
import { insertMemorySegment } from '@/lib/db/queries'

const SEGMENTER_PROMPT = await fs.readFile(path.join(process.cwd(), 'lib/ai/prompts/segmenter.md'), 'utf-8')

async function main() {
  console.log('📖 Extracting memoir into segments...')

  let memoir = ''
  try {
    memoir = await fs.readFile('data/memoir.txt', 'utf-8')
  } catch {
    console.log('⚠️  data/memoir.txt not found. Using sample text.')
    memoir = `
      I was born in 1923 in a small town in upstate New York. My mother, Eleanor, was a schoolteacher
      and my father, William, worked as a carpenter. Our house had a big garden where we grew vegetables
      in the summer. I remember helping my mother harvest tomatoes on hot August afternoons.

      My childhood was shaped by the Great Depression. We didn't have much money, but we had each other.
      My sister Margaret and I would play in the creek near our house, building dams out of stones and sticks.
      Those were simpler times, but I learned early on the value of creativity and making do with what you have.

      In 1941, I met my wife, Catherine, at a church social in town. She was visiting her aunt for the summer.
      We danced to a phonograph record and talked until midnight. I knew right then that I wanted to marry her.
      We were married the following spring in a small ceremony with just family present.
    `
  }

  const response = await complete({
    model: 'claude-haiku-4-5-20251001',
    system: SEGMENTER_PROMPT,
    messages: [{ role: 'user', content: `Segment this memoir:\n\n${memoir}` }],
    allowFallback: true,
  })

  const text = response.content[0]?.type === 'text' ? response.content[0].text : ''
  let segments: any[] = []

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) segments = JSON.parse(jsonMatch[0])
  } catch {
    console.error('Failed to parse segments JSON')
    process.exit(1)
  }

  console.log(`✅ Extracted ${segments.length} segments`)

  for (const seg of segments) {
    await insertMemorySegment({
      source: seg.source || 'memoir:default',
      text: seg.text,
    })
  }

  console.log('✅ Segments stored in database')
}

main().catch(console.error)
