# Pre-Flight Checklist

Before demo day, verify:

## Infrastructure (1 hour)

- [ ] Supabase migrations run without error
- [ ] All 8 build scripts complete (01–08)
- [ ] 30 audio files render (all in `public/audio/`)
- [ ] Listen to 5 random MP3s — no robotic artifacts or mispronounced names
- [ ] `.env.local` has all vars including `DEMO_PERSONA_ID` + `DEMO_VOICE_ID`

## Application (30 min)

- [ ] `npm run build` compiles in <3s
- [ ] `npm run dev` starts on http://localhost:3000
- [ ] Landing page loads: `/`
- [ ] Memorial page loads: `/memorial/[personaId]`
- [ ] Dashboard loads: `/dashboard`
- [ ] Interview stub loads: `/interview/demo`

## Demo Functionality (30 min)

- [ ] Ask 5 rehearsed questions → all hit cache, audio plays
- [ ] Ask 1 paraphrase (same intent, different wording) → re-ranker fires, audio plays
- [ ] Ask 1 off-script question → cache miss, text streams with thinking animation
- [ ] Audio player waveform animates while playing
- [ ] Suggestion chips work and pre-fill input
- [ ] Input disabled while response plays/streams

## Final Checks (15 min)

- [ ] Vercel deployed + env vars set
- [ ] `DEMO_PERSONA_ID` and `DEMO_VOICE_ID` in Vercel config
- [ ] Prod URL works on phone over conference wifi
- [ ] Ollama running locally (`curl http://localhost:11434/api/tags`)
- [ ] Anthropic key working (test on script 04)
- [ ] Fallback: if Anthropic down, Ollama takes over and responds (quality drops, demo continues)
- [ ] `public/demo-fallback.mp4` recorded (if internet fails during demo)

## Audio Files (15 min)

- [ ] All 30 MP3s exist in `public/audio/`
- [ ] Each file <5s (voice only, no pauses)
- [ ] No robotic artifacts (test on speaker system, not laptop)
- [ ] Names pronounced correctly (Eleanor, Catherine, William, etc.)
- [ ] Volume normalized (~-18dB peak)

## On-Site (30 min before)

- [ ] Laptop on Do Not Disturb, Slack closed
- [ ] Audio through venue speakers, not laptop
- [ ] Glare tested — sepia palette needs correct lighting
- [ ] Phone on Do Not Disturb
- [ ] Backup laptop synced + signed into Vercel + Supabase
- [ ] Demo script printed + rehearsed 3x

## Fallback Plan

| Scenario | Response |
|----------|----------|
| All cache misses | Suggestion chips show exact rehearsed wording; ask those instead |
| Opus rate limited | Ollama fallback kicks in; quality drops; demo continues |
| Ollama also down | Persona responds "I don't think I ever wrote about that" — on-brand |
| Audio file 404 | Browser falls to text-only with thinking animation |
| Internet fails | Play `public/demo-fallback.mp4` (cloned voice intro pre-recorded) |

---

**Time estimate:** 3 hours end-to-end (setup + build pipeline + testing + fix).

**Go/No-go decision:** By end of checklist, you know if demo is ready or what needs fixing.
