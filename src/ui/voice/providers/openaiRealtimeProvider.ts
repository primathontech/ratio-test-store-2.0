/**
 * OpenAI Realtime (WebRTC) implementation of the VoiceProvider contract. ALL
 * OpenAI-specific browser details live here and nowhere else: the
 * RTCPeerConnection/data-channel handshake against the GA `/v1/realtime/calls`
 * SDP endpoint, the `oai-events` data-channel event vocabulary, and the fact
 * that this provider renders its OWN audio via a native MediaStreamTrack (no
 * app-level PCM). Adding another realtime model = a sibling adapter + a registry
 * entry (providers/index.ts); nothing upstream changes.
 *
 * Reference: VOICE.md ("OpenAI Realtime — technical reference") for the GA event
 * names, the SDP/data-channel handshake, and the barge-in model.
 */

import type {
  VoiceProvider,
  VoiceSession,
  VoiceSessionCallbacks,
} from "./types";

// Fallback only — the server always returns the model it actually minted the
// token for; this is never provider-specific config leaking to the client.
const DEFAULT_MODEL = "gpt-realtime-2.1";

/** Create the hidden <audio> element that plays the remote track. `playsInline`
 *  + explicit .play() (see mountAudio) are REQUIRED for iOS Safari, which won't
 *  auto-start a MediaStream. On desktop the widget passes a pre-unlocked element
 *  (primed inside the tap gesture); this is the fallback for reconnects / when
 *  none was passed. */
function ensureAudioEl(): HTMLAudioElement {
  const el = document.createElement("audio");
  el.autoplay = true;
  (el as HTMLAudioElement & { playsInline: boolean }).playsInline = true;
  el.setAttribute("playsinline", ""); // iOS honors the ATTRIBUTE, not just the prop
  el.style.display = "none";
  return el;
}

// ICE configuration for the client↔OpenAI connection.
//
// TOPOLOGY NOTE (why there is no TURN vendor here): OpenAI Realtime is a
// client-to-CLOUD connection — OpenAI's endpoint is the publicly-reachable peer
// and does NAT traversal/relay on THEIR side (they explicitly rejected classic
// TURN for a server-side relay-transceiver design, see their "low-latency voice
// AI at scale" writeup). So the browser just connects OUTBOUND to OpenAI's public
// candidates; a STUN server only helps it discover its own server-reflexive
// candidate. A third-party TURN relay (Twilio/metered/etc.) is peer-to-peer
// advice that does NOT apply here and would only add cost + latency.
//
// The one real case for TURN is a network that blocks UDP entirely (some
// corporate/hotel Wi-Fi), where a TURN-over-TCP/TLS-443 relay is the only escape.
// That's rare for a consumer mobile audience, so we DON'T hard-require (or pay
// for) it — instead the ICE list is operator-overridable: a deployment that hits
// UDP-blocked networks can drop TURN credentials into NEXT_PUBLIC_VOICE_ICE_SERVERS
// (a JSON array of RTCIceServer) with ZERO code change. Default = public STUN.
function parseIceServers(): RTCIceServer[] {
  const raw = process.env.NEXT_PUBLIC_VOICE_ICE_SERVERS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length)
        return parsed as RTCIceServer[];
    } catch {
      // malformed env → fall through to the STUN default (never break connect)
    }
  }
  return [{ urls: "stun:stun.l.google.com:19302" }];
}
const ICE_SERVERS: RTCIceServer[] = parseIceServers();

// ENDPOINT SAFETY NET. After the user stops speaking, the server's turn detection
// (semantic_vad or server_vad) is supposed to create the response. Occasionally —
// most visibly on the FIRST, short utterance — it doesn't, and the turn is silently
// dropped so the shopper has to repeat themselves. If no response activity is seen
// within this window after a speech-stop, we send one response.create ourselves. A
// redundant create while a response is already active errors with
// `conversation_already_has_active_response`, which is swallowed below — so this can
// only recover a missed turn, never cause a double reply. New speech before it fires
// cancels it (the user is still talking).
const RESPONSE_FALLBACK_MS = 1500;

