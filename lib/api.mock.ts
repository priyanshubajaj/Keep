// Seeded from data/margaret-hale.json — output of scripts/08-seed-demo.ts
// Do not edit manually; re-run the seed script to regenerate.
import type { Persona, PersonaId, ConversationTurn, IngestProgress, TopicKey } from './api'
import seed from '../data/margaret-hale.json'

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const MARGARET: Persona = {
  ...seed.persona,
  builtAt: seed._meta.personaBuiltAt,
  freshness: 'fresh',
  counts: { memories: seed._meta.segmentCount, audioMinutes: seed._meta.audioMinutes },
  coverage: seed.coverage as Record<TopicKey, number>,
}

const EMPTY_PERSONA: Persona = {
  id: 'new-persona',
  name: '',
  lifespan: { living: true },
  builtAt: new Date().toISOString(),
  freshness: 'stale',
  counts: { memories: 0, audioMinutes: 0 },
  coverage: {
    childhood:     0,
    family:        0,
    work:          0,
    loss:          0,
    travel:        0,
    love:          0,
    beliefs:       0,
    daily_life:    0,
    big_decisions: 0,
    politics:      0,
    joy:           0,
  },
}

const personas = new Map<string, Persona>([
  ['margaret-hale', MARGARET],
])

const histories = new Map<string, ConversationTurn[]>([
  ['margaret-hale', []],
])

const MARGARET_RESPONSES: Record<string, { text: string; source: string }> = {
  default: [
    {
      text: "That question takes me back to a time I haven't thought of in years. There was a particular Tuesday in autumn — I remember because the leaves had turned that deep amber that always reminded me of the parlour curtains at Helstone — when my father first suggested we might leave. I didn't understand then what leaving truly meant.",
      source: 'from her memoir, chapter 3 — "Helstone"',
    },
    {
      text: "You know, I've come to believe that the things we carry aren't the things we intend to carry. My mother's thimble came with me to Milton. I hadn't packed it consciously. And yet there it was, wrapped in a handkerchief in the bottom of the smallest case, as though it had arranged itself.",
      source: 'from her memoir, chapter 7 — "The Cottage"',
    },
    {
      text: "I find I can answer that more honestly now than I could have at thirty. At thirty one still has the vanity of certainty. Now I am simply glad to have been wrong about so many things.",
      source: 'from her memoir, chapter 14 — "Looking Back"',
    },
  ][Math.floor(Math.random() * 3)],
}

const SUGGESTED_QUESTIONS: Record<string, string[]> = {
  'margaret-hale': [
    "What was your earliest memory of the house at Helstone?",
    "Tell me about the summer your father taught you to read Greek.",
    "How did Milton change you?",
    "Who was the person you trusted most in your life?",
    "What do you wish you had said to your mother before she died?",
    "Describe an ordinary Tuesday in Helstone.",
    "When did you first feel that your father was wrong about something?",
  ],
  default: [
    "What was your happiest memory?",
    "Who shaped you most as a person?",
    "What do you wish you had done differently?",
  ],
}

const INTERVIEW_QUESTIONS = [
  "Tell me about the kitchen of the house you grew up in.",
  "Who taught you the most important thing you know?",
  "What sound do you most associate with your childhood?",
  "Describe a meal you've never forgotten.",
  "What was the hardest decision you ever made?",
  "Tell me about someone who surprised you.",
  "What does the word 'home' mean to you?",
]
let interviewIdx = 0

export async function createPersona(name: string): Promise<Persona> {
  await delay(400)
  const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
  const p: Persona = {
    ...EMPTY_PERSONA,
    id,
    name,
    builtAt: new Date().toISOString(),
  }
  personas.set(id, p)
  histories.set(id, [])
  return p
}

export async function listPersonas(): Promise<Persona[]> {
  await delay(200)
  return [MARGARET]
}

export async function getPersona(id: PersonaId): Promise<Persona> {
  await delay(150)
  const p = personas.get(id)
  if (!p) throw new Error(`Persona not found: ${id}`)
  return p
}

export async function rebuildPersona(id: PersonaId): Promise<Persona> {
  await delay(1200)
  const p = personas.get(id)
  if (!p) throw new Error(`Persona not found: ${id}`)
  const rebuilt = { ...p, freshness: 'fresh' as const, builtAt: new Date().toISOString() }
  personas.set(id, rebuilt)
  return rebuilt
}

