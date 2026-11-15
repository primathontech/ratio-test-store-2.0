/**
 * Provider-agnostic contract for a real-time voice model (OpenAI Realtime today;
 * any other realtime model tomorrow). The widget talks ONLY to this interface,
 * never to a vendor SDK — so adding a model is a NEW ADAPTER + a registry entry,
 * never a widget rewrite. This is the seam that keeps us un-coupled from the model.
 *
 * Audio moves as a native WebRTC MediaStreamTrack (the provider renders playback
 * into an <audio> element and captures the mic itself), so there is no app-level
 * PCM plumbing here. A future WebSocket/PCM model would extend this contract with
 * the host-audio hooks it needs; today none is required.
 */

export interface VoiceSessionCallbacks {
  onOpen: () => void;
  /** The shopper spoke over the model and the server truncated its turn.
   *  (VAD speech-START — also the barge-in trigger.) */
  onInterrupted: () => void;
  /** VAD speech-STOP: the current speaker paused. Used by client-managed turn
   *  coalescing to (re)start the stabilization window. Optional — providers that
   *  don't surface it simply never coalesce. */
  onSpeechStopped?: () => void;
  /** The model finished its turn. */
  onTurnComplete: () => void;
  /** The model wants to invoke one or more tools. */
  onToolCall: (calls: { id?: string; name: string; args: any }[]) => void;
  /** SEMANTIC ACTIVITY of the live session, purely for the UI (avatar animation):
   *  "listening" (waiting for / hearing the shopper), "thinking" (endpointed, the
   *  model is composing), "speaking" (the model's audio is playing). Derived from
   *  events the provider already handles, so it costs nothing. Optional — a provider
   *  that can't distinguish never calls it and the UI stays on "listening". */
  onActivity?: (activity: "listening" | "thinking" | "speaking") => void;
  onError: (error: unknown) => void;
  onClose: (info: { code?: number; reason?: string }) => void;
}

export interface VoiceSession {
  /** Mount the provider's <audio> element (playing the remote media track) into
   *  this container. Call once, right after connect(). */
  attach?: (container: HTMLElement) => void;
  /** Inject PASSIVE context (current page / navigation / working set) that the
   *  model should be aware of for its next response, WITHOUT making it speak.
   *  Optional — providers that can't inject silent context omit it. */
  sendContext?: (text: string) => void;
  /** Return tool results for a prior onToolCall. `skipResponseCreate` closes the
   *  function call without triggering a new model response — used when the turn
   *  was interrupted, so the agent doesn't answer the abandoned request. */
  sendToolResults: (
    results: { id?: string; name: string; response: any }[],
    opts?: { skipResponseCreate?: boolean }
  ) => void;
  /** Explicitly ask the model to respond now (a manual `response.create`). Used by
   *  client-managed turn coalescing (server configured NOT to auto-respond) AND by
   *  the proactive opening greeting. Pass `instructions` to shape THIS one response
   *  without touching the persistent session persona (e.g. the connect greeting);
   *  omit for a plain response. No-op-safe: a redundant call while a response is
   *  active errors harmlessly server-side. Optional — providers without manual
   *  control omit it. */
  requestResponse?: (opts?: { instructions?: string }) => void;
  /** Mute/unmute the LOCAL MICROPHONE without tearing down the session — the
   *  outgoing audio track is disabled, so the model stops hearing the shopper (they
   *  still hear the model). Idempotent and safe to re-apply after a reconnect. The
   *  provider owns the mic track, so this is the correct seam (the widget never
   *  touches getUserMedia). Optional — a provider that can't gate the mic omits it
   *  and the widget hides the control. */
  setMicMuted?: (muted: boolean) => void;
  close: () => void;
}

export interface VoiceProvider {
  readonly name: string;
  /** The model to connect to when the server didn't return one (avoids a
   *  provider-specific model id leaking into the provider-agnostic session). */
  readonly defaultModel: string;
  /** Open a live session. Persona/tools/audio config are baked into the token
   *  server-side (provider-specific), so connect only needs the token + model.
   *
   *  MOBILE/iOS: `audioEl` and `micStream` let the widget hand the provider a
   *  playback element that was already .play()-unlocked inside the user's tap
   *  gesture, and a mic stream acquired in that same gesture. iOS Safari blocks
   *  BOTH remote-audio playback and getUserMedia that aren't gesture-bound, and
   *  the WebRTC SDP round-trip happens after the gesture expires — so priming
   *  them up-front in the gesture is what makes voice work on iPhone. Both are
   *  OPTIONAL: when omitted (desktop, reconnect) the provider creates/acquires
   *  its own, exactly as before. */
  connect: (
    opts: {
      token: string;
      model: string;
      audioEl?: HTMLAudioElement;
      micStream?: MediaStream;
    },
    callbacks: VoiceSessionCallbacks
  ) => Promise<VoiceSession>;
}
