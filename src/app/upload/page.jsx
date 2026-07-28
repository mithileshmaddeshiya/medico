"use client";

import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { cityData } from "@/data/medicine/cityData";

/**
 * Internal seeding screen — pushes the local medicine data into Firestore.
 *
 * Lab cities are no longer seeded here: they are served straight off local data
 * (src/data/lab/cities.js), so there is nothing to upload for them any more.
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

  const buttonClass =
    "cursor-pointer rounded-md px-6 py-3 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="max-w-xl mx-auto px-4 pt-30 pb-16">
      <h1 className="text-xl font-bold text-slate-900">Firestore seeding</h1>
      <p className="mt-1 text-sm text-slate-500">
        Internal only. Writes the local medicine data into Firestore.
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
      </div>

      {status && (
        <p className="mt-4 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
          {status}
        </p>
      )}
    </div>
  );
}
