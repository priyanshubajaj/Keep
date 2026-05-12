const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1'

type TextToSpeechOptions = {
  text: string
  voiceId: string
  stability?: number
  similarity_boost?: number
}

export async function textToSpeech({
  text,
  voiceId,
  stability = 0.5,
  similarity_boost = 0.75,
}: TextToSpeechOptions): Promise<Buffer> {
  const res = await fetch(`${ELEVENLABS_BASE}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability,
        similarity_boost,
      },
    }),
  })

  if (!res.ok) {
    throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`)
  }

  return Buffer.from(await res.arrayBuffer())
}
