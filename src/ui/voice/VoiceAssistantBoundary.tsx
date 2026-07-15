"use client";

/**
 * Production wrapper for the voice widget — two guardrails:
 *
 *  1. KILL SWITCH — set NEXT_PUBLIC_VOICE_ENABLED="false" to disable voice
 *     instantly (incident response / per-environment) with no code deploy.
 *     Any other value (or unset) = enabled.
 *  2. ISOLATION — an error boundary so a crash INSIDE the voice widget can never
 *     take down the storefront. It fails silent (renders nothing) and reports the
 *     error to Sentry.
 */

import React from "react";
import { captureVoiceError } from "./observability";
import { VoiceAssistant } from "./VoiceAssistant";

const VOICE_ENABLED = process.env.NEXT_PUBLIC_VOICE_ENABLED !== "false";

class VoiceErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    captureVoiceError(error, { scope: "widget-boundary" });
  }
  render() {
    if (this.state.failed) return null; // storefront stays fully intact
    return this.props.children;
  }
}

export function VoiceAssistantBoundary() {
  if (!VOICE_ENABLED) return null;
  return (
    <VoiceErrorBoundary>
      <VoiceAssistant />
    </VoiceErrorBoundary>
  );
}
