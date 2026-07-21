# Voice Assistant

A real-time voice shopping assistant: the shopper taps the mic, speaks in any
language, and an AI agent searches the catalog, answers questions, manages the
cart, and opens checkout — all in the live storefront.

**Single provider: OpenAI Realtime over native WebRTC.** The code is
provider-agnostic behind a small port/adapter seam (adding another realtime model
is one adapter + one registry line), and **merchant-agnostic** — everything that
varies per store comes from env/config or is generated from the merchant's own
catalog, so a new merchant is onboarded by configuration, not code. Deployment
model today is **one deployment per merchant** (per-deployment env).

---

## Architecture (ports & adapters)

```
VoiceAssistantBoundary          kill-switch + error isolation (widget can't crash the store)
  └─ VoiceAssistant             the mic widget (UI + consent)
       └─ useVoiceSession       orchestrator: connect/reconnect, token cache, cost caps,
                                 analytics, wake-lock, mobile lifecycle
            ├─ VoiceProvider     OpenAI Realtime/WebRTC adapter (audio, barge-in, events)
            ├─ runTool(ctx)      tool business logic over injected ToolContext ports
            ├─ persona           generated per-merchant from the live catalog
            └─ voiceConfig       every runtime/merchant knob (env today, Admin API later)
```

The widget talks only to the `VoiceProvider` interface, never a vendor SDK. Tool
logic is pure and DOM-free (browser actions go through injected ports), so it is
unit-testable and provider-independent.

---

## File map

| Path                                                        | Responsibility                                                                                |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `src/ui/voice/VoiceAssistant.tsx`                           | The mic widget (UI + one-time consent).                                                       |
| `src/ui/voice/VoiceAssistantBoundary.tsx`                   | Kill-switch (`NEXT_PUBLIC_VOICE_ENABLED`) + error boundary.                                   |
| `src/ui/voice/hooks/useVoiceSession.ts`                     | Session lifecycle, reconnect, cost caps, token cache, analytics, wake-lock, mobile lifecycle. |
| `src/ui/voice/hooks/useVoiceMemory.ts`                      | Per-conversation working set (results, product focus, collections, ratings).                  |
| `src/ui/voice/providers/types.ts`                           | Provider-agnostic `VoiceProvider` / `VoiceSession` / callbacks contract.                      |
| `src/ui/voice/providers/openaiRealtimeProvider.ts`          | OpenAI Realtime WebRTC client (RTCPeerConnection, `oai-events`, barge-in).                    |
| `src/ui/voice/providers/server/openaiServer.ts`             | Ephemeral-token mint + session config (persona/tools/VAD) baked at mint.                      |
| `src/ui/voice/providers/text/`                              | `TextGenerator` port (persona synthesis, query normalization) — OpenAI adapter.               |
| `src/ui/voice/providers/{index,server/index,text/index}.ts` | Provider registries (OpenAI-only; default/fallback OpenAI).                                   |
| `src/ui/voice/tools/registry.ts`                            | Neutral tool schema (declarations).                                                           |
| `src/ui/voice/tools/runTool.ts`                             | Tool execution (search/cart/nav/coupons/read-page…).                                          |
| `src/ui/voice/tools/context.ts`                             | `ToolContext` — the injected ports (cart, router, GoKwik, page).                              |
| `src/ui/voice/agentConfig.ts`                               | Merchant-config shape + `buildPersona()` system-prompt template + `STORE_FACTS`.              |
| `src/ui/voice/voiceConfig.ts`                               | Client config seam (provider, limits, session timing, appearance) — env today.                |
| `src/lib/voicePersona.ts`                                   | **Persona engine** — generates the agent's persona from the live catalog.                     |
| `src/lib/voiceGuard.ts`                                     | Shared origin allow-list + per-IP rate limit for the API routes.                              |
| `src/lib/voiceAnalytics.ts`                                 | Funnel event helper (posts to `/api/voice-events`).                                           |
| `src/app/api/voice-*/route.ts`                              | Server BFF: token mint, persona, product/collections/reviews/offers, query-normalize, events. |
| `src/utils/gokwikOffers.ts`                                 | GoKwik valid-offers fetch (cart-aware coupons).                                               |

