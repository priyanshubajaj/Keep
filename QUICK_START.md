# Quick Start — Keep Voice Preservation

## Before You Start

This is a **48-hour demo build** of a voice preservation system. All code is scaffolded and tested. You need:

1. **Supabase project** (free tier OK)
2. **API keys**: Anthropic, ElevenLabs, OpenAI
3. **A memoir** (text file) or use `data/sample-memoir.txt`

## Setup (30 min)

### 1. Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create new project
- Run migration: copy `supabase/migrations/001_schema.sql` into SQL editor
- Copy `Project Settings → API → URL` + `Service Role Secret Key`

### 2. Environment Variables

Update `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-...
ELEVENLABS_API_KEY=...
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=...
USE_FIXTURES=true        # Leave true for dev
DEMO_MODE=staged
```

### 3. Verify Build

```bash
npm run build  # Should compile in ~2s
npm run dev    # Starts on http://localhost:3000
```

## Build Pipeline (10 hours)

Run scripts **in order**:

```bash
# 1. Memoir → segments (2 min)
npx ts-node scripts/01-extract-to-segments.ts

# 2. Segments → entities (3 min)
npx ts-node scripts/02-extract-entities.ts

# 3. Segments → embeddings (3 min)
npx ts-node scripts/03-embed-segments.ts

# 4. Corpus → persona document (2 min, Opus)
npx ts-node scripts/04-build-persona.ts
# Copy PERSONA_ID from output → export PERSONA_ID=xxx

# 5. Eval persona quality gate (1 min)
npx ts-node scripts/05-eval-persona.ts
# Must score ≥80% or fails. Re-run 04 if fails.

# 6. Pre-compute 30 responses (5 min, Opus)
npx ts-node scripts/06-precompute-responses.ts

# 7. Render audio (10-15 min, ElevenLabs)
# First: create voice clone manually at elevenlabs.com
# Then: export DEMO_VOICE_ID=xxx
npx ts-node scripts/07-render-audio.ts
# Listen to all MP3s. Re-render if robotic or mispronounced.

# 8. Seed demo (1 min)
npx ts-node scripts/08-seed-demo.ts
# Outputs .env additions → add to .env.local
```

## Test Memorial Page

```bash
# Terminal 1: dev server
npm run dev

# Terminal 2: navigate to demo
# http://localhost:3000/memorial/[personaId from script 04]
```

Ask a rehearsed question → audio plays. Off-script question → text streams.

## What Happens During Build

| Script | Time | What | Tech |
|--------|------|------|------|
| 01 | 2m | Split memoir into ~75 segments | Haiku |
| 02 | 3m | Extract people, places, dates, topics | Haiku |
| 03 | 3m | Embed segments for semantic search | OpenAI |
| 04 | 2m | Write persona doc from full corpus | **Opus** |
| 05 | 1m | Quality gate: 10-question eval (≥80%) | Opus |
| 06 | 5m | Generate responses for 30 demo questions | **Opus** |
| 07 | 15m | Clone voice, render 30 MP3s | **ElevenLabs** |
| 08 | 1m | Verify everything, print final env vars | — |

**Cost estimate:** ~$5–10 (Opus + embeddings + voice clone)

## Demo Day (3.5 min)

1. **0:00–0:30**: Play cloned voice intro. Landing page fades in.
2. **0:30–1:15**: Ask cached question → audio + text render.
3. **1:15–1:35**: Tour interview, dashboard, family tree.
4. **2:00–2:45**: Ask paraphrase of cached question → re-ranker fires → audio plays.
5. **2:45–3:15**: Audience question. Cache hit or text stream.
6. **3:15**: Done.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Script 05 fails eval | Persona not grounded enough. Re-run 04 with more specific corpus. |
| Audio sounds robotic | Re-render script 07. Try different voice clone or stability settings. |
| Cache misses all hit | Re-ranker threshold too high (0.85). Lower in `/api/persona/converse`. |
| Opus rate limited | Uses Ollama fallback (if running). Quality drops. Continue. |

## Key Files

| File | Purpose |
|------|---------|
| `app/memorial/[personaId]/page.tsx` | Demo entry point |
| `/api/persona/converse` | Staged conversation (cache + reranker + miss) |
| `scripts/04-build-persona.ts` | Persona synthesis (critical quality step) |
| `scripts/05-eval-persona.ts` | Quality gate (don't skip) |
| `data/sample-memoir.txt` | Sample if you don't have your own |

## Need Help?

- Code: `README.md`
- Build: `REQUIREMENTS.md`
- This file covers setup + running the pipeline.
