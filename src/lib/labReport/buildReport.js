/**
 * Cover page + the partner lab's original report → one PDF.
 *
 * Browser-safe, like ./coverPage.js — see the note there for why the report
 * is built on the staff member's device and not on the server.
 */
import { EncryptedPDFError, PDFDocument } from "pdf-lib";

import { drawCoverPage } from "./coverPage";

export const MAX_LAB_PDF_MB = 40;

/** A failure worth showing to the person generating the report, as written. */
export class LabReportError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "LabReportError";
  }
}

/**
 * @param {{ patient: { name: string, gender: string, age?: number|string, reportDate: string, bookingId?: string },
 *           lab: { name: string, verified: boolean } }} data
 * @param {Uint8Array | ArrayBuffer} labPdf       the lab's original report
 * @param {Uint8Array | ArrayBuffer} templateJpg  assets/lab-report/cover-template.jpg
 * @returns {Promise<Uint8Array>}
 */
export async function buildLabReport(data, labPdf, templateJpg) {
  const labBytes = labPdf instanceof Uint8Array ? labPdf : new Uint8Array(labPdf);

  if (labBytes.byteLength > MAX_LAB_PDF_MB * 1024 * 1024) {
    throw new LabReportError(`The lab report must be smaller than ${MAX_LAB_PDF_MB} MB.`);
  }
  // "%PDF-" may sit a few bytes in; the spec allows it anywhere in the first 1 KB.
  const head = String.fromCharCode(...labBytes.subarray(0, 1024));
  if (!head.includes("%PDF-")) {
    throw new LabReportError("That file is not a PDF. Upload the report the lab sent.");
  }

  let labDoc;
  try {
    labDoc = await PDFDocument.load(labBytes, { updateMetadata: false });
  } catch (err) {
    if (err instanceof EncryptedPDFError) {
      throw new LabReportError(
        "This PDF is password-protected. Ask the lab for a copy without a password.",
        { cause: err }
      );
    }
    throw new LabReportError("This PDF is damaged and could not be opened.", { cause: err });
  }
  if (labDoc.getPageCount() === 0) throw new LabReportError("This PDF has no pages.");

  const { patient, lab } = data;
  const now = new Date();
  const ref = patient.bookingId ? ` - ${patient.bookingId}` : "";

  const out = await PDFDocument.create();
  out.setTitle(`Lab Report - ${patient.name}${ref}`, { showInWindowTitleBar: true });
  out.setAuthor(lab.name);
  out.setSubject(`Diagnostic test report for ${patient.name}${ref}`);
  out.setCreator("MedicoBharat");
  out.setProducer("MedicoBharat");
  out.setCreationDate(now);
  out.setModificationDate(now);

  await drawCoverPage(out, data, templateJpg);

  const pages = await out.copyPages(labDoc, labDoc.getPageIndices());
  for (const page of pages) out.addPage(page);

  /*
   * The untouched original rides along as an attachment.
   *
   * Copying the lab's pages into a new file keeps everything visible — values,
   * stamp, the pathologist's signature image — but a CRYPTOGRAPHIC signature
   * (Adobe's "signed and all signatures are valid") covers the bytes of the
   * original file, and no merged file can carry it. The attachment is that
   * original, byte for byte, so the lab's signature can still be verified.
   */
  await out.attach(labBytes, "original-lab-report.pdf", {
    mimeType: "application/pdf",
    description: `Original, unmodified report issued by ${lab.name}`,
    creationDate: now,
    modificationDate: now,
  });

  return out.save();
}
