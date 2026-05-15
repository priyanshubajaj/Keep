import * as mock from './api.mock'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false'

export type PersonaId = string
export type SegmentId = string

export type TopicKey =
  | 'childhood' | 'family' | 'work' | 'loss' | 'travel'
  | 'love' | 'beliefs' | 'daily_life' | 'big_decisions'
  | 'politics' | 'joy'

export type Persona = {
  id: PersonaId
  name: string
  lifespan: { born?: number; died?: number; living: boolean }
  voiceId?: string
  builtAt: string
  freshness: 'fresh' | 'stale'
  counts: { memories: number; audioMinutes: number }
  coverage: Record<TopicKey, number>
}

export type MemorySegment = {
  id: SegmentId
  source: string
  text: string
  audioUrl?: string
  topic: TopicKey
  entities: {
    people: string[]
    places: string[]
    dates: string[]
    valence: number
  }
}

export type ConversationTurn = {
  id: string
  userQuestion: string
  personaResponse: string
  audioUrl?: string
  citedSegmentId?: SegmentId
  citedSource?: string
  source: 'cache' | 'live'
  generatedAt: string
}

export type IngestProgress = {
  stage: 'segmenting' | 'extracting' | 'embedding' | 'done'
  segmentsAdded?: number
}

export async function createPersona(name: string): Promise<Persona> {
  return USE_MOCK ? mock.createPersona(name) : realCreatePersona(name)
}

export async function listPersonas(): Promise<Persona[]> {
  return USE_MOCK ? mock.listPersonas() : realListPersonas()
}

export async function getPersona(id: PersonaId): Promise<Persona> {
  return USE_MOCK ? mock.getPersona(id) : realGetPersona(id)
}

export async function rebuildPersona(id: PersonaId): Promise<Persona> {
  return USE_MOCK ? mock.rebuildPersona(id) : realRebuildPersona(id)
}

export async function ingestText(
  id: PersonaId,
  text: string,
  source: string
): Promise<AsyncIterable<IngestProgress>> {
  return USE_MOCK ? mock.ingestText(id, text, source) : realIngestText(id, text, source)
}

export async function ingestAudio(
  id: PersonaId,
  audio: Blob,
  source: string
): Promise<AsyncIterable<IngestProgress>> {
  return USE_MOCK ? mock.ingestAudio(id, audio, source) : realIngestAudio(id, audio, source)
}

export async function nextInterviewQuestion(id: PersonaId): Promise<{
  questionText: string
  questionAudioUrl?: string
}> {
  return USE_MOCK ? mock.nextInterviewQuestion(id) : realNextInterviewQuestion(id)
}

export async function converse(id: PersonaId, question: string): Promise<ConversationTurn> {
  return USE_MOCK ? mock.converse(id, question) : realConverse(id, question)
}

export async function suggestedQuestions(id: PersonaId, count: number): Promise<string[]> {
  return USE_MOCK ? mock.suggestedQuestions(id, count) : realSuggestedQuestions(id, count)
}

export async function conversationHistory(id: PersonaId): Promise<ConversationTurn[]> {
  return USE_MOCK ? mock.conversationHistory(id) : realConversationHistory(id)
}

export async function timeline(id: PersonaId): Promise<Array<{
  year: number
  event: string
  segmentId: SegmentId
  segmentText: string
}>> {
  return USE_MOCK ? mock.timeline(id) : realTimeline(id)
}

export async function familyGraph(id: PersonaId): Promise<{
  nodes: Array<{ id: string; name: string; mentionCount: number }>
  edges: Array<{ from: string; to: string; weight: number; valence: number }>
}> {
  return USE_MOCK ? mock.familyGraph(id) : realFamilyGraph(id)
}

// ---------- Real implementations (replace bodies when backend exists) ----------

async function realCreatePersona(_name: string): Promise<Persona> {
  throw new Error('Backend not connected')
}
async function realListPersonas(): Promise<Persona[]> {
  throw new Error('Backend not connected')
}
async function realGetPersona(_id: PersonaId): Promise<Persona> {
  throw new Error('Backend not connected')
}
async function realRebuildPersona(_id: PersonaId): Promise<Persona> {
  throw new Error('Backend not connected')
}
async function realIngestText(_id: PersonaId, _text: string, _source: string): Promise<AsyncIterable<IngestProgress>> {
  throw new Error('Backend not connected')
}
async function realIngestAudio(_id: PersonaId, _audio: Blob, _source: string): Promise<AsyncIterable<IngestProgress>> {
  throw new Error('Backend not connected')
}
async function realNextInterviewQuestion(_id: PersonaId): Promise<{ questionText: string; questionAudioUrl?: string }> {
  throw new Error('Backend not connected')
}
async function realConverse(_id: PersonaId, _question: string): Promise<ConversationTurn> {
  throw new Error('Backend not connected')
}
async function realSuggestedQuestions(_id: PersonaId, _count: number): Promise<string[]> {
  throw new Error('Backend not connected')
}
async function realConversationHistory(_id: PersonaId): Promise<ConversationTurn[]> {
  throw new Error('Backend not connected')
}
async function realTimeline(_id: PersonaId): Promise<Array<{ year: number; event: string; segmentId: SegmentId; segmentText: string }>> {
  throw new Error('Backend not connected')
}
async function realFamilyGraph(_id: PersonaId): Promise<{ nodes: Array<{ id: string; name: string; mentionCount: number }>; edges: Array<{ from: string; to: string; weight: number; valence: number }> }> {
  throw new Error('Backend not connected')
}
