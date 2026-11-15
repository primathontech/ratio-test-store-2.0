"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  AB_EXPERIMENT_COOKIE,
  AB_ARM_COOKIE,
  AB_PAGE_COOKIE,
} from "@shopkit/ab";
import type { ArmContext } from "./index";

/**
 * Publishes the A/B reporting values, and keeps them right across client-side
 * navigation — the server-rendered script in ArmReport runs once per document
 * load and never again.
 *
 * Two targets, two readers: `window.__ab` for @shopkit/events and
 * @shopkit/analytics, cookies for GTM, which can only read cookies.
 *
 * Absent `report` CLEARS both, so arriving on a page no experiment covers
 * reports "not in a test" rather than whatever was here last.
 */
/** One source for these names: @shopkit/ab owns them and the readers key off them. */
const COOKIE_NAMES = [
  AB_EXPERIMENT_COOKIE,
  AB_ARM_COOKIE,
  AB_PAGE_COOKIE,
] as const;

function writeCookie(name: string, value: string | null) {
  if (value === null) {
    document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
    return;
  }
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; samesite=lax`;
}

function sync(report: ArmContext["report"]) {
  if (typeof document === "undefined") {
    return;
  }
  const w = window as unknown as { __ab?: unknown };

  if (report) {
    w.__ab = report;
    writeCookie(AB_EXPERIMENT_COOKIE, report.experiment);
    writeCookie(AB_ARM_COOKIE, report.arm);
    writeCookie(AB_PAGE_COOKIE, report.page);
  } else {
    delete w.__ab;
    for (const name of COOKIE_NAMES) {
      writeCookie(name, null);
    }
  }
}

/**
 * The path an ArmSync most recently published for.
 *
 * Module scope, which is per browser tab and single-threaded. It is how
 * <ArmScope> below tells "this page is in no test" apart from "this page has
 * not rendered its ArmSync yet".
 */
let publishedFor: string | null = null;

export function ArmSync({ report }: { report?: ArmContext["report"] }) {
  const path = usePathname();
  // During RENDER, not in an effect: `page_view` is emitted from an effect, and
  // React runs effects only after the whole tree renders — so an effect here
  // lands after the event. Measured: a hop to an untested collection reported
  // `ab_page: home`. The write is idempotent, so a replayed render is free.
  sync(report);
  publishedFor = path;

  // Again after commit. React does not re-run effects on a back/forward-cache
  // restore — that needs a `pageshow` listener — so this is only a second pass
  // over the same values, cheap and idempotent.
  const key = report ? `${report.experiment}|${report.arm}|${report.page}` : "";
  useEffect(() => {
    sync(report);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}

/**
 * Clears the reporting values on any page that publishes none.
 *
 * Rendered once by the shop layout. Only the four tested page types render an
 * <ArmReport>, so without this a hop from a tested page to /cart, /pages/x or
 * /orders left the previous page's cookies in place and the tag manager kept
 * reporting a test the shopper had left.
 *
 * Runs in an effect on purpose: effects fire after the whole tree has rendered,
 * so a page that DOES publish has already claimed this path by then.
 */
export function ArmScope() {
  const path = usePathname();

  useEffect(() => {
    if (publishedFor !== path) {
      sync(undefined);
    }
  }, [path]);

  return null;
}
