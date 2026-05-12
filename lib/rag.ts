import { db } from './db/client'
import { embed } from './ai/embeddings'

export async function cosineSimilarity(a: number[], b: number[]): Promise<number> {
  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

export async function searchSegments(query: string, limit = 5) {
  const queryEmbedding = await embed(query)

  const { data: segments, error } = await db
    .from('memory_segments')
    .select('*')
    .not('embedding', 'is', null)
    .limit(100)

  if (error) throw error

  const scored = await Promise.all(
    segments.map(async (seg) => ({
      ...seg,
      similarity: await cosineSimilarity(queryEmbedding, seg.embedding),
    }))
  )

  return scored.sort((a, b) => b.similarity - a.similarity).slice(0, limit)
}
