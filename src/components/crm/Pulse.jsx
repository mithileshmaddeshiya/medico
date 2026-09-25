"use client";

/**
 * Near-real-time updates without a socket.
 *
 * The site runs on serverless functions, where a long-lived connection is
 * neither cheap nor reliable, so the CRM polls one tiny endpoint instead:
 * /api/crm/pulse answers { unread, latest } — the unread notification count
 * and the newest activity id this user may see. Every 20 s while the tab is
 * visible (and at once when it becomes visible again):
 *
 *   - the bell gets the new count (a "crm:pulse" window event);
 *   - if `latest` moved, somebody changed something, and the current page is
 *     re-rendered on the server with router.refresh() — which keeps client
 *     state (scroll, open menus) and only swaps the data.
 *
 * It never refreshes under someone's fingers: not while a field has focus,
 * a dialog is open, or text is selected. It waits for the next beat.
 */
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const EVERY_MS = 20_000;

function busy() {
  const el = document.activeElement;
  if (el && ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return true;
  if (el?.isContentEditable) return true;
  if (document.querySelector("dialog[open]")) return true;
  if (String(window.getSelection?.() ?? "").length > 0) return true;
  return false;
}

export default function Pulse() {
  const router = useRouter();
  const last = useRef(null);
  const pendingRefresh = useRef(false);

  useEffect(() => {
    let timer;
    let stopped = false;

    const beat = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/crm/pulse", { cache: "no-store" });
        if (res.status === 401) {
          window.location.href = `/crm/login?next=${encodeURIComponent(location.pathname + location.search)}&expired=1`;
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        window.dispatchEvent(new CustomEvent("crm:pulse", { detail: data }));

        if (last.current !== null && data.latest !== last.current) pendingRefresh.current = true;
        last.current = data.latest;

        if (pendingRefresh.current && !busy()) {
          pendingRefresh.current = false;
          router.refresh();
        }
      } catch {
        /* offline for a moment — the next beat tries again */
      }
    };

    const loop = async () => {
      await beat();
      if (!stopped) timer = setTimeout(loop, EVERY_MS);
    };
    loop();

    const onVisible = () => document.visibilityState === "visible" && beat();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router]);

  return null;
}
