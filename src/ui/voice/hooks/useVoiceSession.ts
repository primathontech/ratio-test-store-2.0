"use client";

/**
 * SESSION LIFECYCLE — the orchestrator. It owns the connect/disconnect flow, the
 * ephemeral-token cache, the cost caps, auto-reconnect, the funnel analytics, and
 * the wiring between the provider's callbacks and the tool layer. The provider
 * (OpenAI Realtime over WebRTC) renders its own audio via a native MediaStreamTrack
 * and does server-authoritative barge-in, so there is no host Web-Audio pipeline
 * here. It composes:
 *   - useVoiceMemory  (the conversation's working set of results/product focus)
 *   - createRunTool   (the injected, provider-agnostic tool business logic)
 * and exposes just `{ status, caption, start, stop }` to the component.
 *
 * CONCURRENCY MODEL (why the generation token exists): connecting is async and,
 * because the provider fires onOpen mid-handshake, the session can go "live" while
 * start() is still awaiting. A user stop() (or a fresh start, or an auto-reconnect)
 * during that window would otherwise race the in-flight connect and orphan a
 * session/mic. So every connect attempt gets a monotonically increasing GENERATION
 * (startGenRef); stop()/new attempts bump it; and every provider callback + every
 * post-await checkpoint no-ops if its generation is stale. That makes a session's
 * callbacks strictly scoped to their own generation — no cross-talk, no orphans.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCartStore } from "@shopkit/cart";
import type { TransformedProduct } from "../catalog";
import { newVoiceSession, voiceTrack } from "@/lib/voiceAnalytics";
import { captureVoiceError } from "../observability";
import {
  getVoiceProvider,
  type VoiceSession,
  type VoiceSessionCallbacks,
} from "../providers";
import { getVoiceConfig } from "../voiceConfig";
import { fetchJson, timeoutSignal, voiceAccessCode } from "../voiceHttp";
import { formatMoney } from "../money";
import { isModifiedListingView } from "../screenView";
import { createRunTool } from "../tools/runTool";
import { resolveSideCartAdapter } from "../cart/sideCartAdapter";
import { READ_ONLY_TOOLS, type ToolName } from "../tools/registry";
import { toolProgressLabel } from "../tools/progress";
import type { ToolContext, CheckoutPayload, CartState } from "../tools/context";
import { useVoiceMemory } from "./useVoiceMemory";
import { customerAuth } from "../auth/customerAuth";
import { newGuardState, type GuardState } from "../tools/guardrails";

// Merchant/runtime config seam — everything that can vary comes from here
// (env/defaults today, admin API later) so nothing below is hardcoded.
const VOICE_CFG = getVoiceConfig();
const voiceProvider = getVoiceProvider(VOICE_CFG.provider);
const MAX_SESSION_MS = VOICE_CFG.limits.maxSessionMs; // hard ceiling (backstop)
const IDLE_TIMEOUT_MS = VOICE_CFG.limits.idleTimeoutMs; // close after N ms of no user speech
const MAX_TURNS = VOICE_CFG.limits.maxTurns; // auto-close after N model turns (loop guard)
const MAX_RECONNECTS = VOICE_CFG.session.maxReconnects;
const RECONNECT_BASE_MS = VOICE_CFG.session.reconnectBaseMs;
const TURN = VOICE_CFG.turn; // turn-taking / multi-speaker coalescing config
// How long to hold back non-essential startup work (cart warm, page/cart context,
// collection fetch) after the opening greeting starts, so it doesn't contend with the
// greeting's first audio. ~1.2s covers audio spin-up; context is only needed for the
// first USER turn (after the greeting), so this is invisible to the shopper.
const STARTUP_DEFER_MS = 1200;
// PROACTIVE GREETING (config: VOICE_CFG.greeting): on a fresh session the agent
// speaks a short opening line first — like ChatGPT Voice / Gemini Live — so the
// shopper knows it's connected and listening. It's a ONE-SHOT response rendered in
// the merchant persona, armed only on start() and fired once in onOpen; reconnect,
// resume, and rapid re-open never replay it. Set NEXT_PUBLIC_VOICE_GREETING_ENABLED
// =false to restore the old silent-until-spoken behaviour (the mic going live is
// still signalled by the "Listening…" cue + pulsing button).

export type VoiceStatus = "idle" | "connecting" | "live";

/** What the live model is doing right now — drives the avatar animation only.
 *  Independent of `status` (which is the connection lifecycle). */
export type VoiceActivity = "listening" | "thinking" | "speaking";

// Minimal structural shape of a WakeLockSentinel (avoids depending on the DOM
// lib's WakeLockSentinel type, which isn't present in every TS version).
interface WakeLockLike {
  release: () => Promise<void>;
  addEventListener?: (type: "release", listener: () => void) => void;
}

export interface VoiceSessionApi {
  status: VoiceStatus;
  caption: string;
  /** Live model activity (listening/thinking/speaking) — UI animation only. */
  activity: VoiceActivity;
  /** True when the shopper's microphone is muted (model can't hear them). */
  muted: boolean;
  /** Toggle the mic mute WITHOUT dropping the session (instant, survives reconnect). */
  toggleMute: () => void;
  /** True after a TERMINAL failure the shopper must act on — mic permission denied
   *  or the connection was lost with no retries left. Cleared on the next start().
   *  Transient mid-session errors surface via `caption`, not this flag. */
  error: boolean;
  /** True when the session was auto-suspended because the tab was backgrounded
   *  (screen lock / incoming call / app switch / tab change). Conversation memory
   *  is preserved — call resume() to continue it. */
  paused: boolean;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  /** Resume a paused (backgrounded) session, CONTINUING the same conversation with
   *  its memory intact. Must be called from a user gesture (iOS re-grants mic/audio
   *  only inside one). */
  resume: () => Promise<void>;
  /** Pre-mint the ephemeral token on first user intent (mic hover/focus/press) so
   *  the connect is instant without minting on every idle page load. */
  prewarm: () => void;
}

