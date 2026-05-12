# Keep — Voice Preservation

Legacy voice preservation app. Write a memoir → segment + embed → synthesize persona with Opus → clone voice → pre-compute responses → play cached audio.

## Setup

```bash
npm install
cp .env.example .env.local
# Add your API keys to .env.local
```

## Build Pipeline

Run scripts in order:

```bash
# Segment memoir into ~75 parts
npm run build && npx ts-node scripts/01-extract-to-segments.ts

# Extract entities (people, places, dates, topics)
npx ts-node scripts/02-extract-entities.ts

# Embed all segments for semantic search
npx ts-node scripts/03-embed-segments.ts

# Build persona document from corpus
PERSONA_ID=xxx npx ts-node scripts/04-build-persona.ts

# Eval persona quality (must score ≥80%)
PERSONA_ID=xxx npx ts-node scripts/05-eval-persona.ts

# Pre-compute 30 demo responses
PERSONA_ID=xxx npx ts-node scripts/06-precompute-responses.ts

# Render audio with cloned voice
DEMO_VOICE_ID=xxx npx ts-node scripts/07-render-audio.ts

# Seed and verify demo
PERSONA_ID=xxx DEMO_VOICE_ID=xxx npx ts-node scripts/08-seed-demo.ts
```

## Run Dev Server

```bash
npm run dev
# Navigate to memorial page with session ID
http://localhost:3000/memorial/[personaId]
```

## Demo Script

- **0:00–0:30**: Cloned voice intro. Cut. Landing page.
- **0:30–1:15**: Ask cached question → audio plays + text renders.
- **1:15–1:35**: Tour interview, dashboard, family tree.
- **2:00–2:45**: Ask paraphrase → re-ranker fires → audio plays.
- **2:45–3:15**: Audience question. Cache hit or text stream.
- **3:15**: Done.

## Env Vars

```env
ANTHROPIC_API_KEY=        # Opus + Haiku
ELEVENLABS_API_KEY=       # Voice TTS + clone
OPENAI_API_KEY=           # Embeddings
SUPABASE_URL=             # Postgres + pgvector
SUPABASE_SERVICE_KEY=
DEMO_PERSONA_ID=          # From script 04
DEMO_VOICE_ID=            # From voice clone
DEMO_MODE=staged          # Don't record live
USE_FIXTURES=true         # Dev API caching
```