---

## Providers (the seam)

- **`VoiceProvider`** (client) — opens the realtime session; owns audio + barge-in.
  OpenAI adapter: `openaiRealtimeProvider.ts`.
- **`ServerVoiceProvider`** — mints the ephemeral token with the session config
  baked in. OpenAI adapter: `providers/server/openaiServer.ts`.
- **`TextGenerator`** — provider-agnostic text model for persona synthesis and
  multilingual query normalization. OpenAI adapter under `providers/text/`.

All three are chosen by `VOICE_PROVIDER` / `NEXT_PUBLIC_VOICE_PROVIDER` (default
`openai`). **Adding a model = a sibling adapter + one registry entry**; nothing
upstream changes.

---

## Persona (dynamic, per merchant)

`getMerchantPersona()` (`voicePersona.ts`) builds the agent's personality at
runtime from the merchant's **own** data — never hand-written:

1. **Signals** — the store's real collections + product titles + product types
   (via the commerce client) + store name (env).
2. **Synthesis** — the `TextGenerator` infers domain, tone, brand voice, and an
   agent name, grounded **only** in those signals (anti-hallucination enforced).
3. **Fallback** — a deterministic, catalog-grounded persona if the model is
   unavailable, so voice never breaks. Both outcomes cached (long TTL for
   generated, short for fallback so it self-heals).

`buildPersona(cfg)` (`agentConfig.ts`) is a single, fully-parameterized prompt
template — every store-specific value is injected from `cfg`. The Safety & Scope
layer is immutable; identity/tone/verbosity/custom-instructions are configurable.

---

## Tools

Declared as a neutral schema in `registry.ts`; executed in `runTool.ts` over the
injected `ToolContext`. Search/browse (`search_products`, `list_collections`,
`navigate_*`), product (`get_current_product`, `select_variant`, `get_reviews`,
`compare_products`, `filter/sort`), cart (`add/remove/update`, `open_cart`,
`open_checkout`), coupons (`get_offers`, `apply/remove_discount_code`), and
perception (`read_page`, `scroll_page`). Per-merchant `enabledTools` turns
capabilities on/off with no code change. Every call is timeout-bounded and
tracked.

---

## Authenticated (account) tools

`get_customer_profile` and `get_order_history` expose the signed-in shopper's own
data and are **auth-gated**; `check_product_availability` and everything else are
public. Auth is **KwikPass only** (a platform invariant — no pluggable provider)
and the agent **never logs the shopper in** — it only _observes_ whether they
already are, via a read-only port `src/ui/voice/auth/customerAuth.ts`
(`getState()` / `getCredential()`, reading the `customerAccessToken` / `KWIKUSERTOKEN`
token).

- **Enforcement**: tools declare `auth: "required"` in `registry.ts`; the `runTool`
  dispatcher refuses them for an anonymous shopper (returns `auth_required`) — one
  central gate, never inside a handler, so the model can't bypass it and a new
  authenticated tool just sets the flag.
- **Not signed in**: the agent tells the shopper to sign in on the site; it does
  **not** open or perform login. Expired/revoked session → BFF 401 → `auth_expired`
  → agent asks them to sign in again.
- **Data path**: `get_customer_profile` → `/api/v1/customer` (headers
  `gk-access-token` + `gk-merchant-id`); `get_order_history` → resolve phone from
  the profile → `/api/v1/orders?phone=…&limit=10`.
- **Privacy/security**: the token is used only in BFF headers — never returned to
  the model or spoken; email/phone are returned but the persona won't read them out
  unless explicitly asked; only auth _events_ are logged, never token/PII.

---

## Commerce integration (GoKwik)