export function useVoiceSession(): VoiceSessionApi {
  const router = useRouter();
  const pathname = usePathname();
  // Read the `?variant=` selection so we perceive the shopper's on-screen variant pick
  // (a variant change keeps the same pathname, so this is what makes the effect fire).
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [caption, setCaption] = useState("");
  // Live model activity (avatar animation) + mic-mute + terminal-error, all exposed
  // to the widget. `mutedRef` mirrors `muted` so it can be re-applied to a freshly
  // connected session (start OR reconnect) without a render dependency.
  const [activity, setActivity] = useState<VoiceActivity>("listening");
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const [error, setError] = useState(false);
  // True when the session was AUTO-SUSPENDED because the tab was backgrounded
  // (screen lock / incoming call / app switch / tab change). Conversation memory
  // is preserved; the widget offers a one-tap Resume that continues it.
  const [paused, setPaused] = useState(false);

  const memory = useVoiceMemory();

  const sessionRef = useRef<VoiceSession | null>(null);
  // Lifecycle guards (see CONCURRENCY MODEL above).
  const startGenRef = useRef(0); // current connect generation
  const startingRef = useRef(false); // re-entry guard for the public start()
  const userClosedRef = useRef(false); // true = user/stop closed it → no reconnect
  const reconnectsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const establishRef = useRef<(isRetry?: boolean) => Promise<void>>();
  // Analytics + cost-cap bookkeeping for the current session.
  const turnsRef = useRef(0);
  const toolCallsRef = useRef(0);
  // Proactive-greeting latch. Armed ONLY by a fresh start() (below), consumed on the
  // first successful onOpen. Reconnect (onClose→establish) and resume() go through
  // establish WITHOUT re-arming it, so the greeting fires exactly once per NEW
  // session and never replays on a drop/background/rapid re-open.
  const greetPendingRef = useRef(false);
  // Timestamp (ms) until which we're in the opening-greeting "startup grace" window.
  // Set in onOpen when the greeting fires; the startup side-effects (cart warm, page/
  // cart context, collection fetch) defer to the end of it so they don't contend with
  // the greeting's first audio (which caused a ~1s stutter). 0 = not in a grace window.
  const startupGraceUntilRef = useRef(0);
  // Per-session abuse-guard state (rate window + pending high-impact confirmation)
  // and the read_page debounce cache — both reset at every session start (onOpen).
  const guardStateRef = useRef<GuardState>(newGuardState());
  const readPageCacheRef = useRef<{ t: number; c: string }>({ t: 0, c: "" });
  // Bumped once per model function-call batch, so the confirmation guard can
  // require a high-impact action's arm and execute to fall in different batches.
  const batchSeqRef = useRef(0);
  // ===== CLIENT-MANAGED TURN COALESCING (multi-speaker) — active only when
  // TURN.coalesce (server_vad + create_response:false). The server reports speech
  // start/stop; we wait for a stable silence after the LAST speaker, then trigger
  // ONE response. A watchdog guarantees we never strand the agent silent, and
  // barge-in stays server-authoritative regardless. =====
  const stabilizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const utteranceWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  // True from when WE trigger a response until it completes — so a stabilize timer
  // can't fire a second, overlapping response.create.
  const responseActiveRef = useRef(false);
  // Bumped on every barge-in (activityStart). Tool calls capture it at start and
  // drop their result if it changed — so a tool that was mid-flight when the user
  // interrupted can never feed a stale response into the cancelled turn (which
  // would make the agent answer the PREVIOUS request).
  const turnEpochRef = useRef(0);
  const sessionStartRef = useRef(0);
  const sessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Idle-timeout: closes the session after IDLE_TIMEOUT_MS with no user speech
  // (reset on every utterance / agent reply) — the activity-based forgotten-mic guard.
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Cross-tab coordination: only ONE tab may run voice at a time (single mic,
  // single conversation). A BroadcastChannel + per-tab id enforce "last tab wins".
  const voiceChannelRef = useRef<BroadcastChannel | null>(null);
  const tabIdRef = useRef<string>("");
  // Reconnect-storm guard: the retry budget is only reset once a connection has
  // proven STABLE for a few seconds (see onOpen). Mobile networks flap (Wi-Fi↔LTE
  // handoff), and resetting the budget on every onOpen let a flapping connection
  // reconnect forever. This timer holds the "proven stable" gate.
  const stableTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // MOBILE PRIMING (provider-owned audio only): a playback <audio> element and a
  // mic stream, both created/acquired INSIDE the tap gesture so iOS Safari lets
  // them run (it blocks post-gesture audio playback + getUserMedia). Reused across
  // reconnects. Unused on desktop's happy path but harmless there.
  const providerAudioElRef = useRef<HTMLAudioElement | null>(null);
  const primedMicRef = useRef<Promise<MediaStream> | null>(null);
  // A ref mirror of `status` so window/document event listeners (which capture a
  // stale closure) can read the live value without re-subscribing every render.
  const statusRef = useRef<VoiceStatus>("idle");
  // Screen Wake Lock sentinel held while a hands-free conversation is live, so the
  // phone doesn't dim/lock mid-turn. Typed structurally (not the lib.dom
  // WakeLockSentinel) so it compiles regardless of the TS DOM-lib version.
  const wakeLockRef = useRef<WakeLockLike | null>(null);
  // Ephemeral token, pre-warmed on page load so the mic click never pays for a
  // token mint. Refreshed lazily if it ages past the fresh window.
  const tokenRef = useRef<{
    token: string;
    model: string;
    ts: number;
    expiresAt?: number;
  } | null>(null);
  const tokenInflightRef = useRef<Promise<{
    token: string;
    model: string;
    ts: number;
    expiresAt?: number;
  }> | null>(null);

  // Returns a fresh token, minting a new one only if we don't have one or it has
  // aged out. Single-flighted so concurrent callers share one mint.
  const getToken = useCallback(async () => {
    const cur = tokenRef.current;
    const now = Date.now();
    if (cur) {
      // Honor the token's REAL expiry (minus a 60s safety buffer) when the server
      // reports it — the OpenAI ephemeral token TTL (≈10 min) is far shorter than
      // the configured reuse window, so we re-mint before it dies. Fall back to the
      // configured reuse window only when no expiry was returned.
      const fresh =
        cur.expiresAt != null
          ? now < cur.expiresAt - 60_000
          : now - cur.ts < VOICE_CFG.session.tokenFreshMs;
      if (fresh) return cur;
    }
    if (!tokenInflightRef.current) {
      tokenInflightRef.current = (async () => {
        // ACCESS CODE for a gated/shared demo URL (see voiceAccessCode): sent as a
        // header so the SERVER gate (voice-token route) authorizes the mint. Absent
        // and harmless on normal deployments; never embedded in the bundle.
        const accessCode = voiceAccessCode();
        const res = await fetch("/api/voice-token", {
          // 15s (was 8s): the first mint also runs persona generation, and on
          // slower mobile/cellular networks 8s routinely aborted a mint that would
          // have succeeded. Desktop is unaffected (it resolves in well under 8s).
          signal: timeoutSignal(15000),
          headers: accessCode
            ? { "x-voice-access-code": accessCode }
            : undefined,
        });
        const data = await res.json();
        if (!data?.token)
          throw new Error(data?.error || "Could not get a voice token");
        const rec = {
          token: data.token as string,
          model: data.model as string,
          ts: Date.now(),
          expiresAt:
            typeof data.expiresAt === "number" ? data.expiresAt : undefined,
        };
        tokenRef.current = rec;
        return rec;
      })().finally(() => {
        tokenInflightRef.current = null;
      });
    }
    return tokenInflightRef.current;
  }, []);

  // Pre-warm the token (and, server-side, the auto-generated persona) on FIRST
  // INTENT — a hover/focus/pointerdown on the mic — NOT on page load. Minting on
  // mount meant every idle page view, bot, and crawler minted an ephemeral
  // credential and ran persona generation (the single biggest ambient-cost leak);
  // deferring it to intent cuts that to near-zero while real users still get an
  // instant connect (getToken is single-flighted + cached, so prewarm→start share
  // one mint). No-op unless idle.
  const prewarm = useCallback(() => {
    if (statusRef.current !== "idle") return;
    getToken().catch(() => {});
  }, [getToken]);

  // Keep the status ref in sync for event-listener closures (lifecycle handlers).
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // PDP AWARENESS: whenever a session is active and the shopper is on a product
  // page (reached by voice OR by their own clicking), prefetch that product's
  // FULL detail so the agent can answer anything about it instantly. Cleared when
  // they leave the PDP so "this product" never means a stale page.
  useEffect(() => {
    if (status === "idle") return;
    const handle = pathname?.match(/\/products\/([^/?#]+)/)?.[1];
    if (!handle) {
      memory.currentProductDetailRef.current = null;
      return;
    }
    const selectedVariant = searchParams?.get("variant") || null;
    // Reconcile the shopper's ON-SCREEN variant choice into currentProductRef so
    // "add this" / "what's the price of the one I picked?" use the RIGHT variant (its
    // price + stock), not the product default. Reads the variant from the detail we
    // already have — no extra fetch.
    const applySelectedVariant = (d: any) => {
      const cp = memory.currentProductRef.current;
      if (!cp || cp.handle !== handle) return;
      const v =
        selectedVariant && Array.isArray(d?.variants)
          ? d.variants.find(
              (x: any) => String(x.variant_id) === String(selectedVariant)
            )
          : null;
      if (v)
        memory.currentProductRef.current = {
          ...cp,
          variantId: String(v.variant_id),
          price: typeof v.price === "number" ? v.price : cp.price,
          available:
            typeof v.available === "boolean" ? v.available : cp.available,
        };
    };
    // Same product already loaded → just reconcile the (possibly changed) variant.
    if (memory.currentProductDetailRef.current?.handle === handle) {
      applySelectedVariant(memory.currentProductDetailRef.current);
      return;
    }
    let cancelled = false;
    fetchJson(`/api/voice-product?handle=${encodeURIComponent(handle)}`)
      .then((d: any) => {
        if (cancelled || !d || d.error) return;
        memory.currentProductDetailRef.current = d;
        // Seed currentProductRef so cart "add this" works on a manually-opened PDP.
        memory.currentProductRef.current = {
          id: d.product_id,
          handle: d.handle,
          title: d.title,
          price: d.price,
          compareAtPrice: d.compare_at_price ?? undefined,
          available: d.available,
          imageUrl: d.image_url || "",
          rating: 0,
          reviewCount: 0,
          variantId: d.variant_id || `${d.product_id}-variant`,
        } as TransformedProduct;
        applySelectedVariant(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname, searchParams, status, memory]);

  // NAVIGATION AWARENESS: push the current page / navigation context to the model
  // as a PASSIVE system item (never makes the agent speak) so it always knows
  // WHERE the shopper is before choosing a tool — e.g. it recognizes a product
  // page is already open instead of searching again. Merchant-agnostic: it uses
  // the real pathname + the current product's own title, no hardcoded categories.
  // No-op for providers without sendContext.
  const sendPageContext = useCallback(() => {
    const session = sessionRef.current;
    if (!session?.sendContext) return;
    const productHandle = pathname?.match(/\/products\/([^/?#]+)/)?.[1];
    let ctx: string;
    if (productHandle) {
      const p = memory.currentProductRef.current;
      const d = memory.currentProductDetailRef.current as any;
      const name = p?.title ? `"${p.title}"` : `(handle: ${productHandle})`;
      // Surface the shopper's SELECTED variant (from the on-screen swatch) so the agent
      // answers about the option they actually picked, not the default.
      let variantNote = "";
      if (p?.variantId && Array.isArray(d?.variants)) {
        const v = d.variants.find(
          (x: any) => String(x.variant_id) === String(p.variantId)
        );
        if (v?.title && !/^default/i.test(String(v.title))) {
          const priceNote =
            p.price > 0
              ? ` (${formatMoney(p.price, VOICE_CFG.currency.symbol)})`
              : "";
          variantNote = ` The "${v.title}" option is currently selected${priceNote}.`;
        }
      }
      ctx = `CURRENT PAGE: the shopper is on the product detail page for ${name} right now.${variantNote} If they ask to open or see THIS product, tell them it's already open — do not search or navigate again.`;
      // Detect the search-results page via the CONFIGURED path (merchants differ:
      // Shopify `/search`, bblunt `/pages/searchtap-search`, …) — never a hardcoded
      // "/search", which silently fails to match a custom path.
    } else if (
      VOICE_CFG.searchPath &&
      pathname?.startsWith(VOICE_CFG.searchPath)
    ) {
      const q =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("q")
          : null;
      ctx = q
        ? `CURRENT PAGE: search results for "${q}".`
        : "CURRENT PAGE: the search results page.";
    } else if (pathname?.startsWith("/collections/")) {
      // Use the REAL collection title (from the loaded list) instead of the raw slug.
      const h = pathname.split("/collections/")[1]?.split(/[/?#]/)[0] || "";
      const title = memory.collectionsRef.current.find(
        (c) => c.handle === h
      )?.title;
      const name = title
        ? `the "${title}" collection`
        : `a collection page (${h})`;
      // If this collection's products are loaded (seeded below or by the tool), LIST
      // the visible ones so the agent resolves "open the second one" / "add the Argan
      // shampoo" against what's on screen — no re-search, no hop to /search. The listed
      // order matches the on-screen grid (and open_result's index).
      const sym = VOICE_CFG.currency.symbol;
      const loaded =
        memory.searchHistoryRef.current.find(
          (c) => c.query === `collection:${h}`
        )?.products ?? [];
      // If the shopper applied on-page filters/sorting/pagination, the visible order
      // no longer matches the loaded set — DON'T present positions (they'd be wrong);
      // steer the agent to resolve by name instead. Detected generically (no facet-key
      // parsing), so it's merchant-agnostic and ignores ad/tracking params.
      const modifiedView = isModifiedListingView(
        pathname,
        searchParams?.toString() ?? "",
        VOICE_CFG.searchPath
      );
      if (modifiedView) {
        ctx = `CURRENT PAGE: ${name}. The shopper has applied on-page filters, sorting, or pagination, so the products now visible (and their order) DIFFER from any list you loaded — do NOT use position numbers ("the second one") here. Resolve a product they name by its NAME; if you're unsure what's on screen, call read_page. To reset to a known order, re-open the collection.`;
      } else if (loaded.length) {
        const lines = loaded
          .slice(0, 8)
          .map(
            (p, i) =>
              `${i + 1}. ${p.title}${p.price > 0 ? ` (${formatMoney(p.price, sym)})` : ""}`
          )
          .join("; ");
        ctx = `CURRENT PAGE: ${name}. Products visible on screen — act on these DIRECTLY (open_result by position, add_to_cart by product_id); do NOT search again for one that's in this list: ${lines}.`;
      } else {
        ctx = `CURRENT PAGE: ${name}.`;
      }
    } else if (pathname && pathname !== "/") {
      ctx = `CURRENT PAGE: ${pathname}.`;
    } else {
      ctx = "CURRENT PAGE: the store home page.";
    }
    session.sendContext(ctx);
  }, [pathname, searchParams, memory]);

  // Fire on connect (status → live) and on every navigation while live, so the
  // model's page awareness stays current throughout the conversation.
  useEffect(() => {
    if (status !== "live") return;
    const warmAndContext = () => {
      // Warm the cart store so the FIRST voice cart command (add / change qty) finds
      // a hydrated cart instead of an empty snapshot — fixes "works only on retry".
      try {
        void (useCartStore.getState() as any).initializeCart?.();
      } catch {
        /* best-effort — non-fatal */
      }
      sendPageContext();
    };
    // STARTUP SMOOTHNESS: during the opening-greeting grace window (set in onOpen) the
    // greeting's first audio is spinning up. Cart hydration + context injection aren't
    // needed for the greeting (only for the first USER turn, which follows it), so
    // running them synchronously here contends with audio startup and causes the ~1s
    // greeting stutter — DEFER them to the end of the grace window. Outside the window
    // (mid-session navigation), update immediately.
    const graceLeft = startupGraceUntilRef.current - Date.now();
    if (graceLeft > 0) {
      const t = setTimeout(() => {
        if (statusRef.current === "live") warmAndContext();
      }, graceLeft);
      return () => clearTimeout(t);
    }
    warmAndContext();
  }, [status, pathname, sendPageContext]);

  // COLLECTION AWARENESS: whenever a session is active and the shopper is on a
  // collection page (reached by voice OR their own click), load that collection's
  // products into the working set — the analog of the PDP seed above. This is what
  // lets the agent act on the products already ON SCREEN (open / add / compare)
  // instead of running a fresh search and hopping to /search. Once loaded, it
  // re-sends the page context so those products are listed for reference. Deduped
  // via searchHistoryRef (keyed "collection:<handle>"), so revisiting is free.
  useEffect(() => {
    if (status !== "live") return;
    if (!pathname?.startsWith("/collections/")) return;
    // A nested product URL (/collections/x/products/y) IS a product page — the PDP
    // seed above owns it. Skip here so we don't do a wasted collection fetch or
    // mislabel the page as a collection.
    if (pathname.includes("/products/")) return;
    const handle = pathname.split("/collections/")[1]?.split(/[/?#]/)[0] || "";
    if (!handle) return;
    const key = `collection:${handle}`;
    // Already loaded → the products (and enriched context) are in place.
    if (memory.searchHistoryRef.current.some((h) => h.query === key)) return;
    let cancelled = false;
    // Hold the fetch until the greeting's startup-grace window ends, so this network
    // call + the follow-up context injection don't contend with the greeting's first
    // audio. Outside the window (mid-session), graceLeft ≤ 0 → runs immediately.
    const graceLeft = Math.max(0, startupGraceUntilRef.current - Date.now());
    const startTimer = setTimeout(() => {
      if (cancelled) return;
      fetchJson(`/api/voice-collection?handle=${encodeURIComponent(handle)}`)
        .then((d: any) => {
          if (cancelled) return;
          const products = Array.isArray(d?.products) ? d.products : [];
          if (!products.length) return;
          const hist = memory.searchHistoryRef.current.filter(
            (h) => h.query !== key
          );
          hist.push({ query: key, products });
          memory.searchHistoryRef.current = hist.slice(-3);
          memory.searchResultsRef.current = products;
          memory.lastResultsRef.current = products;
          // Re-emit page context now that we can list the on-screen products.
          sendPageContext();
        })
        .catch(() => {});
    }, graceLeft);
    return () => {
      cancelled = true;
      clearTimeout(startTimer);
    };
  }, [status, pathname, memory, sendPageContext]);

  // AMBIENT CART AWARENESS: push a one-line cart summary (units + subtotal) so the agent
  // knows the cart WITHOUT spending a get_cart round-trip, and stays correct if the
  // shopper edits the drawer mid-conversation. Passive context; never makes it speak.
  const sendCartContext = useCallback(() => {
    const session = sessionRef.current;
    if (!session?.sendContext) return;
    try {
      const items = ((useCartStore.getState() as any).items ?? []) as any[];
      const units = items.reduce((n, i) => n + (Number(i.quantity) || 0), 0);
      if (!units) {
        session.sendContext("CART: empty.");
        return;
      }
      const subtotal = Math.round(
        items.reduce((t, i) => {
          const p =
            typeof i.price === "number"
              ? i.price / 100
              : i.price?.amount != null
                ? i.price.amount / 100
                : 0;
          return t + p * (Number(i.quantity) || 1);
        }, 0)
      );
      session.sendContext(
        `CART: ${units} item${units > 1 ? "s" : ""} across ${items.length} product${items.length > 1 ? "s" : ""}, subtotal ${formatMoney(subtotal, VOICE_CFG.currency.symbol)}.`
      );
    } catch {
      /* best-effort */
    }
  }, []);

  // Fire cart context on connect + whenever the cart store changes (debounced), so the
  // agent's cart awareness never goes stale — including edits made in the drawer.
  useEffect(() => {
    if (status !== "live") return;
    sendCartContext();
    let t: ReturnType<typeof setTimeout> | null = null;
    let unsub: (() => void) | undefined;
    try {
      unsub = (useCartStore as any).subscribe?.(() => {
        if (t) clearTimeout(t);
        t = setTimeout(() => sendCartContext(), 500);
      });
    } catch {
      /* store without subscribe → connect-time snapshot only */
    }
    return () => {
      if (t) clearTimeout(t);
      try {
        unsub?.();
      } catch {
        /* ignore */
      }
    };
  }, [status, sendCartContext]);

  // ===== BROWSER/PLATFORM ACTION PORTS =====
  // The two DOM touchpoints the tools need, kept OUT of the tool layer so
  // runTool stays browser-independent (see ToolContext). The DOM lives here.
  const scrollPage = useCallback((to: string) => {
    try {
      const page = window.innerHeight * 0.9;
      if (to.includes("top")) window.scrollTo({ top: 0, behavior: "smooth" });
      else if (to.includes("bottom"))
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      else if (to.includes("up"))
        window.scrollBy({ top: -page, behavior: "smooth" });
      else if (to.includes("review")) {
        const el =
          document.querySelector('[id*="review" i],[class*="review" i]') ||
          Array.from(document.querySelectorAll("h1,h2,h3,h4")).find((e) =>
            /review|rating/i.test(e.textContent || "")
          );
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.scrollBy({ top: page, behavior: "smooth" });
      } else window.scrollBy({ top: page, behavior: "smooth" });
    } catch {
      /* scrolling is best-effort */
    }
  }, []);

  // Cart UI actuation (open/close/coupons/checkout) is delegated to a SideCartAdapter
  // resolved ONCE from the platform cart-mode flag (NEXT_PUBLIC_KWIKCART_DISABLE) —
  // the same signal ClientDynamics uses to pick the GoKwik side-cart vs the custom
  // drawer, so voice and the visible cart never disagree. Cart DATA ops
  // (add/remove/update) still go through @shopkit/cart in runTool. The ports below
  // are thin, stable wrappers so the ToolContext wiring is unchanged.
  const cartAdapter = useMemo(() => resolveSideCartAdapter(), []);

  const openNativeCheckout = useCallback(
    (payload: CheckoutPayload) => cartAdapter.openCheckout(payload),
    [cartAdapter]
  );

  // OPEN THE CART DRAWER via the active adapter (GoKwik side-cart global, or the
  // @shopkit drawer store for the custom cart). DOM/global specifics live in the
  // adapter so the tool layer stays browser-independent.
  const openCart = useCallback(() => cartAdapter.openCart(), [cartAdapter]);

  // CLOSE THE CART DRAWER via the active adapter (symmetric to openCart).
  const closeCart = useCallback(() => cartAdapter.closeCart(), [cartAdapter]);

  // CLOSE THE NATIVE CHECKOUT OVERLAY (the GoKwik SDK overlay) via the active adapter.
  // Distinct from closeCart: the checkout is a separate overlay, not the cart drawer.
  // navRouter uses this so a voice-initiated navigation never leaves checkout lingering.
  const closeCheckout = useCallback(
    () => cartAdapter.closeCheckout(),
    [cartAdapter]
  );

  // SHOW COUPONS visually via the active adapter (opens the cart + reveals offers).
  const openCoupons = useCallback(
    () => cartAdapter.openCoupons(),
    [cartAdapter]
  );

  // Re-render the cart after a programmatic change (via the active adapter).
  const refreshCart = useCallback(
    () => cartAdapter.refreshCart(),
    [cartAdapter]
  );

  // APPLY / REMOVE a coupon by driving the cart's OWN controls (via the active
  // adapter). GoKwik actuates its shadow-DOM Offers panel; the custom drawer
  // resolves false so runTool falls back to the backend apply. Merchant-agnostic:
  // the adapter matches by visible code text, no hardcoded coupon.
  const applyCouponInUI = useCallback(
    (code: string) => cartAdapter.applyCouponInUI(code),
    [cartAdapter]
  );

  const removeCouponInUI = useCallback(
    (code?: string) => cartAdapter.removeCouponInUI(code),
    [cartAdapter]
  );

  // The router the voice tools navigate through: it CLOSES the cart drawer first
  // so the destination page is never left hidden behind an open overlay (UI-state
  // hygiene). Direct user clicks/links are unaffected — this only wraps voice nav.
  // RESILIENT NAV: the voice session is a media connection that lives in the root
  // layout, independent of the page being rendered — so client navigation (even to a
  // page that errors on render) never drops the mic; the destination's error is
  // caught by the page-level error boundary BELOW this widget. These wrappers add the
  // last guard: closeCart / router.push are best-effort, so a throw here can never
  // propagate into the tool handler (and thus never bubble up to tear down the tree).
  const navRouter = useMemo(() => {
    // Before ANY voice-initiated navigation, tear down the transient overlays so the
    // destination page is never left hidden behind them. This covers BOTH the cart
    // drawer AND the GoKwik checkout overlay: the checkout is a SEPARATE GoKwik SDK
    // overlay (not the drawer), so closeCart alone used to leave it open when the
    // shopper chose to keep browsing from checkout ("add anything else?" → "yes").
    // Doing it HERE — the single seam every voice navigation flows through
    // (search / navigate_to_product / navigate_to_collection / open_result /
    // get_policy / get_order_history / select_variant / go_back) — fixes it for ALL
    // nav scenarios, not just that one conversation. Each teardown is independent and
    // best-effort so one failure can neither block navigation nor bubble up and tear
    // down the session.
    const clearOverlays = () => {
      try {
        closeCart();
      } catch {
        /* best-effort */
      }
      try {
        closeCheckout();
      } catch {
        /* best-effort */
      }
    };
    return {
      push: (url: string) => {
        clearOverlays();
        try {
          router.push(url);
        } catch {
          /* navigation is best-effort — a bad route must not kill the session */
        }
      },
      back: () => {
        clearOverlays();
        try {
          router.back();
        } catch {
          /* best-effort */
        }
      },
    };
  }, [router, closeCart, closeCheckout]);

  // PAGE PERCEPTION: read the visible content of the shopper's current screen so
  // the agent can answer on-screen questions (delivery/COD badges, offer counts,
  // options, availability, anything rendered) on ANY merchant — no hardcoded facts.
  // Captures rendered text PLUS image alt / aria-label / title (badges are often
  // images/icons whose text lives there, not in innerText). Capped for latency/cost.
  const readPage = useCallback((): string => {
    try {
      // Debounce: repeated read_page within a short window returns the last capture
      // (a "read the page again" loop can't re-inject up to 4 KB of context each turn).
      const now = Date.now();
      if (readPageCacheRef.current.c && now - readPageCacheRef.current.t < 2500)
        return readPageCacheRef.current.c;
      const root = (document.querySelector("main") ||
        document.body) as HTMLElement;
      const parts: string[] = [root.innerText || ""];
      // Include SVG <text>/<title> and image labels: badges like "COD available"
      // or "Delivery in 2-5 days" are often rendered as SVG text or image alt,
      // which innerText SKIPS — this is what makes them readable.
      root
        .querySelectorAll(
          "img[alt],[aria-label],[title],svg title,svg text,svg tspan"
        )
        .forEach((el) => {
          const label =
            el.getAttribute?.("alt") ||
            el.getAttribute?.("aria-label") ||
            el.getAttribute?.("title") ||
            el.textContent ||
            "";
          if (label && label.trim()) parts.push(label.trim());
        });
      const out = parts
        .join("\n")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{2,}/g, "\n")
        .trim()
        .slice(0, 4000); // enough for the key on-page facts; keeps context tight
      readPageCacheRef.current = { t: now, c: out };
      return out;
    } catch {
      return "";
    }
  }, []);

  // ===== TOOL EXECUTION =====
  // The tool BUSINESS LOGIC lives in ../tools/runTool (provider-, UI-, merchant-,
  // and DOM-agnostic + unit-testable). We only inject a ToolContext built from
  // the session's memory refs / router / cart / platform ports.
  const runTool = useMemo(() => {
    const ctx: ToolContext = {
      cart: () => useCartStore.getState() as unknown as CartState,
      router: navRouter,
      setCaption,
      track: voiceTrack,
      config: VOICE_CFG,
      scrollPage,
      openNativeCheckout,
      openCart,
      closeCart,
      openCoupons,
      refreshCart,
      applyCouponInUI,
      removeCouponInUI,
      readPage,
      auth: customerAuth,
      lastResultsRef: memory.lastResultsRef,
      searchResultsRef: memory.searchResultsRef,
      currentProductRef: memory.currentProductRef,
      currentProductDetailRef: memory.currentProductDetailRef,
      collectionsRef: memory.collectionsRef,
      ratingsCacheRef: memory.ratingsCacheRef,
      searchHistoryRef: memory.searchHistoryRef,
      lastMutationRef: memory.lastMutationRef,
      toolCallsRef,
      guardStateRef,
      batchSeqRef,
    };
    return createRunTool(ctx);
  }, [
    navRouter,
    memory,
    scrollPage,
    openNativeCheckout,
    openCart,
    closeCart,
    openCoupons,
    refreshCart,
    applyCouponInUI,
    removeCouponInUI,
    readPage,
  ]);

  // Emit session_ended once (duration + engagement) and clear the auto-close
  // timer. Guarded by sessionStartRef so it fires at most once per session.
  const trackSessionEnd = useCallback((reason: string) => {
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (sessionStartRef.current) {
      voiceTrack("session_ended", {
        reason,
        duration_ms: Date.now() - sessionStartRef.current,
        turns: turnsRef.current,
        tool_calls: toolCallsRef.current,
      });
      sessionStartRef.current = 0;
    }
  }, []);

  // SCREEN WAKE LOCK — held while a conversation is live so the phone doesn't dim/
  // lock mid-turn (which suspends the session). Feature-detected and fully
  // best-effort: a rejection (battery saver, low battery, tab not visible) is
  // non-fatal. The OS auto-releases the lock when the tab is hidden, so we
  // re-acquire on return (see the lifecycle effect). Standard MDN pattern.
  const requestWakeLock = useCallback(async () => {
    try {
      const nav = navigator as Navigator & {
        wakeLock?: { request: (type: "screen") => Promise<WakeLockLike> };
      };
      if (!nav.wakeLock || wakeLockRef.current) return;
      const sentinel = await nav.wakeLock.request("screen");
      wakeLockRef.current = sentinel;
      // If the OS releases it (hidden/battery), drop our ref so we can re-acquire.
      sentinel.addEventListener?.("release", () => {
        if (wakeLockRef.current === sentinel) wakeLockRef.current = null;
      });
    } catch {
      /* power save / battery / not visible — non-fatal, voice still works */
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    const sentinel = wakeLockRef.current;
    wakeLockRef.current = null;
    try {
      await sentinel?.release();
    } catch {
      /* already released */
    }
  }, []);

  // Shared teardown for BOTH a user stop and a background suspend: invalidate the
  // generation, cancel every timer, release the mic + WebRTC session, and reset the
  // transient UI state. It deliberately does NOT touch conversation memory (that is
  // reset ONLY on a fresh start), so a suspend()→resume() continues the SAME
  // conversation. `reason` feeds session-end analytics.
  const teardownSession = useCallback(
    (reason: string) => {
      userClosedRef.current = true; // no auto-reconnect; a resume/start is deliberate
      startGenRef.current++; // invalidate any in-flight connect/reconnect + stale cbs
      void releaseWakeLock();
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (stableTimerRef.current) {
        clearTimeout(stableTimerRef.current);
        stableTimerRef.current = null;
      }
      // Turn-coalescing timers (multi-speaker) — clear so none fires after teardown.
      if (stabilizeTimerRef.current) {
        clearTimeout(stabilizeTimerRef.current);
        stabilizeTimerRef.current = null;
      }
      if (utteranceWatchdogRef.current) {
        clearTimeout(utteranceWatchdogRef.current);
        utteranceWatchdogRef.current = null;
      }
      responseActiveRef.current = false;
      reconnectsRef.current = 0;
      // Drop any mic acquisition primed for a connect that isn't happening, so the
      // OS mic indicator can't linger on.
      primedMicRef.current
        ?.then((s) => s.getTracks().forEach((t) => t.stop()))
        .catch(() => {});
      primedMicRef.current = null;
      trackSessionEnd(reason);
      try {
        sessionRef.current?.close(); // stops the mic track + tears down the WebRTC pc
      } catch {
        /* best-effort — non-fatal */
      }
      sessionRef.current = null;
      setStatus("idle");
      setCaption("");
      setActivity("listening");
      setError(false);
      setMuted(false);
      mutedRef.current = false;
    },
    [trackSessionEnd, releaseWakeLock]
  );

  // User-initiated end → a clean idle (NOT resumable): clear the paused flag so the
  // widget returns to the launcher. Next start() begins a fresh conversation.
  const stop = useCallback(async () => {
    setPaused(false);
    teardownSession("user");
  }, [teardownSession]);

  // SUSPEND — the tab was backgrounded (screen lock / incoming call / app switch /
  // tab change). We NEVER hold the mic in the background (privacy, and iOS suspends
  // it anyway), so the teardown is identical to stop() — but we PRESERVE the
  // conversation memory and flag `paused`, so the widget shows a one-tap Resume that
  // continues where the shopper left off instead of losing the conversation.
  const suspend = useCallback(() => {
    if (statusRef.current === "idle") return; // nothing live to suspend
    teardownSession("backgrounded");
    setPaused(true);
  }, [teardownSession]);

  // Mic mute toggle — flips the outgoing track via the provider (no teardown) and
  // mirrors the choice into a ref so a reconnect re-applies it. No-op-safe when
  // there's no live session (the state still tracks intent for the next connect).
  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      mutedRef.current = next;
      sessionRef.current?.setMicMuted?.(next);
      return next;
    });
  }, []);

  // Acquire the wake lock while live, release it otherwise. Runs on every status
  // transition so a session that ends any way (user stop, cost cap, close) frees it.
  useEffect(() => {
    if (status === "live") void requestWakeLock();
    else void releaseWakeLock();
  }, [status, requestWakeLock, releaseWakeLock]);

  // Clear both turn-coalescing timers (stabilize + watchdog). Called on every
  // barge-in, session open, and stop so no stale timer can fire a response.
  const clearTurnTimers = useCallback(() => {
    if (stabilizeTimerRef.current) {
      clearTimeout(stabilizeTimerRef.current);
      stabilizeTimerRef.current = null;
    }
    if (utteranceWatchdogRef.current) {
      clearTimeout(utteranceWatchdogRef.current);
      utteranceWatchdogRef.current = null;
    }
  }, []);

  // (Re)arm the idle timeout: close the session after IDLE_TIMEOUT_MS with no user
  // speech. Called on connect and reset on every utterance / agent reply, so an
  // active conversation is never cut off — only a walked-away / forgotten mic is.
  const bumpIdle = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      voiceTrack("session_capped", { reason: "idle" });
      stop();
    }, IDLE_TIMEOUT_MS);
  }, [stop]);

  // Build the provider callbacks for ONE connect generation. Every callback
  // no-ops when its generation is stale, so a closed/superseded session can never
  // touch the current one's UI, audio, or reconnect state.
  const buildCallbacks = useCallback(
    (
      gen: number,
      stale: () => boolean,
      liveModel: string
    ): VoiceSessionCallbacks => {
      // Fire ONE coalesced response once the room has settled (turn coalescing).
      // Guarded so it never overlaps an active response and no-ops if stale/closed.
      const fireCoalesced = () => {
        clearTurnTimers();
        if (stale() || responseActiveRef.current) return;
        const s = sessionRef.current;
        if (!s?.requestResponse) return;
        responseActiveRef.current = true;
        console.log(
          "🎙️ [voice] turn stabilized → responding to latest request"
        );
        s.requestResponse();
      };

      return {
        onOpen: () => {
          if (stale()) return;
          const wasReconnect = reconnectsRef.current > 0;
          // Reset the retry budget ONLY after the connection proves stable for a few
          // seconds — NOT immediately. On a flapping mobile network the socket opens
          // then drops repeatedly; resetting on every open let MAX_RECONNECTS never
          // trip → an infinite reconnect storm (each cycle also re-wrote the cart and
          // hammered the side-cart). If it drops before this fires, onClose clears the
          // timer and the attempt count survives, so backoff + the ceiling apply.
          if (stableTimerRef.current) clearTimeout(stableTimerRef.current);
          stableTimerRef.current = setTimeout(() => {
            reconnectsRef.current = 0;
            stableTimerRef.current = null;
          }, 5000);
          setStatus("live");
          setError(false); // a successful open clears any prior terminal error
          setActivity("listening");
          newVoiceSession();
          sessionStartRef.current = Date.now();
          turnsRef.current = 0;
          toolCallsRef.current = 0;
          guardStateRef.current = newGuardState(); // fresh budget/rate/confirm state
          readPageCacheRef.current = { t: 0, c: "" };
          batchSeqRef.current = 0;
          clearTurnTimers();
          responseActiveRef.current = false;
          voiceTrack(wasReconnect ? "reconnected" : "session_started", {
            model: liveModel,
            path: pathname,
          });
          // The bar derives its own "Listening…" label from status/activity, so we
          // keep the caption EMPTY here; it now carries only progress/error text.
          setCaption("");
          // PROACTIVE GREETING: on a genuinely-fresh session (armed in connect(), and
          // only when enabled) the agent speaks first so the shopper knows it's ready.
          // Consume the latch BEFORE sending so a duplicate onOpen (rapid re-open /
          // race) can never double-greet; reconnect & resume never arm it, so they
          // never replay. One-shot instruction rendered in the store persona — the
          // session VAD drives every turn after this one.
          if (greetPendingRef.current) {
            greetPendingRef.current = false;
            // Open a startup-grace window so the (non-essential) startup side-effects
            // defer past the greeting's first audio — prevents the ~1s greeting stutter.
            startupGraceUntilRef.current = Date.now() + STARTUP_DEFER_MS;
            sessionRef.current?.requestResponse?.({
              instructions: VOICE_CFG.greeting.instruction,
            });
          }
          // Cost guards: an IDLE timeout (the real forgotten-mic guard — resets on
          // activity, so it never cuts off an active chat) PLUS a generous hard
          // CEILING so even a stuck / echo-looping session can't run forever.
          bumpIdle();
          if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
          sessionTimerRef.current = setTimeout(() => {
            voiceTrack("session_capped", { reason: "max_duration" });
            stop();
          }, MAX_SESSION_MS);
        },
        onInterrupted: () => {
          if (stale()) return;
          // Barge-in is server-authoritative on WebRTC: the server already stopped
          // its audio track and cancelled the turn. We only bump the turn epoch (so
          // in-flight tool results for the abandoned turn are dropped) and show the
          // listening cue — there is no host playback buffer to flush.
          console.log("🎙️ [voice] server interrupt (barge-in)");
          turnEpochRef.current++;
          // New utterance → clear any lingering progress/result caption so it
          // can't bleed into this turn's "thinking" label (the bar shows
          // "Listening…" for the listening state on its own).
          setCaption("");
          bumpIdle(); // user is speaking → reset the idle timeout
          if (TURN.coalesce) {
            // A (new) speaker started. Interruptions are still ongoing, so CANCEL any
            // pending stabilize window, and (re)arm the watchdog. The server already
            // cancelled its reply (interrupt_response), so nothing is responding now.
            responseActiveRef.current = false;
            clearTurnTimers();
            utteranceWatchdogRef.current = setTimeout(() => {
              console.log("🎙️ [voice] utterance watchdog → forcing a response");
              fireCoalesced();
            }, TURN.maxUtteranceMs);
          }
        },
        onSpeechStopped: () => {
          if (stale() || !TURN.coalesce) return;
          // The current speaker paused. Clear the watchdog and (re)start the
          // stabilization window; if someone else starts before it elapses,
          // onInterrupted cancels it, so the response only fires after a stable
          // silence following the LAST speaker.
          if (utteranceWatchdogRef.current) {
            clearTimeout(utteranceWatchdogRef.current);
            utteranceWatchdogRef.current = null;
          }
          if (stabilizeTimerRef.current)
            clearTimeout(stabilizeTimerRef.current);
          stabilizeTimerRef.current = setTimeout(
            fireCoalesced,
            TURN.stabilizeMs
          );
        },
        onTurnComplete: () => {
          if (stale()) return;
          responseActiveRef.current = false; // this response finished
          bumpIdle(); // agent replied → shopper's turn; reset the idle timeout
          turnsRef.current++;
          if (turnsRef.current >= MAX_TURNS) {
            voiceTrack("session_capped", { reason: "max_turns" });
            stop();
          }
        },
        onToolCall: async (calls) => {
          if (stale()) return;
          batchSeqRef.current++; // new tool-call batch (see confirmation guard)
          // Immediate progress cue — a concise per-action label ("Searching
          // products…", "Adding to cart…") shown with the spinner right when the
          // batch starts, so the shopper never wonders if it's stuck. A tool may
          // overwrite it with a result caption when it finishes.
          setCaption(toolProgressLabel(calls));
          // Snapshot the turn epoch: if the user barges in while these tools run,
          // the epoch changes and we DROP the results (a stale response for a
          // cancelled turn would make the agent answer the previous request).
          const epoch = turnEpochRef.current;
          // If the whole batch is pure reads, run them concurrently (the model
          // often asks for reviews/offers/compare together). A mixed batch stays
          // sequential so cart-write / navigation order is deterministic.
          const allReads = calls.every((c) =>
            READ_ONLY_TOOLS.has(c.name as ToolName)
          );
          let responses: { id?: string; name: string; response: any }[];
          if (allReads) {
            responses = await Promise.all(
              calls.map(async (fc) => ({
                id: fc.id,
                name: fc.name,
                response: await runTool(fc.name, fc.args ?? {}),
              }))
            );
          } else {
            responses = [];
            for (const fc of calls) {
              const result = await runTool(fc.name, fc.args ?? {});
              responses.push({ id: fc.id, name: fc.name, response: result });
            }
          }
          if (stale()) return;
          if (turnEpochRef.current !== epoch) {
            // Barge-in happened while these tools ran. We MUST still close each
            // function call (OpenAI leaves it DANGLING otherwise → corrupts the next
            // turn and produces vague/off-topic answers), but with a cancelled marker
            // (no stale data) and WITHOUT triggering a response — the new user turn's
            // reply is driven by the server VAD.
            console.log(
              "🎙️ [voice] interrupted during tool execution → closing stale call(s) without responding"
            );
            const cancelled = responses.map((r) => ({
              id: r.id,
              name: r.name,
              response: { cancelled: true },
            }));
            sessionRef.current?.sendToolResults(cancelled, {
              skipResponseCreate: true,
            });
            responseActiveRef.current = false; // interrupted → no response coming
            return;
          }
          sessionRef.current?.sendToolResults(responses);
          responseActiveRef.current = true; // tool results trigger a fresh response
        },
        onActivity: (a) => {
          if (stale()) return;
          setActivity(a);
        },
        onError: (e) => {
          if (stale()) return;
          console.error("🔴 Voice ERROR:", e);
          captureVoiceError(e, { scope: "session" });
          setCaption("⚠️ Voice error — please try again");
          clearTurnTimers();
          responseActiveRef.current = false;
        },
        onClose: (info) => {
          if (stale()) return;
          console.warn("🟡 Voice CLOSED", info);
          clearTurnTimers();
          if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
            idleTimerRef.current = null;
          }
          responseActiveRef.current = false;
          // Connection dropped before proving stable → keep the attempt count (do
          // NOT let a pending stable-timer reset it), so the reconnect ceiling holds.
          if (stableTimerRef.current) {
            clearTimeout(stableTimerRef.current);
            stableTimerRef.current = null;
          }
          // Auto-reconnect on an UNEXPECTED close (not a user stop / cost cap),
          // preserving the conversation's working memory (it is NOT reset here).
          const canRetry =
            !userClosedRef.current && reconnectsRef.current < MAX_RECONNECTS;
          if (canRetry) {
            const attempt = ++reconnectsRef.current;
            const delay = RECONNECT_BASE_MS * 2 ** (attempt - 1);
            voiceTrack("reconnecting", { attempt, code: info.code });
            setStatus("connecting");
            setCaption("🔄 Reconnecting…");
            if (reconnectTimerRef.current)
              clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = setTimeout(() => {
              establishRef.current?.(); // reconnect: no memory reset
            }, delay);
            return;
          }
          trackSessionEnd(userClosedRef.current ? "user" : "closed");
          setStatus("idle");
          setActivity("listening");
          // A drop we didn't ask for is a TERMINAL error the shopper must retry;
          // a user-initiated stop is a clean idle (no error affordance).
          setError(!userClosedRef.current);
          setCaption(
            userClosedRef.current ? "" : "Connection lost — tap Retry."
          );
        },
      };
    },
    [runTool, stop, trackSessionEnd, pathname, clearTurnTimers, bumpIdle]
  );

  // Establish a live session for the current generation (used for both a fresh
  // user-initiated start and an auto-reconnect — the flow is identical; the
  // caller decides whether to reset memory).
  //
  // The provider (OpenAI Realtime over WebRTC) owns mic capture, playback, AEC,
  // and server-authoritative barge-in. We hand it the gesture-primed <audio>
  // element + mic stream (see primeForConnect) so iOS Safari allows playback and
  // the mic; both are undefined on a reconnect (no gesture), where the provider
  // creates/acquires its own — desktop behavior unchanged.
  const establish = useCallback(
    async (isRetry = false) => {
      const gen = ++startGenRef.current;
      const stale = () => gen !== startGenRef.current;
      setStatus("connecting");

      let session: VoiceSession | null = null;
      const bail = () => {
        try {
          session?.close(); // stops the mic track + tears down the WebRTC pc
        } catch {
          /* best-effort — non-fatal */
        }
        if (sessionRef.current === session) sessionRef.current = null;
      };

      try {
        const { token, model } = await getToken();
        if (stale()) return bail();
        const liveModel = model ?? voiceProvider.defaultModel;
        // Ephemeral client secrets are SINGLE-USE — the SDP exchange in connect()
        // consumes this token. Drop it from the cache NOW so the next start /
        // reconnect mints a fresh one; reusing it → "ephemeral_token_already_used".
        tokenRef.current = null;

        // Consume the gesture-primed mic (iOS) if one is in flight; else the
        // provider acquires the mic itself.
        let primedStream: MediaStream | undefined;
        if (primedMicRef.current) {
          try {
            primedStream = await primedMicRef.current;
          } catch {
            primedStream = undefined; // permission denied / not yet primed
          }
          primedMicRef.current = null;
          if (stale()) {
            primedStream?.getTracks().forEach((t) => t.stop());
            return bail();
          }
        }

        session = await voiceProvider.connect(
          {
            token,
            model: liveModel,
            audioEl: providerAudioElRef.current ?? undefined,
            micStream: primedStream,
          },
          buildCallbacks(gen, stale, liveModel)
        );
        if (stale()) return bail();
        sessionRef.current = session;
        // Re-assert the shopper's mute choice on this fresh track — so a mid-call
        // reconnect (mobile Wi-Fi↔LTE handoff) doesn't silently un-mute the mic.
        if (mutedRef.current) session.setMicMuted?.(true);
        // Mount into the primed element's parent when present, else <body>.
        session.attach?.(
          providerAudioElRef.current?.parentElement ?? document.body
        );
      } catch (e: any) {
        console.error(e);
        // SINGLE-USE TOKEN RECOVERY: a raced connect (e.g. a background-drop reconnect
        // + a manual re-open sharing one in-flight token) can send an already-consumed
        // ephemeral secret to the SDP exchange → 401 "ephemeral_token_already_used".
        // Recover silently: drop the token and re-establish ONCE with a fresh mint.
        if (
          !isRetry &&
          !stale() &&
          /already[_ ]?used|ephemeral|\b401\b/i.test(String(e?.message ?? e))
        ) {
          tokenRef.current = null;
          return establishRef.current?.(true);
        }
        // A denied mic prompt is a user choice, not an error worth reporting.
        if ((e as any)?.name !== "NotAllowedError")
          captureVoiceError(e, { scope: "start" });
        bail();
        if (!stale()) {
          // Terminal: mic permission denied or the connect failed outright. Surface
          // a friendly line + the error affordance (Retry) rather than a raw message.
          const denied = (e as any)?.name === "NotAllowedError";
          setCaption(
            denied
              ? "Microphone blocked — enable it in your browser, then retry."
              : "Couldn't connect — tap Retry to try again."
          );
          setStatus("idle");
          setError(true);
        }
      }
    },
    [getToken, buildCallbacks]
  );

  // Keep the ref pointed at the latest establish so onClose's reconnect timer can
  // call it without a useCallback dependency cycle.
  useEffect(() => {
    establishRef.current = establish;
  }, [establish]);

  // MOBILE/iOS PRIMING — MUST run SYNCHRONOUSLY inside the tap gesture (before any
  // await), because iOS Safari only permits audio playback and getUserMedia when
  // they're initiated by a user gesture, and the connect flow's token await breaks
  // that chain. Here we (1) create + .play()-unlock a reusable <audio> element, and
  // (2) kick off mic acquisition (not awaited — starting it in-gesture is what iOS
  // requires). Both are handed to the provider in establish(). No-op for host-audio
  // providers, and safe/idempotent on desktop (the play() just resolves silently).
  const primeForConnect = useCallback(() => {
    if (typeof window === "undefined") return;
    // 1) Playback element — unlock it now so iOS lets the remote track play later.
    if (!providerAudioElRef.current) {
      const el = document.createElement("audio");
      el.autoplay = true;
      (el as HTMLAudioElement & { playsInline: boolean }).playsInline = true;
      el.setAttribute("playsinline", "");
      el.style.display = "none";
      document.body.appendChild(el);
      providerAudioElRef.current = el;
    }
    try {
      void providerAudioElRef.current.play?.().catch(() => {});
    } catch {
      /* unlock is best-effort */
    }
    // 2) Mic — start acquisition inside the gesture (do NOT await). Same constraints
    // the provider would use. If one is already in flight, keep it.
    if (!primedMicRef.current) {
      try {
        primedMicRef.current = navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            // AGC OFF — MUST match the provider's own getUserMedia constraints
            // (openaiRealtimeProvider). AGC ramps over the first few hundred ms and
            // attenuates word ONSETS, which clips a short first command ("add it")
            // enough that endpointing misses the turn. This primed stream is the one
            // actually used on mobile/iOS, so leaving it ON regressed exactly that
            // case on the platform most shoppers are on.
            autoGainControl: false,
            channelCount: 1,
          },
        });
        // Swallow a rejection so it can't become an unhandled promise; establish()
        // re-reads and handles the real outcome.
        primedMicRef.current.catch(() => {});
      } catch {
        primedMicRef.current = null;
      }
    }
  }, []);

  // The shared connect path for start (fresh) and resume (continue). MUST be called
  // from a user gesture on mobile — primeForConnect runs synchronously here to
  // unlock iOS audio + mic before the first await.
  const connect = useCallback(
    async (freshMemory: boolean) => {
      if (startingRef.current) return; // re-entry guard: one connect at a time
      // OFFLINE PRE-CHECK — `navigator.onLine === false` is reliable (a `true` is
      // not), so we bail ONLY when definitively offline: a clear message beats
      // prompting for the mic and then failing silently at the SDP exchange.
      if (typeof navigator !== "undefined" && navigator.onLine === false) {
        setPaused(false);
        setStatus("idle");
        setError(true);
        setCaption("You're offline — check your connection and try again.");
        return;
      }
      startingRef.current = true;
      userClosedRef.current = false;
      reconnectsRef.current = 0;
      // Start clean: no carried-over error/pause, mic live.
      setError(false);
      setPaused(false);
      setMuted(false);
      mutedRef.current = false;
      primeForConnect(); // synchronous, in-gesture — unlocks iOS audio + mic
      // Claim the single cross-tab voice slot: tell any other tab already running
      // voice to yield BEFORE we connect (last tab wins).
      voiceChannelRef.current?.postMessage({
        type: "start",
        id: tabIdRef.current,
      });
      // Fresh start clears the working memory; resume() keeps memory so the paused
      // conversation continues (reconnect also keeps it — see onClose).
      if (freshMemory) {
        memory.reset();
      }
      // Arm the one-time opening greeting ONLY for a fresh start. Setting it here
      // UNCONDITIONALLY (false on resume/reconnect) is deliberate: if the tab is
      // backgrounded during the connecting window — before the first onOpen consumes
      // the latch — teardown leaves it armed; a subsequent resume() going through
      // connect(false) must clear it, otherwise the greeting would replay on resume.
      greetPendingRef.current = freshMemory && VOICE_CFG.greeting.enabled;
      try {
        await establish();
      } finally {
        startingRef.current = false;
      }
    },
    [establish, memory, primeForConnect]
  );

  // Fresh conversation (idle → live).
  const start = useCallback(() => connect(true), [connect]);
  // Continue a conversation that was auto-suspended when the tab was backgrounded —
  // memory preserved. Called from the Resume tap (a gesture, so iOS re-grants
  // mic/audio).
  const resume = useCallback(() => connect(false), [connect]);

  // TAB LIFECYCLE — voice needs a FOREGROUND tab (you can't talk to a hidden one),
  // and a hidden tab must never hold the mic + WebRTC + AI session (privacy + cost).
  // So we stop on `visibilitychange → hidden` for ALL platforms, and on `pagehide`
  // (a real teardown: close / navigate / refresh). This is the main defence against
  // resources leaking across many backgrounded/abandoned tabs.
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Backgrounded (screen lock / incoming call / app switch / tab change) → SUSPEND:
    // release the mic, keep the conversation, offer Resume — never a memory-wiping
    // stop. The wake lock is re-acquired by the status effect when resume() goes live.
    const onVisibility = () => {
      if (document.visibilityState === "hidden" && statusRef.current !== "idle")
        suspend();
    };
    const onPageHide = () => {
      if (statusRef.current !== "idle") suspend();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [suspend]);

  // CROSS-TAB SINGLE SESSION — only one tab runs voice at a time. On start a tab
  // broadcasts a takeover; any other tab with a live/connecting session yields
  // (stops), so N tabs can never run N concurrent sessions ("last tab wins", like a
  // call moving to your latest device). No-op where BroadcastChannel is unavailable.
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof BroadcastChannel === "undefined"
    )
      return;
    if (!tabIdRef.current)
      tabIdRef.current = `${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
    const ch = new BroadcastChannel("shopkit-voice-session");
    voiceChannelRef.current = ch;
    ch.onmessage = (e: MessageEvent) => {
      if (
        e.data?.type === "start" &&
        e.data.id !== tabIdRef.current &&
        statusRef.current !== "idle"
      ) {
        console.log("🎙️ [voice] another tab started voice → yielding");
        void stop();
      }
    };
    return () => {
      try {
        ch.close();
      } catch {
        /* ignore */
      }
      voiceChannelRef.current = null;
    };
  }, [stop]);

  return {
    status,
    caption,
    activity,
    muted,
    toggleMute,
    error,
    paused,
    start,
    stop,
    resume,
    prewarm,
  };
}
