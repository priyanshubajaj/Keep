import fs from 'fs/promises'
import path from 'path'
import { complete } from '@/lib/ai/anthropic'
import { embed } from '@/lib/ai/embeddings'
import { getPersona } from '@/lib/db/queries'
import { searchSegments } from '@/lib/rag'
import { insertResponseCache } from '@/lib/db/queries'

const PERSONA_CONVERSATION = await fs.readFile(
  path.join(process.cwd(), 'lib/ai/prompts/persona-conversation.md'),
  'utf-8'
)

const DEMO_QUESTIONS = [
  'Tell me about your childhood.',
  'Who was the most important person in your life?',
  'What was your happiest memory?',
  'How did you meet your spouse?',
  'What was your first job like?',
  'Describe a difficult time you overcame.',
  'What values were most important to you?',
  'Tell me about your family.',
  'What brought you the most joy?',
  'How did you spend your summers?',
  'What was your favorite place?',
  'Do you remember your parents?',
  'Tell me about your wedding day.',
  'What work did you do?',
  'Who were your closest friends?',
  'What was home like?',
  'Tell me about loss you experienced.',
  'What made you laugh?',
  'Describe a travel experience.',
  'What legacy do you want to leave?',
  'Tell me about your siblings.',
  'What was school like?',
  'How did you celebrate holidays?',
  'What scared you as a child?',
  'Tell me about your neighborhood.',
  'What did you do for fun?',
  'Who inspired you?',
  'What did you learn from hardship?',
  'Tell me your hopes for the future.',
  'What makes you proud?',
]

async function main() {
  const personaId = process.env.PERSONA_ID
  if (!personaId) {
    console.error('Missing PERSONA_ID. Run 04-build-persona.ts first.')
    process.exit(1)
  }

  console.log(`💾 Pre-computing responses for ${personaId}...`)

  const persona = await getPersona(personaId)
  if (!persona) {
    console.error('Persona not found')
    process.exit(1)
  }

  console.log(`Processing ${DEMO_QUESTIONS.length} questions...`)

  for (let i = 0; i < DEMO_QUESTIONS.length; i++) {
    const q = DEMO_QUESTIONS[i]
    process.stdout.write(`\r[${i + 1}/${DEMO_QUESTIONS.length}]`)

    const context = await searchSegments(q, 3)
    const system = `${persona.persona_document}\n\nRelevant context:\n${context.map((s) => s.text).join('\n\n')}\n\n${PERSONA_CONVERSATION}`

    const response = await complete({
      model: 'claude-opus-4-7',
      system,
      messages: [{ role: 'user', content: q }],
      allowFallback: false,
    })

    const responseText = response.content[0]?.type === 'text' ? response.content[0].text : ''
    const queryEmbedding = await embed(q)

    await insertResponseCache({
      personaId,
      question: q,
      responseText,
      queryEmbedding,
    })
  }

  console.log('\n✅ All responses pre-computed')
}

main().catch(console.error)