export async function* ingestText(
  _id: PersonaId,
  _text: string,
  _source: string
): AsyncIterable<IngestProgress> {
  await delay(600)
  yield { stage: 'segmenting' }
  await delay(800)
  yield { stage: 'extracting' }
  await delay(700)
  yield { stage: 'embedding' }
  await delay(900)
  yield { stage: 'done', segmentsAdded: Math.floor(Math.random() * 20) + 8 }
}

export async function* ingestAudio(
  _id: PersonaId,
  _audio: Blob,
  _source: string
): AsyncIterable<IngestProgress> {
  await delay(800)
  yield { stage: 'segmenting' }
  await delay(1000)
  yield { stage: 'extracting' }
  await delay(900)
  yield { stage: 'embedding' }
  await delay(1200)
  yield { stage: 'done', segmentsAdded: Math.floor(Math.random() * 12) + 4 }
}

export async function nextInterviewQuestion(_id: PersonaId): Promise<{
  questionText: string
  questionAudioUrl?: string
}> {
  await delay(300)
  const q = INTERVIEW_QUESTIONS[interviewIdx % INTERVIEW_QUESTIONS.length]
  interviewIdx++
  return { questionText: q }
}

export async function converse(id: PersonaId, question: string): Promise<ConversationTurn> {
  const isCacheHit = Math.random() > 0.4
  await delay(isCacheHit ? 800 : 2400)

  const responses = id === 'margaret-hale'
    ? [
        {
          text: "That question takes me back to a time I haven't thought of in years. There was a particular Tuesday in autumn — I remember because the leaves had turned that deep amber that always reminded me of the parlour curtains at Helstone — when my father first suggested we might leave. I didn't understand then what leaving truly meant.",
          source: 'from her memoir, chapter 3 — "Helstone"',
        },
        {
          text: "You know, I've come to believe that the things we carry aren't the things we intend to carry. My mother's thimble came with me to Milton. I hadn't packed it consciously. And yet there it was, wrapped in a handkerchief in the bottom of the smallest case, as though it had arranged itself.",
          source: 'from her memoir, chapter 7 — "The Cottage"',
        },
        {
          text: "I find I can answer that more honestly now than I could have at thirty. At thirty one still has the vanity of certainty. Now I am simply glad to have been wrong about so many things.",
          source: 'from her memoir, chapter 14 — "Looking Back"',
        },
        {
          text: "The kitchen at Helstone was small and smelled of woodsmoke and dried lavender. My aunt kept lavender in a cracked bowl on the windowsill. It was always cracked. We never replaced it. I think now that this is what I mean when I say a place felt like home — not the bowl, but the decision to keep it.",
          source: 'from her memoir, chapter 1 — "The Parsonage"',
        },
        {
          text: "Loss is a peculiar word. We use it as though the person were a set of keys misplaced. But I knew where my mother was. I knew precisely. The difficulty was that knowing made no difference at all.",
          source: 'from her memoir, chapter 11 — "Autumn in Milton"',
        },
      ]
    : [
        {
          text: "I don't think I ever wrote about that. Ask me something else.",
          source: '',
        },
      ]

  const resp = responses[Math.floor(Math.random() * responses.length)]

  const turn: ConversationTurn = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    userQuestion: question,
    personaResponse: resp.text,
    citedSource: resp.source || undefined,
    source: isCacheHit ? 'cache' : 'live',
    generatedAt: new Date().toISOString(),
  }

  const history = histories.get(id) ?? []
  histories.set(id, [...history, turn])

  return turn
}

export async function suggestedQuestions(id: PersonaId, _count: number): Promise<string[]> {
  await delay(200)
  const qs = SUGGESTED_QUESTIONS[id] ?? SUGGESTED_QUESTIONS.default
  const shuffled = [...qs].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

export async function conversationHistory(id: PersonaId): Promise<ConversationTurn[]> {
  await delay(150)
  return [...(histories.get(id) ?? [])]
}

export async function timeline(id: PersonaId): Promise<Array<{
  year: number
  event: string
  segmentId: string
  segmentText: string
}>> {
  await delay(300)
  if (id !== 'margaret-hale') return []
  return seed.timeline
}

export async function familyGraph(_id: string): Promise<{
  nodes: Array<{ id: string; name: string; mentionCount: number }>
  edges: Array<{ from: string; to: string; weight: number; valence: number }>
}> {
  await delay(400)
  return seed.people
}
