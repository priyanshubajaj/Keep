import fs from 'fs/promises'
import path from 'path'
import { textToSpeech } from '@/lib/elevenlabs'
import { db } from '@/lib/db/client'

async function main() {
  const voiceId = process.env.DEMO_VOICE_ID
  if (!voiceId) {
    console.error('Missing DEMO_VOICE_ID. Create a voice clone first.')
    process.exit(1)
  }

  console.log(`🎙️  Rendering audio with voice ${voiceId}...`)

  const { data: responses, error } = await db
    .from('response_cache')
    .select('*')
    .is('audio_url', null)

  if (error) throw error
  if (!responses || responses.length === 0) {
    console.log('✅ All responses already have audio')
    return
  }

  console.log(`Processing ${responses.length} responses...`)

  await fs.mkdir('public/audio', { recursive: true })

  for (let i = 0; i < responses.length; i++) {
    const r = responses[i]
    process.stdout.write(`\r[${i + 1}/${responses.length}]`)

    try {
      const audio = await textToSpeech({
        text: r.response_text,
        voiceId,
        stability: 0.5,
        similarity_boost: 0.75,
      })

      const filename = `${r.id}.mp3`
      await fs.writeFile(`public/audio/${filename}`, audio)

      await db
        .from('response_cache')
        .update({ audio_url: `/audio/${filename}` })
        .eq('id', r.id)
    } catch (err) {
      console.error(`\nFailed to render ${r.id}:`, err)
    }
  }

  console.log('\n✅ Audio rendered')
  console.log('⚠️  Listen to all files and re-render if robotic or names mispronounced.')
}

main().catch(console.error)
