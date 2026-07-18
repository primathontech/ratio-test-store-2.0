# Voice Agent — Production Multilingual Language Matching (Hindi / English / Hinglish / all of India)

- **Date:** 2026-07-18
- **Branch:** `feat/voice-agent`
- **Scope:** Instruction-text only — `src/ui/voice/agentConfig.ts` (persona) + `src/ui/voice/voiceConfig.ts` (greeting) + `.env` docs. **Zero** changes to turn-taking / barge-in / VAD / provider / transcription code.
- **Status:** SHIPPED (v3) per decision 2026-07-18. Default language reliable; mid-conversation switching ~75–80% (the model's implicit-switch ceiling) — accepted as-is. `tsc`/`eslint`/`prettier` clean; barge-in verified working. Per-turn detection deferred (see §0). Uncommitted — user builds + commits.

---

## 0. CORRECTION — post-first-test (2026-07-18)

**v1 (implicit per-utterance matching) was tested: barge-in held ✓, but the agent still replied English to Hinglish.** The greeting anchor was real but not the whole story. Two deeper causes:

- **IMPLICIT language matching is unreliable.** OpenAI's realtime guide + community testing: implicit Hindi switching succeeds only **~6/10** (*"4 of 10 it continued in English despite the user speaking Hindi"*), while an **EXPLICIT default language** is followed **~10/10**. `gpt-realtime`'s English prior wins ambiguous Hinglish and sticks. v1 relied on implicit matching — the 6/10 path.
- **Dev stale-token confound.** The persona is baked into the ephemeral token at mint and cached client-side (`tokenRef`, 25 min); `next dev` Fast Refresh **preserves refs**, so a token minted before the edit (old persona) is reused while the client greeting hot-reloads fresh — same symptom. **Testing requires a guaranteed-fresh token** (restart dev server + hard refresh).

**Revised fix:** EXPLICIT config-driven default language — `NEXT_PUBLIC_VOICE_LANGUAGE` (default `English`; bblunt = `Hindi or Hinglish`), used in the persona `# Language` section as *"speak the default; switch only on a substantive utterance in another language."* Still merchant-agnostic; still zero barge-in / turn-detection changes. Sources: [languages in realtime](https://community.openai.com/t/languages-in-realtime-api/980149) · [realtime language switching](https://community.openai.com/t/realtime-api-language-switching/1366289) · [realtime prompting guide](https://developers.openai.com/api/docs/guides/realtime-models-prompting).

---

## 1. Objective (P0)

Indian shoppers speak Hindi, English, Hinglish, and regional languages, freely code-switched. The agent must: detect the spoken language from the **first** utterance, reply in it, mirror **Hinglish**, and switch **instantly** mid-conversation — a ChatGPT-Voice-grade experience — while breaking **no** existing behaviour (especially **barge-in**).

## 2. Root Cause Analysis

The reply-language decision is made by `gpt-realtime` **from the audio, every turn**, governed by the **instructions** — not by transcription and not by any client logic (doc-confirmed, §3). Two things in the current instructions steered it wrong:

1. **The proactive greeting hard-anchored English.** `voiceConfig.ts` greeting instruction said *"Default to English for this opening line… then mirror their language once they reply."* Because we greet **before** the shopper speaks, turn 1 was always English → English became the running language.
2. **The persona anti-flap rule was incumbent-biased and mislabelled Hinglish.** `agentConfig.ts` `# Language` said *"STAY in [the language]… do NOT switch for… English loanwords."* After the English greeting, a Hinglish line (*"…shampoo dikha sakte hai"*) reads as "English + a loanword" → it **stayed English**. Exactly the reported repro.

**One-turn-late switch** was the same rule ("STAY unless a FULL sentence in another language") — a deliberate delay. The model *can* switch same-turn (it has the audio before it composes), so the lag was a **prompt choice, not an API limit**. No client "pin" is needed — and the pin is precisely what risked barge-in in the prior attempt.

## 3. Documentation Summary (OpenAI Realtime — verified via Context7)

- **Model consumes audio directly; transcription is async guidance.** *"Input audio transcription… provides guidance on audio content rather than a precise transcript of what the model heard. Because the model consumes audio directly, transcription is handled via a separate endpoint."* → Reply language is an **instruction** problem; swapping `whisper-1` would only improve the UI transcript, not reply language.
- **Language is controlled via a `## Language` instruction block.** The Realtime prompting guide ships a "Pin Model to One Language" pattern and a "Model Teaches a Language" pattern (conditional per-context language selection) — proving instruction-driven language control, including dynamic switching, is reliable. (`/guides/realtime-models-prompting`)
- **`response.create.instructions` override the session config for that ONE response only.** *"If these are set, they will override the Session's configuration for this Response only."* → The greeting (a one-shot `response.instructions`) governs only the greeting turn; the shopper's first real reply (VAD auto-response, no override) runs on the **session persona** — so the de-anchor rule must live in the persona. ✅
- **No closed language list.** Speech stack supports "a wide range of languages" (Hindi listed); *"the model may process unlisted languages with lower quality."* → Instruct **open-ended** coverage, never an allow-list.
- **Caveat:** instructions are *"not guaranteed to be followed perfectly."* → Wording is written for maximum compliance; same-turn switching is the one item requiring live verification.

## 4. Benchmark Comparison

- **ChatGPT Voice / Gemini Live never greet first** — the user's audio is always the first language signal, so they match language with no anchor. Our proactive greeting (a deliberate "I'm listening" cue) was the single thing breaking that parity.
- **Fix keeps our greeting** (UX cue) but **de-anchors** it: the persona treats the shopper's first utterance as authoritative, so we get ChatGPT-Voice language behaviour *and* keep the spoken greeting.

## 5. Architecture

Two instruction slots, each doing one job:

| Slot | File | In effect | Job |
|---|---|---|---|
| Greeting (`response.instructions`, one-shot) | `voiceConfig.ts` | greeting turn only, before shopper speaks | Say one warm line in a **configurable** language. Must NOT set conversation-wide policy (it can't — one-shot). |
| Persona (`session.instructions`) | `agentConfig.ts` | every real turn, incl. shopper's **first** reply | **De-anchor** + **per-utterance matching** + Hinglish mode + narrow anti-flap + open-ended coverage + tool-language rule. |

Language is decided by the model from audio each turn → no client pin, no per-utterance injection, **barge-in path untouched**.

## 6. Implementation

- **`agentConfig.ts` `# Language`** → per-utterance matching: reply in the language of the **most recent** utterance from the first reply on; the greeting/own replies do **not** lock the language; switch the instant they switch. **Hinglish** defined as its own mode (Hindi grammar + English nouns → reply Hinglish, don't "correct"). **Narrow anti-flap** (lone brand word doesn't flip). **Open-ended coverage** (every Indian language + dialects + any language; examples ≠ allow-list; never refuse). Tool-language rule preserved verbatim. Headline line (`# Role`) updated to "match every turn / greeting doesn't lock the language."
- **`voiceConfig.ts`** → new `VoiceGreeting.language` (env `NEXT_PUBLIC_VOICE_GREETING_LANGUAGE`, default `"English"`); greeting instruction now greets in `${greetingLanguage}` and the English-anchor clause is **removed**.
- **`.env` / `.env.example`** → documented the new var; bblunt deployment set to `Hindi or natural Hinglish` (cold-open only — de-anchor means an English-first shopper still gets English).

## 7. Regression Report

| Area | Touched? | Status |
|---|---|---|
| Barge-in (`speech_started`→truncate→`onInterrupted`) | No | Byte-for-byte unchanged — cannot regress |
| Turn detection / VAD / semantic_vad / coalescing | No | Unchanged |
| Provider (WebRTC, SDP, data channel, mint) | No | Unchanged |
| Tools / function calling / cart / checkout / navigation | No | Unchanged |
| Tool-query language (catalog stays `catalogLanguage`) | Preserved in persona | Unchanged rule |
| Greeting **mechanism** (one-shot, fires once) | No | Unchanged (only its text/language) |
| Currency / money rules | No | Unchanged |
| Safety & scope guardrails | No | Unchanged |
| Transcription (`whisper-1`) | No | Deferred (see §9) |
| Persona/greeting **text** | Yes | The change |

Verification so far: `tsc --noEmit` exit 0; `eslint` clean; `prettier` unchanged.

## 8. Validation Plan (live, one change re-tested at a time)

1. **Turn-1 language:** Hindi-first / English-first / **Hinglish-first ("…shampoo dikha sakte hai")** → reply matches on the first reply.
2. **Mid-switch, same turn:** Hi→En, En→Hi, →Hinglish → switches on that turn (not one late).
3. **Anti-flap:** lone English brand word in a Hindi sentence → stays Hindi.
4. **Regional:** Tamil / Bengali / Marathi / Telugu utterance → replied in-language.
5. **Barge-in (critical):** interrupt the greeting; interrupt a mid-reply → still truncates cleanly.
6. **Tool language:** Hindi request still returns results (query sent as English keywords).

## 9. Deferred / Follow-ups

- **Same-turn switch** is the one behaviour docs support but can't prove — confirm on device.
- **Transcription upgrade** `whisper-1` → `gpt-4o-transcribe` (better code-switched **UI transcript** only; does not affect reply language). Isolated, separately-tested, mint-config change — not in this fix.