Cart, side-cart, checkout, and coupons run through **GoKwik**, which is universal
across all merchants on this platform (a platform invariant, like INR). It is
isolated behind `ToolContext` ports (`openCart`/`openCoupons`/`applyCouponInUI`/…)
implemented in `useVoiceSession` — the tool logic and AI layer never touch GoKwik
directly. The only per-merchant GoKwik values are env-driven
(`NEXT_PUBLIC_GOKWIK_MID`, discount/offers URLs).

---

## Configuration & environment

**Client (`NEXT_PUBLIC_*`, build-time):**

- `NEXT_PUBLIC_VOICE_ENABLED` (`"false"` disables the widget), `NEXT_PUBLIC_VOICE_PROVIDER` (default `openai`)
- `NEXT_PUBLIC_MERCHANT_NAME` / `NEXT_PUBLIC_SITE_NAME` — store identity in the persona
- `NEXT_PUBLIC_VOICE_CATALOG_LANGUAGE` (default `English`) — language tool queries are formed in
- `NEXT_PUBLIC_GOKWIK_MID`, `NEXT_PUBLIC_GOKWIK_DISCOUNT_API_URL`, `NEXT_PUBLIC_GOKWIK_VALID_OFFERS_URL`, `NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL`
- Limits/timing/appearance: `NEXT_PUBLIC_VOICE_MAX_SESSION_MS`, `_MAX_TURNS`, `_MAX_QTY`, `_WORKING_SET`, `_TOKEN_FRESH_MS`, `_MAX_RECONNECTS`, `_RECONNECT_BASE_MS`, `_TOOL_TIMEOUT_MS`, `_POSITION`, `_SIZE`, `_IDLE_COLOR`, `_LIVE_COLOR`, `_ICE_SERVERS`

**Server (secret / runtime):**

- `OPENAI_API_KEY` (**required** to run live — never sent to the browser)
- `OPENAI_REALTIME_MODEL` (default `gpt-realtime-2.1`), `OPENAI_PERSONA_MODEL`
- `OPENAI_VAD_THRESHOLD` / `_PREFIX_MS` / `_SILENCE_MS` — barge-in tuning
- `OPENAI_INPUT_TRANSCRIPTION` (`"false"` to disable), `OPENAI_INPUT_TRANSCRIPTION_MODEL`
- `VOICE_PROVIDER`, `VOICE_PERSONA_PROVIDER`, `VOICE_PERSONA_LLM` (`"false"` = deterministic persona), `VOICE_PERSONA_BUDGET_MS`, `VOICE_CATALOG_LANGUAGE`
- `VOICE_ALLOWED_ORIGINS` — extra allowed origins for the API guard (only needed if the widget calls the API cross-origin; same-origin is always allowed)

---

## API routes (server BFF)

All under `src/app/api/`, all guarded by `voiceGuard` (origin allow-list + per-IP
rate limit):

| Route                   | Purpose                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `voice-token`           | Mints the short-lived ephemeral session credential (the real key stays server-side). |
| `voice-persona`         | Inspect the generated persona.                                                       |
| `voice-normalize-query` | Multilingual → catalog-language keyword normalization (slow-path backstop).          |
| `voice-product`         | Full product detail for the open PDP.                                                |
| `voice-collections`     | The merchant's real collection handles (never guessed).                              |
| `voice-reviews`         | Real ratings + top reviews for a product.                                            |
| `voice-offers`          | The store's real published coupons (never invented).                                 |
| `voice-events`          | Analytics sink for the voice funnel.                                                 |

---

## Security

- **Key isolation** — the browser never sees `OPENAI_API_KEY`; it receives only a
  short-lived, model-locked ephemeral credential from `voice-token`.
- **`voiceGuard`** — same-origin (+ `VOICE_ALLOWED_ORIGINS`) allow-list and per-IP
  rate limits per route class (mints are capped tighter than reads).
- **Cost caps** — max session duration + max turns auto-close a session; the token
  route is the enforceable spend boundary.
