"use server";

/**
 * The actions every screen in the panel shares: delete, restore, notes, sign
 * out.
 *
 * ── EVERY ACTION RE-CHECKS THE SESSION ───────────────────────────────────
 * A Server Action is a real HTTP endpoint with a stable id, and anything that
 * can make a request can call it. The gate in src/proxy.js does not run for
 * these, and the layout's check certainly does not. So each one starts with
 * actionUser(), which throws NotAllowed if the caller is not signed in with a
 * sufficient role — and `wrap` turns that into an ordinary `{ ok, error }`
 * the form can display rather than an unhandled server error.
 *
 * ── DELETE MEANS SOFT DELETE, WITH NO WAY ROUND IT ───────────────────────
 * These call src/lib/admin/softDelete.js, which only ever writes a status.
 * There is no variant that removes a row and no flag that enables one. A
 * caller that wants a record gone has to say which status it should rest in.
 */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { signOut } from "@/lib/admin/auth";
import { actionUser, NotAllowed } from "@/lib/admin/guard";
import { addNote } from "@/lib/admin/opsStore";
import { restore, softDelete, SOFT_DELETABLE } from "@/lib/admin/softDelete";

/**
 * The FormData, whichever way the action was called.
 *
 * A Server Action used in a plain `<form action={fn}>` is called with just the
 * FormData. The same action passed to `useActionState` is called with
 * (previousState, formData). Both call sites exist in this panel — the delete
 * dialog posts a plain form, most editors use useActionState for the pending
 * flag — and an action that assumes one shape silently reads `undefined` from
 * the other. Normalising here means neither call site has to care.
 */
const formOf = (a, b) => (b instanceof FormData ? b : a);

/**
 * Run an action and always answer with `{ ok, … }`.
 *
 * A thrown NotAllowed becomes a message; anything else is logged in full and
 * answered generically, because a raw database error in a toast is both
 * useless to the reader and a small information leak.
 */
async function wrap(fn) {
  try {
    return (await fn()) ?? { ok: true };
  } catch (err) {
    if (err instanceof NotAllowed) return { ok: false, error: err.message };
    // redirect() and notFound() work by throwing; re-throw or they break.
    if (err?.digest?.startsWith?.("NEXT_")) throw err;
    console.error("[admin] an action failed", err);
    return { ok: false, error: "Something went wrong. The change was not saved." };
  }
}

/** Which page to refresh after a record changes. */
const PATHS = {
  media: "/admin/media",
  blog_posts: "/admin/blogs",
  lab_tests: "/admin/tests",
  test_categories: "/admin/tests/categories",
  city_overrides: "/admin/cities",
  seo_routes: "/admin/seo",
  seo_redirects: "/admin/seo/redirects",
  admin_users: "/admin/users",
  admin_notes: "/admin",
  leads: "/admin/leads",
  orders: "/admin/orders",
};

/**
 * Soft-delete anything the panel owns.
 *
 * `entity` must name one of SOFT_DELETABLE's keys; an unknown table cannot be
 * touched at all, which is what keeps this from becoming a general-purpose
 * "update any row" endpoint.
 */
export async function deleteRecord(a, b) {
  const formData = formOf(a, b);
  return wrap(async () => {
    const entity = String(formData.get("entity") ?? "");
    const id = String(formData.get("id") ?? "");
    const mode = formData.get("mode") === "archive" ? "archive" : "delete";

    if (!SOFT_DELETABLE[entity]) return { ok: false, error: "That is not something the panel can delete." };

    // Users are the one entity where deleting changes who can get in, so it
    // takes the higher role. Everything else is content and operations.
    const user = await actionUser(entity === "admin_users" ? "owner" : "editor");

    // Deleting your own account would sign you out of the only way back in.
    if (entity === "admin_users" && Number(id) === Number(user.id)) {
      return { ok: false, error: "You cannot delete the account you are signed in with." };
    }

    const result = await softDelete(entity, id, { user, mode });
    if (result.ok && PATHS[entity]) revalidatePath(PATHS[entity]);

    return result.ok
      ? {
          ok: true,
          message:
            mode === "archive"
              ? `That ${result.label} is archived. It is still here and can be brought back.`
              : `That ${result.label} is in the bin. Nothing was permanently removed.`,
        }
      : result;
  });
}

/** Put a soft-deleted record back. */
export async function restoreRecord(a, b) {
  const formData = formOf(a, b);
  return wrap(async () => {
    const entity = String(formData.get("entity") ?? "");
    const id = String(formData.get("id") ?? "");
    const to = formData.get("to") ? String(formData.get("to")) : null;

    if (!SOFT_DELETABLE[entity]) return { ok: false, error: "That is not something the panel can restore." };

    const user = await actionUser(entity === "admin_users" ? "owner" : "editor");
    const result = await restore(entity, id, { user, to });
    if (result.ok && PATHS[entity]) revalidatePath(PATHS[entity]);

    return result.ok
      ? {
          ok: true,
          message:
            entity === "blog_posts"
              ? "Restored as a draft — check it over before publishing it again."
              : `That ${result.label} is back.`,
        }
      : result;
  });
}

/** Attach a note to a lead or an order. */
export async function noteRecord(a, b) {
  const formData = formOf(a, b);
  return wrap(async () => {
    const user = await actionUser("editor");
    const entity = String(formData.get("entity") ?? "");
    const id = String(formData.get("id") ?? "");

    if (!["lead", "order", "cart"].includes(entity)) {
      return { ok: false, error: "Notes go on leads, orders and carts." };
    }

    const result = await addNote(entity, id, formData.get("body"), { user });
    if (result.ok) revalidatePath(`/admin/${entity}s/${id}`);
    return result.ok ? { ok: true, message: "Note added." } : result;
  });
}

export async function signOutAction() {
  await signOut();
  redirect("/admin/login");
}
