"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Download, ExternalLink, FileUp, Loader2, RotateCcw } from "lucide-react";

import { recordLabReport } from "./actions";

const LAST_LAB_KEY = "mb:lab-report:last-lab";
const MAX_MB = 40;

const input =
  "mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 " +
  "placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";
const label = "block text-[13px] font-semibold text-slate-700";
const legend = "mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700";

function readLastLab() {
  try {
    return JSON.parse(localStorage.getItem(LAST_LAB_KEY) ?? "null");
  } catch {
    return null;
  }
}

function saveLastLab(lab) {
  try {
    localStorage.setItem(LAST_LAB_KEY, JSON.stringify(lab));
  } catch {
    // Private mode or storage blocked: nothing to remember, nothing broken.
  }
}

const slug = (text) =>
  String(text).replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "Patient";

/**
 * The form, the upload and the preview.
 *
 * The PDF is assembled right here in the browser — pdf-lib is loaded only when
 * the button is pressed, so it costs nothing until then. See
 * src/lib/labReport/coverPage.js for why this is not done on the server.
 */
export default function LabReportGenerator({ today }) {
  const formRef = useRef(null);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { url, filename, sizeKb }

  // Staff mostly work with the same partner lab all day; don't make them retype
  // it. Written straight into the (uncontrolled) inputs: localStorage does not
  // exist during the server render, so it cannot seed state without a mismatch.
  function restoreLastLab() {
    const last = readLastLab();
    const form = formRef.current;
    if (!last?.name || !form) return;
    form.elements.labName.value = last.name;
    form.elements.labVerified.checked = last.verified !== false;
  }

  useEffect(restoreLastLab, []);

  // Release the previous preview's memory when a new one replaces it.
  useEffect(() => () => result && URL.revokeObjectURL(result.url), [result]);

  function pickFile(f) {
    setError("");
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please choose a PDF file.");
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`The PDF must be smaller than ${MAX_MB} MB.`);
      return;
    }
    setFile(f);
    setResult(null);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const form = new FormData(formRef.current);
    const get = (k) => String(form.get(k) ?? "").trim();
    const data = {
      patient: {
        name: get("patientName"),
        gender: get("gender"),
        age: get("age") || undefined,
        reportDate: get("reportDate"),
        bookingId: get("bookingId") || undefined,
      },
      lab: { name: get("labName"), verified: form.get("labVerified") === "on" },
    };

    if (!file) {
      setError("Please upload the lab report PDF.");
      return;
    }

    setBusy(true);
    try {
      const [{ buildLabReport }, templateRes, labBytes] = await Promise.all([
        import("@/lib/labReport/buildReport"),
        fetch("/api/lab-report/template", { cache: "no-store" }),
        file.arrayBuffer(),
      ]);

      if (templateRes.status === 401) {
        throw new Error("Your session has expired. Refresh the page and sign in again.");
      }
      if (!templateRes.ok) {
        const body = await templateRes.json().catch(() => null);
        throw new Error(body?.error ?? "Could not load the cover design. Try again.");
      }

      const pdf = await buildLabReport(data, labBytes, await templateRes.arrayBuffer());
      const blob = new Blob([pdf], { type: "application/pdf" });

      saveLastLab(data.lab);
      setResult({
        url: URL.createObjectURL(blob),
        filename: `MedicoBharat-Report-${slug(data.patient.name)}-${data.patient.reportDate}.pdf`,
        sizeKb: Math.round(blob.size / 1024),
      });
      toast.success("Report ready");

      // The audit row. Not awaited in the UI's critical path: a slow write must
      // not hold the finished report back from the person waiting for it.
      recordLabReport({
        patientName: data.patient.name,
        labName: data.lab.name,
        reportDate: data.patient.reportDate,
        bookingId: data.patient.bookingId,
      }).then((r) => r?.ok === false && toast.error(r.error));
    } catch (err) {
      // LabReportError messages are written for the person using this form.
      setError(err?.message || "Could not generate the report.");
    } finally {
      setBusy(false);
    }
  }

  function startOver() {
    formRef.current?.reset();
    restoreLastLab();
    setFile(null);
    setResult(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h1 className="text-lg font-bold text-slate-900">Create patient report</h1>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          Fill in the details and upload the lab&apos;s original PDF. The MedicoBharat cover page
          is added as page 1.
        </p>

        <fieldset className="mt-6">
          <legend className={legend}>Patient details</legend>
          <div className="space-y-4">
            <label className={label}>
              Patient Name
              <input name="patientName" required maxLength={120} placeholder="e.g. Rahul Sharma" className={input} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={label}>
                Gender
                <select name="gender" required defaultValue="" className={input}>
                  <option value="" disabled>
                    Select
                  </option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>
              <label className={label}>
                Age <span className="font-normal text-slate-400">(optional)</span>
                <input name="age" type="number" min={0} max={130} inputMode="numeric" placeholder="34" className={input} />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className={label}>
                Report Date
                <input name="reportDate" type="date" required defaultValue={today} className={input} />
              </label>
              <label className={label}>
                Booking ID <span className="font-normal text-slate-400">(optional)</span>
                <input name="bookingId" maxLength={64} placeholder="MB-000123" className={input} />
              </label>
            </div>
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className={legend}>Testing laboratory</legend>
          <label className={label}>
            Lab Name
            <input
              name="labName"
              required
              maxLength={160}
              placeholder="e.g. Apex Pathology Labs Pvt. Ltd."
              className={input}
            />
          </label>
          <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              name="labVerified"
              defaultChecked
              className="h-4 w-4 accent-emerald-600"
            />
            Show &ldquo;Verified Lab&rdquo; badge
          </label>
        </fieldset>

        <fieldset className="mt-6">
          <legend className={legend}>Original lab report</legend>
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pickFile(e.dataTransfer.files?.[0]);
            }}
            className={[
              "flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 px-4 py-6 text-center transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40",
              file
                ? "border-solid border-emerald-300 bg-emerald-50"
                : dragging
                  ? "border-dashed border-emerald-500 bg-emerald-50"
                  : "border-dashed border-slate-300 bg-slate-50 hover:border-emerald-400",
            ].join(" ")}
          >
            <FileUp className={`h-6 w-6 ${file ? "text-emerald-600" : "text-slate-400"}`} strokeWidth={2} />
            {file ? (
              <>
                <span className="break-all text-sm font-semibold text-slate-900">{file.name}</span>
                <span className="text-xs text-slate-500">
                  {Math.max(1, Math.round(file.size / 1024))} KB · click to change
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-semibold text-slate-800">Drop the lab PDF here</span>
                <span className="text-xs text-slate-500">or click to choose a file (max {MAX_MB} MB)</span>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0])}
          />
        </fieldset>

        {error && (
          <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-progress disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? "Generating…" : "Generate report"}
          </button>
          {(file || result) && (
            <button
              type="button"
              onClick={startOver}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Start over
            </button>
          )}
        </div>

        <p className="mt-5 text-xs leading-relaxed text-slate-400">
          The report is built on this device. The lab&apos;s PDF is never uploaded to the server.
        </p>
      </form>

      <section
        aria-live="polite"
        className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6 lg:min-h-[760px]"
      >
        {result ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div className="min-w-0">
                <p className="break-all text-sm font-semibold text-slate-900">{result.filename}</p>
                <p className="text-xs text-slate-500">{result.sizeKb.toLocaleString("en-IN")} KB</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open
                </a>
                <a
                  href={result.url}
                  download={result.filename}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B2C6B] px-4 py-2 text-sm font-bold text-white hover:bg-[#173e8c]"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              </div>
            </div>
            {/* Phones generally will not render a PDF inside a frame — Open and
                Download above are the way through there. */}
            <iframe title="Report preview" src={result.url} className="min-h-[70vh] w-full flex-1 bg-slate-600 lg:min-h-0" />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-10 text-slate-500">
            <div className="flex h-56 w-40 flex-col overflow-hidden rounded-md border border-slate-200 text-xs font-semibold">
              <span className="grid flex-1 place-items-center bg-blue-50 text-[#0B2C6B]">Cover page</span>
              <span className="grid flex-1 place-items-center border-t border-dashed border-slate-200 bg-emerald-50 text-emerald-700">
                Original lab report
              </span>
            </div>
            <p className="text-sm">Your report preview will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
