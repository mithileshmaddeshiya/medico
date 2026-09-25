"use client";

/**
 * Upload a report (PDF / JPG / PNG, ≤ 8 MB) for a booking. Posts to
 * /api/crm/reports/upload — a route handler, because report scans exceed a
 * Server Action's body limit — then refreshes the page.
 *
 * On a phone the file picker offers the camera too, so a lab can photograph
 * a printed report if that is all it has.
 */
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FileUp, Loader2 } from "lucide-react";

import { btn, cx, inputCls } from "./ui";

const MAX = 8 * 1024 * 1024;

export default function ReportUpload({ bookingId, replacing = false, compact = false }) {
  const router = useRouter();
  const input = useRef(null);
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [busy, setBusy] = useState(false);

  const pick = (f) => {
    if (!f) return;
    if (f.size > MAX) {
      toast.error("That file is larger than 8 MB. Save it as a smaller PDF and try again.");
      return;
    }
    if (!/^(application\/pdf|image\/(jpeg|png))$/.test(f.type)) {
      toast.error("Upload a PDF, JPG or PNG.");
      return;
    }
    setFile(f);
  };

  const submit = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const body = new FormData();
      body.set("bookingId", String(bookingId));
      body.set("file", file);
      body.set("remarks", remarks);
      const res = await fetch("/api/crm/reports/upload", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "The upload failed. Try again.");
      toast.success(`Report v${data.version} uploaded.`);
      setFile(null);
      setRemarks("");
      if (input.current) input.current.value = "";
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={cx("rounded-xl border border-dashed border-slate-300 bg-slate-50/60", compact ? "p-3" : "p-4")}>
      <label className="flex cursor-pointer flex-col items-center gap-1.5 text-center">
        <FileUp className="h-5 w-5 text-blue-600" aria-hidden />
        <span className="text-[13.5px] font-semibold text-slate-800">
          {file ? file.name : replacing ? "Upload a replacement report" : "Upload the report"}
        </span>
        <span className="text-[11.5px] text-slate-500">
          {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "PDF, JPG or PNG · up to 8 MB"}
        </span>
        <input
          ref={input}
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          className="sr-only"
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </label>
      {file && (
        <div className="mt-3 space-y-2">
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={2}
            maxLength={1000}
            placeholder="Remarks for MedicoBharat (optional)"
            className={inputCls}
            aria-label="Report remarks"
          />
          <div className="flex gap-2">
            <button type="button" onClick={submit} disabled={busy} className={btn("primary", "md", "flex-1")}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {busy ? "Uploading…" : "Upload"}
            </button>
            <button type="button" onClick={() => setFile(null)} disabled={busy} className={btn("secondary")}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
