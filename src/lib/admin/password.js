/**
 * Password hashing for admin accounts. Server only.
 *
 * scrypt from Node's own crypto, not bcrypt or argon2. Both of those are
 * native addons that have to be compiled for the deploy target; scrypt is in
 * the standard library, is memory-hard by design, and is what Node's own docs
 * point at for exactly this. One less dependency that can fail to build on the
 * host is worth more here than a marginally fashionable KDF.
 *
 * Stored form, one string, self-describing so the parameters can be raised
 * later without invalidating every existing password:
 *
 *   scrypt$<N>$<r>$<p>$<salt base64>$<key base64>
 *
 * A hash written with the old cost still verifies; `needsRehash` says when to
 * quietly upgrade one on a successful sign-in.
 */
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb);

/*
 * N=16384 (2^14), r=8, p=1 — the parameters Node documents, costing about
 * 16 MB and a few tens of milliseconds per hash. That is the right order of
 * magnitude for a login form: unnoticeable to the one person signing in,
 * ruinous to anyone working through a stolen table.
 *
 * `maxmem` has to be raised explicitly or Node refuses N=16384 with
 * "Invalid scrypt params" — its default cap is below what these settings need.
 */
const PARAMS = { N: 16384, r: 8, p: 1 };
const KEY_LEN = 64;
const maxmem = () => 256 * PARAMS.N * PARAMS.r;

/** Hash a plaintext password into the storable string. */
export async function hashPassword(plain) {
  const password = String(plain ?? "");
  if (password.length < 8) throw new Error("A password must be at least 8 characters.");

  const salt = randomBytes(16);
  const key = await scrypt(password, salt, KEY_LEN, { ...PARAMS, maxmem: maxmem() });

  return [
    "scrypt",
    PARAMS.N,
    PARAMS.r,
    PARAMS.p,
    salt.toString("base64"),
    key.toString("base64"),
  ].join("$");
}

/**
 * Does `plain` match `stored`? Never throws on a malformed hash — it answers
 * false, because a corrupt row must read as "wrong password" and not as a
 * server error that tells an attacker the account exists.
 */
export async function verifyPassword(plain, stored) {
  try {
    const [scheme, N, r, p, saltB64, keyB64] = String(stored ?? "").split("$");
    if (scheme !== "scrypt") return false;

    const salt = Buffer.from(saltB64, "base64");
    const expected = Buffer.from(keyB64, "base64");
    const opts = { N: Number(N), r: Number(r), p: Number(p) };
    if (!opts.N || !opts.r || !opts.p || !expected.length) return false;

    const actual = await scrypt(String(plain ?? ""), salt, expected.length, {
      ...opts,
      maxmem: 256 * opts.N * opts.r,
    });

    // Constant time: a length-independent early return would leak how much of
    // the key matched.
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/** True when a stored hash was written with weaker parameters than we use now. */
export function needsRehash(stored) {
  const [scheme, N, r, p] = String(stored ?? "").split("$");
  return (
    scheme !== "scrypt" ||
    Number(N) < PARAMS.N ||
    Number(r) < PARAMS.r ||
    Number(p) < PARAMS.p
  );
}

/**
 * Why a password was rejected, as a sentence the panel can show — or null when
 * it is acceptable.
 *
 * Length first and length foremost. A 12-character passphrase beats an
 * 8-character one with a symbol in it, and rules that demand punctuation are
 * what produce `Password1!` on a sticky note. The character-class check here
 * only fires on genuinely trivial strings.
 */
export function passwordProblem(plain) {
  const password = String(plain ?? "");
  if (password.length < 10) return "Use at least 10 characters — a short phrase is fine.";
  if (/^(.)\1+$/.test(password)) return "That is the same character repeated.";
  if (/^(password|admin|medico|123456|qwerty)/i.test(password)) {
    return "That starts with a word attackers try first. Pick something else.";
  }
  return null;
}
