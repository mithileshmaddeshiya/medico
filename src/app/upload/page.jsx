"use client";

import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { cityData } from "@/data/cityData";
import { SEED_LAB_CITIES } from "@/data/labCities";

/**
 * Internal seeding screen — pushes the local data files into Firestore.
 *
 * Run "Upload Lab Cities" once to create the `labCities` collection; after
 * that, add and edit cities directly in the Firebase console. The lab pages
 * read that collection and refresh themselves hourly, so a console edit
 * reaches the live site without a redeploy.
 *
 * A city document only needs slug, name, state and areas — every word of the
 * page is generated from those (see src/data/labDefaults.js). Add any of the
 * optional override fields listed in src/data/labCities.js to replace a
 * section's copy, prices or FAQs for that one city.
 *
 * Re-running this overwrites the seeded cities with whatever is in
 * src/data/labCities.js — it will not touch anything you added in the console.
 */
export default function UploadPage() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (label, task) => {
    setBusy(true);
    setStatus(`${label}…`);
    try {
      const count = await task();
      setStatus(`${label}: ${count} document(s) written.`);
    } catch (error) {
      console.error(error);
      setStatus(`${label} failed — ${error.message}`);
    } finally {
      setBusy(false);
    }
  };

  const uploadMedicineCities = () =>
    run("Upload medicine cities", async () => {
      let count = 0;
      for (const cityKey in cityData) {
        await setDoc(doc(db, "cities", cityKey), cityData[cityKey]);
        count++;
      }
      return count;
    });

  const uploadLabCities = () =>
    run("Upload lab cities", async () => {
      let count = 0;
      for (const city of SEED_LAB_CITIES) {
        // Document id === slug, which is what src/lib/labCities.js falls back
        // to when a document has no explicit `slug` field.
        await setDoc(doc(db, "labCities", city.slug), city);
        count++;
      }
      return count;
    });

  const buttonClass =
    "cursor-pointer rounded-md px-6 py-3 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="max-w-xl mx-auto px-4 pt-30 pb-16">
      <h1 className="text-xl font-bold text-slate-900">Firestore seeding</h1>
      <p className="mt-1 text-sm text-slate-500">
        Internal only. Writes the local data files into Firestore.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={uploadMedicineCities}
          disabled={busy}
          className={`${buttonClass} bg-green-600 hover:bg-green-700`}
        >
          Upload Medicine Cities
        </button>

        <button
          type="button"
          onClick={uploadLabCities}
          disabled={busy}
          className={`${buttonClass} bg-emerald-700 hover:bg-emerald-800`}
        >
          Upload Lab Cities
        </button>
      </div>

      {status && (
        <p className="mt-4 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
          {status}
        </p>
      )}
    </div>
  );
}
