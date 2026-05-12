import { db } from './client'

export async function insertMemorySegment(segment: {
  sessionId?: string
  source: string
  text: string
  topic?: string
  entities?: Record<string, any>
  embedding?: number[]
}) {
  const { data, error } = await db.from('memory_segments').insert([segment]).select()
  if (error) throw error
  return data[0]
}

export async function updateMemorySegmentEmbedding(id: string, embedding: number[]) {
  const { error } = await db.from('memory_segments').update({ embedding }).eq('id', id)
  if (error) throw error
}

export async function getMemorySegments() {
  const { data, error } = await db.from('memory_segments').select('*')
  if (error) throw error
  return data
}

export async function insertPersona(persona: {
  sessionId?: string
  name: string
  personaDocument: string
  voiceId?: string
}) {
  const { data, error } = await db.from('personas').insert([persona]).select()
  if (error) throw error
  return data[0]
}

export async function getPersona(id: string) {
  const { data, error } = await db.from('personas').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function insertResponseCache(response: {
  personaId: string
  question: string
  responseText: string
  audioUrl?: string
  queryEmbedding: number[]
}) {
  const { data, error } = await db.from('response_cache').insert([response]).select()
  if (error) throw error
  return data[0]
}

export async function getResponseCache(personaId: string) {
  const { data, error } = await db
    .from('response_cache')
    .select('*')
    .eq('persona_id', personaId)
  if (error) throw error
  return data
}

export async function topKCachedResponses(personaId: string, queryEmbedding: number[], k = 3) {
  const { data, error } = await db.rpc('top_k_cached_responses', {
    persona_id: personaId,
    query_embedding: queryEmbedding,
    k,
  })
  if (error) throw error
  return data
}
