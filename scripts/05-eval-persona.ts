import fs from 'fs/promises'
import path from 'path'
import { complete } from '@/lib/ai/anthropic'
import { getPersona } from '@/lib/db/queries'
import { searchSegments } from '@/lib/rag'

const PERSONA_CONVERSATION = await fs.readFile(
  path.join(process.cwd(), 'lib/ai/prompts/persona-conversation.md'),
  'utf-8'
)

const EVAL_QUESTIONS = [
  'Who was your mother and what was she like?',
  'Do you remember any specific summer memories from your childhood?',
  'How did you meet your wife?',
  'What work did your father do?',
  'What challenges did your family face during the Depression?',
  'Where were you born?',
  'Tell me about a time you spent with your sister.',
  'What was your house like growing up?',
  'What was your wife\'s name and when did you marry her?',
  'What emotions do you associate with your childhood?',
]

async function main() {
  const personaId = process.env.PERSONA_ID
  if (!personaId) {
    console.error('Missing PERSONA_ID env var. Run 04-build-persona.ts first.')
    process.exit(1)
  }

  console.log(`📋 Evaluating persona ${personaId}...`)

  const persona = await getPersona(personaId)
  if (!persona) {
    console.error('Persona not found')
    process.exit(1)
  }

  let passed = 0

  for (let i = 0; i < EVAL_QUESTIONS.length; i++) {
    const q = EVAL_QUESTIONS[i]
    process.stdout.write(`\n[${i + 1}/${EVAL_QUESTIONS.length}] ${q}\n`)

    const context = await searchSegments(q, 5)
    const system = `${persona.persona_document}\n\nContext:\n${context.map((s) => s.text).join('\n\n')}`

    const response = await complete({
      model: 'claude-opus-4-7',
      system,
      messages: [{ role: 'user', content: q }],
      allowFallback: false,
    })

    const answer = response.content[0]?.type === 'text' ? response.content[0].text : ''
    console.log(`A: ${answer.slice(0, 150)}...`)

    // Check for specific citations (real names, dates, places)
    const hasCitation = /\b(19|20)\d{2}\b|\b[A-Z][a-z]+\b.*\b[A-Z][a-z]+\b/.test(answer)

    if (hasCitation) {
      console.log('✅ PASS (cites specifics)')
      passed++
    } else {
      console.log('❌ FAIL (generic response)')
    }
  }

  const score = passed / EVAL_QUESTIONS.length
  console.log(`\n📊 Score: ${passed}/${EVAL_QUESTIONS.length} (${Math.round(score * 100)}%)`)

  if (score >= 0.8) {
    console.log('✅ Persona quality gate PASSED')
  } else {
    console.error('❌ Persona quality gate FAILED. Iterate and try again.')
    process.exit(1)
  }
}

main().catch(console.error)
