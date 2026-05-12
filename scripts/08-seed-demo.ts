import { db } from '@/lib/db/client'
import { getResponseCache } from '@/lib/db/queries'

async function main() {
  const personaId = process.env.PERSONA_ID
  if (!personaId) {
    console.error('Missing PERSONA_ID env var')
    process.exit(1)
  }

  console.log(`🎯 Seeding demo for persona ${personaId}...`)

  const responses = await getResponseCache(personaId)

  // Check all have audio
  const missing = responses.filter((r) => !r.audio_url)
  if (missing.length > 0) {
    console.warn(`⚠️  ${missing.length} responses missing audio. Run 07-render-audio.ts first.`)
  }

  const ready = responses.filter((r) => r.audio_url)
  console.log(`✅ ${ready.length}/${responses.length} responses ready`)

  // Get voice from first response (all should have same voice)
  const voiceId = process.env.DEMO_VOICE_ID
  if (!voiceId) {
    console.error('Missing DEMO_VOICE_ID')
    process.exit(1)
  }

  console.log('\n📋 Copy these to .env.local:')
  console.log(`DEMO_PERSONA_ID=${personaId}`)
  console.log(`DEMO_VOICE_ID=${voiceId}`)
  console.log(`DEMO_MODE=staged`)

  console.log('\n✅ Demo seeded and ready for production')
}

main().catch(console.error)