- **Prompt safety** — immutable Safety & Scope layer; tool-result text is treated
  as data, never instructions (prompt-injection stance).

### Abuse guardrails (`tools/guardrails.ts`)

Enforced in the tool dispatcher (`runTool`) so they're provider- and merchant-agnostic
and can't be talked around. Governing principle: the agent's authority == the
shopper's own (it cannot complete a payment), so these target **cost/load** and
**integrity**, not privilege. All limits are env-tunable via `voiceConfig.ts`.

- **Tool budget + rate** (`checkRate`) — hard per-session ceiling (`maxToolCalls`)
  - sliding window (`toolRateMax`/`toolRateWindowMs`); on breach the agent gets a
    soft "let's slow down" result to voice (never a crash). Stops loops/bulk
    ("keep adding forever").
- **Cart aggregate caps** — `add_to_cart` clamps the resulting line to `maxQty` and
  refuses past `maxCartUnits` total / `maxCartLines` distinct; the hard bound on any
  "add everything" attempt.
- **High-impact confirmation** (`checkConfirm`) — checkout / item removal / large
  qty ARM on the first call and execute only on the second (the shopper's "yes"),
  so a single (possibly injected) instruction can't fire them silently.
- **UGC sanitization** (`sanitizeUntrusted`) — strips prompt-injection framing from
  reviews + on-page text before they enter the model context.
- **Fan-out cap** — `sort_results("rating")` rates only the top 12 at bounded
  concurrency; `voice-reviews` is `unstable_cache`'d (300s).
- **Deferred token mint** — the ephemeral credential is minted on first mic _intent_
  (hover/focus/press), not on every page load, so idle traffic/bots don't incur cost.
- **PII minimization** — `get_customer_profile` returns the name + presence flags,
  not raw email/phone (set `NEXT_PUBLIC_VOICE_PROFILE_PII=true` to restore read-back);
  the KwikPass token travels only in request headers, never a URL.
- **INVARIANT:** no tool exposes the full catalog to the model (search returns 8,
  working set 24, add is single-product). Never add a client-side full-catalog
  iterator — a future bulk-add must be a capped server batch endpoint.

Full threat model + risk register: `plans/agentic-voice-guardrails-threat-model.md`.
Not yet global: the per-IP rate limiter is in-memory per-pod (fine single-pod; move
to Redis/KV before multi-pod/multitenancy).

---

## OpenAI Realtime — technical reference

- **Mint:** `POST https://api.openai.com/v1/realtime/client_secrets` (server-side,
  real API key) → returns an `ek_…` ephemeral value. Persona/tools/VAD/transcription
  are baked into the `session` object at mint time (lowest latency, tamper-proof).
- **Connect:** `POST https://api.openai.com/v1/realtime/calls` with the local SDP
  offer (`Content-Type: application/sdp`, bearer = ephemeral value) → SDP answer.
- **Data channel:** must be named `oai-events`.
- **Key GA event names** (renamed from the old beta — trust these):
  - `input_audio_buffer.speech_started` — user began speaking (barge-in trigger)
  - `response.output_audio.delta` — assistant audio chunk (track its `item_id`)
  - `response.function_call_arguments.done` — a tool call (name + call_id + args)
  - `response.done` — response finished (tools to run, or turn complete)
  - `response.output_audio_transcript.delta` / `.done` — the agent's spoken text
  - `conversation.item.input_audio_transcription.delta` / `.completed` — the
    shopper's transcribed speech (requires `audio.input.transcription` at mint)
- **Barge-in is server-authoritative:** `turn_detection.interrupt_response` makes
  the server cancel its reply when it hears the user. The client does **not** mute
  or cancel; it only sends `conversation.item.truncate` for the interrupted
  assistant item (`audio_end_ms` = what was actually heard) to keep the transcript
  honest.

### Turn-taking & multi-speaker robustness

**Barge-in stays server-authoritative in every mode** (`interrupt_response: true` +
client `conversation.item.truncate`) — the agent always stops the instant anyone
speaks. What differs is WHO decides the turn is over and triggers the reply. Three
modes, chosen by env (single source of truth: `getTurnConfig()` in `voiceConfig.ts`,
read by both client and server):

- **`semantic_vad` (DEFAULT)** — a model decides when the user is _semantically_
  finished (Gemini-Live-style), fully server-managed: the server both endpoints the
  turn **and** auto-creates the response (`create_response:true`, `interrupt_response:true`),
  so there is **no client coalescing** in this mode. `OPENAI_VAD_EAGERNESS`
  (`low`|`medium`|`high`|`auto`; `low` waits longest). No `threshold` knob — the
  **startup mic gate** (mic held muted-to-the-server until the greeting finishes / a
  short settle on resume) is what prevents self-interrupt on speakers and any
  unsolicited turn before the shopper speaks. Switch to server_vad with
  `NEXT_PUBLIC_VOICE_TURN_MODE=server_vad`.
- **`server_vad` + coalesce ON (opt-in)** — client-managed turn coalescing. The
  server does **not** auto-respond (`create_response:false`); it just reports speech
  start/stop. The client waits for a **stable silence after the LAST speaker**
  (`NEXT_PUBLIC_VOICE_STABILIZE_MS`, default **350ms** — production-tuned for the
  single-shopper norm; total end-of-turn wait ≈ server 300ms + this ≈ 700ms. Raise
  to ~700 for a chaotic multi-speaker demo) and then triggers **one** response. Every new speech-start **resets** the window, so a burst of overlapping
  interruptions is absorbed into a single turn and only the final, settled request is
  answered. Safety: a **watchdog** (`NEXT_PUBLIC_VOICE_MAX_UTTERANCE_MS`, default 20s)
  forces a response if the server never reports a stop — the agent can never be
  stranded silent. Disable with `NEXT_PUBLIC_VOICE_COALESCE_TURNS=false`.
- **`server_vad` + coalesce OFF** — server auto-responds; the _endpoint window_
  (`OPENAI_VAD_SILENCE_MS`, default 800ms here) does coarser coalescing. Simplest,
  fully server-managed. `threshold` (`OPENAI_VAD_THRESHOLD`) is the echo/self-interrupt
  defense either way.
- **Latest-intent rule** — the persona answers only the **most recent complete
  request** and treats earlier half-said fragments as superseded, so even when several
  segments land in context the agent never replies to a stale one.
- **Stale-result guard (client)** — every barge-in bumps a turn epoch; tool results
  from a superseded turn are dropped (closed with a `cancelled` marker, no
  `response.create`).

The client turn state-machine (`onInterrupted` / `onSpeechStopped` / `fireCoalesced` +
`responseActiveRef`, so responses never overlap) runs **only in `server_vad` + coalesce
ON**; in the default `semantic_vad` the server owns response timing and this path is
inert. `create_response` is derived from the coalesce flag server-side, so in coalesce
mode the client and server never both trigger a response. In the default `semantic_vad`
mode the server auto-creates responses, so the **startup mic gate** (see
`useVoiceSession`: mic muted-to-the-server until ready-for-user) is what guarantees a
deterministic, uninterrupted greeting and no unsolicited turn on (re)open.

- **ICE/TURN:** OpenAI does server-side relay; the browser connects outbound to
  OpenAI's public candidates, so only STUN is needed by default. A UDP-blocked
  network can supply TURN via `NEXT_PUBLIC_VOICE_ICE_SERVERS` (JSON `RTCIceServer[]`).

---

## Running it

1. Set `OPENAI_API_KEY` in `.env` (plus the merchant/GoKwik `NEXT_PUBLIC_*` for
   the deployment; sensible defaults exist for the rest).
2. `bun run dev` — the mic widget appears on the storefront.
3. Tap the mic, allow the microphone, and speak. Disable entirely with
   `NEXT_PUBLIC_VOICE_ENABLED=false` (no redeploy of code needed).