export const openaiRealtimeProvider: VoiceProvider = {
  name: "openai",
  defaultModel: DEFAULT_MODEL,

  async connect(
    { token, model, audioEl: providedAudioEl, micStream: providedMic },
    cb: VoiceSessionCallbacks
  ): Promise<VoiceSession> {
    void model; // model is baked into the ephemeral token at mint time; unused here.

    let container: HTMLElement | undefined;
    let remoteStream: MediaStream | undefined;
    // Use the widget-primed element (unlocked inside the tap gesture — iOS) when
    // given; otherwise create our own (desktop/reconnect). We must NOT remove a
    // widget-owned element on close (it's reused across reconnects).
    let audioEl: HTMLAudioElement | undefined = providedAudioEl;
    const audioElIsExternal = !!providedAudioEl;
    let micStream: MediaStream | undefined;
    let closed = false;
    // Track the assistant item currently producing audio + when it began, so a
    // barge-in can truncate it at exactly what the user heard (audio_end_ms).
    let currentAudioItemId: string | undefined;
    let audioStartMs = 0;
    // Function calls buffered within the current response, flushed as ONE batch on
    // response.done — so parallel tool calls are handled together (one result set,
    // one response.create) instead of racing multiple response.create sends.
    let pendingToolCalls: { id?: string; name: string; args: unknown }[] = [];
    // Endpoint safety-net timer (see RESPONSE_FALLBACK_MS). Armed on speech-stop,
    // cleared by any response activity or new speech.
    let responseFallbackTimer: ReturnType<typeof setTimeout> | null = null;
    const clearResponseFallback = () => {
      if (responseFallbackTimer) {
        clearTimeout(responseFallbackTimer);
        responseFallbackTimer = null;
      }
    };
    // Readiness gate (see the dc "open" handler). onOpen fires exactly once, when the
    // server session is confirmed live — not merely when the data channel opens.
    let sessionReady = false;
    let readinessTimer: ReturnType<typeof setTimeout> | null = null;
    const fireOpen = () => {
      if (sessionReady) return;
      sessionReady = true;
      if (readinessTimer) {
        clearTimeout(readinessTimer);
        readinessTimer = null;
      }
      cb.onOpen();
      cb.onActivity?.("listening");
    };

    const mountAudio = () => {
      if (!remoteStream) return;
      if (!audioEl) audioEl = ensureAudioEl();
      // Mount into the container the widget attached; else keep it where it already
      // is (a primed element the widget already appended); else <body> fallback.
      const target = container ?? audioEl.parentElement ?? document.body;
      audioEl.srcObject = remoteStream;
      if (!target.contains(audioEl)) target.appendChild(audioEl);
      // EXPLICIT play() — iOS Safari does not honor autoplay for a MediaStream that
      // is attached after the gesture (the SDP round-trip already consumed it). The
      // element was .play()-unlocked in the tap gesture, so this resolves; the catch
      // keeps a benign rejection (desktop already playing) from surfacing.
      void audioEl.play?.().catch(() => {});
    };

    const handleClose = (reason?: string) => {
      if (closed) return;
      closed = true;
      clearResponseFallback();
      if (readinessTimer) {
        clearTimeout(readinessTimer);
        readinessTimer = null;
      }
      cb.onClose({ reason });
    };

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    pc.ontrack = (e) => {
      remoteStream = e.streams[0];
      mountAudio();
    };
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (
        state === "failed" ||
        state === "disconnected" ||
        state === "closed"
      ) {
        handleClose(state);
      }
    };

    // Local mic: getUserMedia + addTrack (NOT addStream, per the spike). CRITICAL:
    // echoCancellation MUST be on — otherwise the agent's own voice (played through
    // the <audio> element, esp. on laptop speakers) leaks back into the mic, the
    // server VAD hears it as the user speaking, and the agent self-interrupts in a
    // loop (never finishing a sentence). noiseSuppression trims ambient false VAD
    // triggers too.
    // Prefer the mic stream the widget acquired INSIDE the tap gesture (iOS Safari
    // blocks getUserMedia that isn't gesture-bound, and the token await before this
    // point already broke the gesture chain). Fall back to acquiring it here on
    // desktop / reconnect, where gesture-binding isn't enforced.
    micStream =
      providedMic ??
      (await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          // AGC OFF: automatic gain control ramps over the first few hundred ms of
          // a stream, attenuating word ONSETS — which clips the start of a short
          // first command ("add it", "open this") enough that endpointing can miss
          // the turn (the "didn't respond on the first attempt" symptom). Echo
          // cancellation (the real anti-self-interrupt guard) stays ON.
          autoGainControl: false,
          channelCount: 1,
        },
      }));
    for (const track of micStream.getTracks()) pc.addTrack(track, micStream);

    // Data channel name MUST be "oai-events" per the spike. Barge-in is
    // SERVER-AUTHORITATIVE: turn_detection.interrupt_response makes the server
    // cancel its own reply and stop sending audio when it hears the user. We do
    // NOT mute or cancel from the client — an earlier attempt to do that got the
    // agent stuck SILENT (the unmute depended on a data-channel audio event that
    // doesn't reliably fire on WebRTC) and threw benign cancel errors. Trusting the
    // server — the whole point of Realtime — is simpler and actually reliable.
    const dc = pc.createDataChannel("oai-events");
    // READINESS GATE. The data channel opening only means we CAN send — it does NOT
    // mean the server session is live and processing audio. Signaling "ready" on
    // dc-open lets the shopper speak into a session that isn't listening yet, and
    // that first utterance is dropped (the "didn't respond on the first attempt"
    // symptom). So defer onOpen until the server's `session.created`/`session.updated`
    // confirms the session is live; a short fallback fires it anyway if that event is
    // ever missed, so connect can never hang.
    dc.addEventListener("open", () => {
      readinessTimer = setTimeout(fireOpen, 3000);
    });
    dc.addEventListener("close", () => handleClose("datachannel-closed"));
    dc.addEventListener("message", (e: MessageEvent) => {
      let evt: any;
      try {
        evt = JSON.parse(e.data);
      } catch (err) {
        cb.onError(err);
        return;
      }
      // Any response.* activity means the server DID create/continue a response —
      // cancel the endpoint safety net so it can't fire a redundant create.
      if (typeof evt?.type === "string" && evt.type.startsWith("response."))
        clearResponseFallback();
      switch (evt?.type) {
        case "session.created":
        case "session.updated":
          // Server session is live and configured — NOW we're truly ready to listen.
          fireOpen();
          break;
        case "input_audio_buffer.speech_started": {
          // User (re)started speaking — cancel any pending endpoint fallback; the
          // turn isn't over. (Barge-in handling continues below.)
          clearResponseFallback();
          // The user started speaking. The server (interrupt_response) is already
          // cancelling its reply and stopping the audio track — we do NOT mute or
          // cancel from the client. We only:
          //  - TRUNCATE the assistant item at what was actually heard, so the
          //    server transcript matches reality (else the model believes it said
          //    things the user never heard → vague follow-ups). Guarded: fires only
          //    while audio is genuinely playing.
          //  - abandon any tool calls from the interrupted turn.
          //  - notify the app (stale-tool guard + "Listening" caption).
          if (currentAudioItemId) {
            try {
              dc.send(
                JSON.stringify({
                  type: "conversation.item.truncate",
                  item_id: currentAudioItemId,
                  content_index: 0,
                  audio_end_ms: Math.max(0, Date.now() - audioStartMs),
                })
              );
            } catch {
              /* best-effort */
            }
          }
          currentAudioItemId = undefined;
          pendingToolCalls = [];
          cb.onInterrupted();
          // Whether this is a barge-in or the shopper's first words, the model is now
          // receiving them → the UI is "listening".
          cb.onActivity?.("listening");
          break;
        }
        case "input_audio_buffer.speech_stopped":
          // VAD reported the current speaker paused. Drives client-managed turn
          // coalescing (the stabilization window). Barge-in is unaffected — that's
          // the speech_STARTED case above.
          cb.onSpeechStopped?.();
          // Shopper paused → the model is about to compose its reply.
          cb.onActivity?.("thinking");
          // Arm the endpoint safety net: if the server doesn't start a response
          // within RESPONSE_FALLBACK_MS (the "first utterance ignored" miss), create
          // one ourselves. Cleared above by any response.* event or new speech.
          if (RESPONSE_FALLBACK_MS > 0) {
            clearResponseFallback();
            responseFallbackTimer = setTimeout(() => {
              try {
                dc.send(JSON.stringify({ type: "response.create" }));
              } catch {
                /* best-effort */
              }
            }, RESPONSE_FALLBACK_MS);
          }
          break;
        case "response.output_audio.delta":
          // First audio chunk of a (new) assistant item → record it so a later
          // barge-in can truncate at the right position. Playback happens on the
          // media track; we do NOTHING to the <audio> element here (no mute).
          if (evt.item_id && evt.item_id !== currentAudioItemId) {
            currentAudioItemId = evt.item_id;
            audioStartMs = Date.now();
            // First audio chunk of a new assistant item → the model is speaking.
            cb.onActivity?.("speaking");
          }
          break;
        case "response.function_call_arguments.done": {
          // Args arrive complete on `.done` (name + call_id + arguments). Buffer;
          // flush on response.done so parallel tool calls are one batch.
          let args: unknown = {};
          try {
            args = evt.arguments ? JSON.parse(evt.arguments) : {};
          } catch {
            args = {};
          }
          pendingToolCalls.push({ id: evt.call_id, name: evt.name, args });
          break;
        }
        case "response.done": {
          currentAudioItemId = undefined;
          const status = evt?.response?.status;
          if (status === "cancelled" || status === "failed") {
            pendingToolCalls = []; // dead response → don't act on it
            break;
          }
          if (pendingToolCalls.length) {
            // Response asked for tools — run them; the real answer is a NEW
            // response, so this is NOT a completed turn.
            const calls = pendingToolCalls;
            pendingToolCalls = [];
            cb.onActivity?.("thinking"); // running tools → still composing
            cb.onToolCall(calls);
          } else {
            cb.onTurnComplete();
            cb.onActivity?.("listening"); // turn done → back to the shopper
          }
          break;
        }
        case "error": {
          // Swallow benign, race-y errors (e.g. truncating past the end) — they
          // must NOT surface as a UI error toast.
          const code = evt?.error?.code ?? evt?.code;
          if (
            code === "response_cancel_not_active" ||
            code === "item_truncate_invalid_audio_end_ms" ||
            // Turn-coalescing race: a barge-in cancels response A and the new turn
            // fires response B before the server finishes cancelling A. Non-fatal —
            // the in-flight response completes and answers; swallow so it doesn't
            // flash a UI error / spam Sentry.
            code === "conversation_already_has_active_response"
          )
            break;
          cb.onError(evt.error ?? evt);
          break;
        }
        default:
          break;
      }
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // GA SDP exchange: raw SDP text body, application/sdp, ephemeral bearer —
    // NOT the deprecated /v1/realtime/sessions (ws-only beta) path.
    const sdpResponse = await fetch(
      "https://api.openai.com/v1/realtime/calls",
      {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/sdp",
        },
      }
    );
    if (!sdpResponse.ok) {
      const detail = await sdpResponse.text().catch(() => "");
      const err = new Error(
        `OpenAI realtime SDP exchange failed: ${sdpResponse.status} ${detail}`
      );
      cb.onError(err);
      throw err;
    }
    const answerSdp = await sdpResponse.text();
    await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

    return {
      attach: (c: HTMLElement) => {
        container = c;
        // Relocate an already-mounted element (e.g. from the <body> fallback).
        if (audioEl && audioEl.parentElement !== c) c.appendChild(audioEl);
        mountAudio();
      },
      // Passive context injection (current page / navigation / working set). A
      // SYSTEM item with NO response.create — it must not make the agent speak; it
      // just updates what the model knows for its NEXT response. This is how the
      // agent stays aware of where the user is before choosing a tool.
      sendContext: (text: string) => {
        try {
          dc.send(
            JSON.stringify({
              type: "conversation.item.create",
              item: {
                type: "message",
                role: "system",
                content: [{ type: "input_text", text }],
              },
            })
          );
        } catch {
          /* best-effort */
        }
      },
      sendToolResults: (results, opts) => {
        try {
          for (const r of results) {
            dc.send(
              JSON.stringify({
                type: "conversation.item.create",
                item: {
                  type: "function_call_output",
                  call_id: r.id,
                  output: JSON.stringify(r.response),
                },
              })
            );
          }
          // A function_call_output MUST be sent for every call (else the call
          // dangles and corrupts the next turn). But skip the trailing
          // response.create when the turn was interrupted — the new user turn's
          // response is driven by the server VAD, and forcing one here would make
          // the agent answer the abandoned request.
          if (!opts?.skipResponseCreate)
            dc.send(JSON.stringify({ type: "response.create" }));
        } catch {
          /* best-effort */
        }
      },
      requestResponse: (opts) => {
        try {
          // `instructions` overrides the prompt for THIS response only (used for the
          // one-shot opening greeting) — the session persona/tools/voice are untouched.
          const payload = opts?.instructions
            ? {
                type: "response.create",
                response: { instructions: opts.instructions },
              }
            : { type: "response.create" };
          dc.send(JSON.stringify(payload));
        } catch {
          /* best-effort */
        }
      },
      // MIC MUTE: flip `enabled` on the outgoing audio track(s). A disabled track
      // stays in the WebRTC session but transmits silence, so the server VAD hears
      // nothing and the model stops responding to the shopper — with NO teardown, so
      // unmute is instant and needs no new session. Idempotent; safe post-reconnect
      // (the widget re-applies it on every onOpen via its own muted ref).
      setMicMuted: (muted: boolean) => {
        try {
          micStream?.getAudioTracks().forEach((t) => {
            t.enabled = !muted;
          });
        } catch {
          /* best-effort */
        }
      },
      close: () => {
        try {
          clearResponseFallback();
          if (readinessTimer) {
            clearTimeout(readinessTimer);
            readinessTimer = null;
          }
          micStream?.getTracks().forEach((t) => t.stop());
          dc.close();
          pc.close();
          if (audioEl) {
            audioEl.srcObject = null;
            // Only remove an element WE created. A widget-primed element is reused
            // across reconnects (and stays gesture-unlocked), so leave it in place.
            if (!audioElIsExternal) audioEl.remove();
          }
        } catch {
          /* best-effort */
        }
      },
    };
  },
};
