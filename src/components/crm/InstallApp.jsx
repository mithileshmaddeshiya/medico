"use client";

/**
 * "Install app" for the CRM.
 *
 * Chrome on Android fires `beforeinstallprompt` when the page is installable
 * (manifest at /crm/manifest.webmanifest + service worker /crm-sw.js). We hold
 * on to that event and fire it from our own button, so installing is one tap
 * instead of a hunt through the ⋮ menu.
 *
 * When the event never comes — Incognito, a link opened inside WhatsApp's
 * browser, iPhone Safari, or an older browser — the same button opens short
 * instructions for that case instead of doing nothing. Already running as the
 * installed app: the button hides itself.
 *
 * `variant`: "bar" (compact, top bar), "tile" (the More sheet), "link" (sidebar).
 */
import { useEffect, useState, useSyncExternalStore } from "react";
import { Download, X } from "lucide-react";

import { btn, cx } from "./ui";

/* One shared holder for the deferred prompt, so every button on the page
   (top bar, More sheet, sidebar) sees the same event. */
const store = { prompt: null, installed: false, listeners: new Set() };
const emit = () => store.listeners.forEach((l) => l());

if (typeof window !== "undefined" && !window.__mbCrmInstallHooked) {
  window.__mbCrmInstallHooked = true;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // keep it for our button instead of Chrome's mini-bar
    store.prompt = e;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    store.prompt = null;
    store.installed = true;
    emit();
  });
  // Register the service worker that makes the CRM installable. Scope /crm
  // only — it never touches the public site.
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/crm-sw.js", { scope: "/crm" }).catch(() => {});
  }
}

const subscribe = (l) => {
  store.listeners.add(l);
  return () => store.listeners.delete(l);
};
const snapshot = () => (store.installed ? "installed" : store.prompt ? "ready" : "none");
const serverSnapshot = () => "none";

function standalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari's own flag
    window.navigator.standalone === true
  );
}

export default function InstallApp({ variant = "tile" }) {
  const state = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [help, setHelp] = useState(false);
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the display mode after mount
    setIsApp(standalone());
  }, []);

  if (isApp || state === "installed") return null;

  const install = async () => {
    if (store.prompt) {
      const e = store.prompt;
      store.prompt = null;
      emit();
      await e.prompt();
      await e.userChoice.catch(() => null);
      return;
    }
    setHelp(true);
  };

  const trigger =
    variant === "bar" ? (
      <button type="button" onClick={install} className={btn("soft", "sm", "h-9 lg:hidden")} aria-label="Install the CRM app">
        <Download className="h-4 w-4" aria-hidden /> App
      </button>
    ) : variant === "link" ? (
      <button type="button" onClick={install} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800">
        <Download className="h-4 w-4" aria-hidden /> Install app
      </button>
    ) : (
      <button
        type="button"
        onClick={install}
        className="flex w-full items-center gap-3 rounded-2xl bg-blue-600 px-4 py-3.5 text-left text-white active:bg-blue-700"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <Download className="h-5 w-5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-[14.5px] font-semibold">Install MB CRM app</span>
          <span className="block text-[12px] text-blue-100">Home screen par icon — ek tap mein CRM</span>
        </span>
      </button>
    );

  return (
    <>
      {trigger}
      {help && <InstallHelp onClose={() => setHelp(false)} />}
    </>
  );
}

function InstallHelp({ onClose }) {
  const ios = typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);
  const inApp = typeof navigator !== "undefined" && /(FBAN|FBAV|Instagram|WhatsApp|; wv\))/i.test(navigator.userAgent);

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Install the app">
      <button type="button" className="absolute inset-0 bg-slate-900/50" aria-label="Close" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[26rem] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="text-[16px] font-semibold text-slate-900">App kaise install karein</p>
          <button type="button" onClick={onClose} className={btn("ghost", "sm", "h-9 w-9 px-0")} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {inApp ? (
          <Steps
            items={[
              "Yeh page WhatsApp / kisi app ke andar khula hai — wahan install nahi hota.",
              "Upar ⋮ dabaiye → “Open in Chrome” (ya “Open in browser”).",
              "Chrome mein yahi button dobara dabaiye.",
            ]}
          />
        ) : ios ? (
          <Steps
            items={[
              "Yeh page Safari mein kholiye.",
              "Neeche Share button (⬆️ wala dabba) dabaiye.",
              "Scroll karke “Add to Home Screen” → Add.",
            ]}
          />
        ) : (
          <Steps
            items={[
              "Incognito tab ho to normal Chrome tab mein kholiye — Incognito mein install nahi hota.",
              "Chrome mein upar ⋮ (teen dot) dabaiye.",
              "“Install app” ya “Add to Home screen” chuniye. Na dikhe to “Cast, save and share” ke andar dekhiye.",
              "Install / Add dabaiye — home screen par “MB CRM” aa jayega.",
            ]}
          />
        )}
        <button type="button" onClick={onClose} className={btn("primary", "lg", "mt-5 w-full")}>
          Theek hai
        </button>
      </div>
    </div>
  );
}

function Steps({ items }) {
  return (
    <ol className="space-y-2.5">
      {items.map((t, i) => (
        <li key={t} className="flex gap-3 text-[14px] leading-relaxed text-slate-700">
          <span className={cx("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[12px] font-bold text-blue-700")}>
            {i + 1}
          </span>
          {t}
        </li>
      ))}
    </ol>
  );
}
