import { embed } from '@/lib/ai/embeddings'
import { db } from '@/lib/db/client'

async function main() {
  console.log('📡 Embedding segments...')

  const { data: segments, error } = await db
    .from('memory_segments')
    .select('*')
    .is('embedding', null)

  if (error) throw error
  if (!segments || segments.length === 0) {
    console.log('✅ All segments already embedded')
    return
  }

  console.log(`Processing ${segments.length} segments...`)

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    process.stdout.write(`\r[${i + 1}/${segments.length}]`)

    const embedding = await embed(seg.text)

    await db
      .from('memory_segments')
      .update({ embedding })
      .eq('id', seg.id)
  }

  console.log('\n✅ All segments embedded')
}

main().catch(console.error)
