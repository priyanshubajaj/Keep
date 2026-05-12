'use server'

import { NextRequest, NextResponse } from 'next/server'

const RERANK_SYSTEM = `You are a semantic matcher. Given two questions, determine if they have the same intent and would be answered the same way. Respond with valid JSON only: {"match": true} or {"match": false}`

async function haikuRerank(userQuestion: string, cachedQuestion: string): Promise<boolean> {
  try {
    const { complete } = await import('@/lib/ai/anthropic')
    const response = await complete({
      model: 'claude-haiku-4-5-20251001',
      system: RERANK_SYSTEM,
      messages: [
        {
          role: 'user',
          content: `User: "${userQuestion}"\nCached: "${cachedQuestion}"\nSame intent?`,
        },
      ],
      allowFallback: true,
    })

    const text = response.content[0]?.type === 'text' ? response.content[0].text : ''
    return text.includes('true')
  } catch (err) {
    console.error('Rerank error:', err)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const { question, personaId, mode } = await req.json()

    if (!question || !personaId) {
      return NextResponse.json({ error: 'Missing question or personaId' }, { status: 400 })
    }

    // Staged demo mode: cache lookup
    if (mode === 'staged' || process.env.DEMO_MODE === 'staged') {
      try {
        const { embed } = await import('@/lib/ai/embeddings')
        const { topKCachedResponses, getPersona } = await import('@/lib/db/queries')
        const { searchSegments } = await import('@/lib/rag')
        const { complete } = await import('@/lib/ai/anthropic')

        const queryEmbedding = await embed(question)
        const candidates = await topKCachedResponses(personaId, queryEmbedding, 3)

        if (candidates && candidates.length > 0) {
          const best = candidates[0]
          if (best.cosine >= 0.85) {
            const matches = await haikuRerank(question, best.question)
            if (matches) {
              return NextResponse.json({
                id: best.id,
                question: best.question,
                response_text: best.response_text,
                audio_url: best.audio_url,
                source: 'cache',
              })
            }
          }
        }

        // Miss: generate with Opus
        const persona = await getPersona(personaId)
        const context = await searchSegments(question, 3)

        const system = `${persona.persona_document}\n\nYou are answering questions as this person. Ground answers in real memories. Keep responses brief (1-3 sentences for voice).\n\nRelevant context:\n${context.map((s: any) => s.text).join('\n\n')}`

        const response = await complete({
          model: 'claude-opus-4-7',
          system,
          messages: [{ role: 'user', content: question }],
          allowFallback: true,
        })

        const text = response.content[0]?.type === 'text' ? response.content[0].text : ''

        return NextResponse.json({
          response_text: text,
          source: 'miss',
        })
      } catch (dbErr) {
        console.error('DB/AI error:', dbErr)
        return NextResponse.json({
          response_text: "I don't think I ever wrote about that.",
          source: 'error',
        })
      }
    }

    return NextResponse.json({ error: 'Live mode not implemented' }, { status: 501 })
  } catch (err: any) {
    console.error('Route error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
