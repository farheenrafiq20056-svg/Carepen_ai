"use client";

import React, { useState } from "react";
import { ClinicalResult, PatientExplanation } from "@/types";
import {
  Copy,
  Check,
  Printer,
  FileDown,
  AlertTriangle,
  Activity,
  Clock,
  Clipboard,
  HeartHandshake,
  Languages,
  Volume2,
  VolumeX,
  ShieldAlert,
  ChevronRight,
  RefreshCw,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";
import { generateClinicalNotePdf } from "@/utils/pdfGenerator";

interface ResultViewProps {
  result: ClinicalResult;
  patientName: string;
  patientAge: string;
  patientGender: string;
  onSave: () => void;
  isSaved: boolean;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  onConfirmReview?: (doctorName: string) => Promise<boolean | void>;
}

export default function ResultView({
  result,
  patientName,
  patientAge,
  patientGender,
  onSave,
  isSaved,
  reviewedBy = null,
  reviewedAt = null,
  onConfirmReview,
}: ResultViewProps) {
  const [copiedNote, setCopiedNote] = useState(false);
  const [copiedPatientExp, setCopiedPatientExp] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadedPdf, setDownloadedPdf] = useState(false);

  // Doctor Review & Sign-Off State
  const [reviewerName, setReviewerName] = useState("");
  const [reviewAcknowledged, setReviewAcknowledged] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Patient Explanation State
  const [patientExplanation, setPatientExplanation] = useState<PatientExplanation | null>(
    result.patientExplanation || null
  );
  const [simplifying, setSimplifying] = useState(false);
  const [simplifyError, setSimplifyError] = useState<string | null>(null);
  const [explanationTab, setExplanationTab] = useState<"roman" | "urdu" | "english">("roman");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Normalize so "Dr." appears exactly once, whether or not the user typed it
  // ("Ayzakumar", "Dr Ayzakumar", "Dr.Ayzakumar" all display as "Dr. Ayzakumar")
  const withDoctorTitle = (name: string) => {
    const stripped = name.trim().replace(/^dr[.\s]\s*/i, "");
    return stripped ? `Dr. ${stripped}` : name.trim();
  };

  // Confirm the doctor's review & sign-off
  const handleConfirmReview = async () => {
    const name = reviewerName.trim();
    if (!name || !reviewAcknowledged || reviewSubmitting) return;
    setReviewSubmitting(true);
    setReviewError(null);
    try {
      const ok = await onConfirmReview?.(name);
      if (ok === false) {
        setReviewError("Could not save the sign-off to the patient record. Please try again.");
      }
    } catch {
      setReviewError("Could not save the sign-off to the patient record. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Copy clinical note
  const copyClinicalNote = () => {
    if (!result.clinicalNote) return;
    navigator.clipboard.writeText(result.clinicalNote);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  // Copy simplified patient note
  const copyPatientExplanation = () => {
    if (!patientExplanation) return;
    let textToCopy = "";
    if (explanationTab === "roman") {
      textToCopy = `${patientExplanation.simplifiedRomanUrdu}\n\nHome Care:\n${patientExplanation.keyCareInstructions.join("\n")}\n\nEmergency Warning: ${patientExplanation.warningRedFlags}`;
    } else if (explanationTab === "urdu") {
      textToCopy = `${patientExplanation.simplifiedUrdu}\n\nاہم ہدایات:\n${patientExplanation.keyCareInstructions.join("\n")}\n\nہنگامی علامات: ${patientExplanation.warningRedFlags}`;
    } else {
      textToCopy = `${patientExplanation.simplifiedEnglish}\n\nKey Advice:\n${patientExplanation.keyCareInstructions.join("\n")}\n\nEmergency Red Flags: ${patientExplanation.warningRedFlags}`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedPatientExp(true);
    setTimeout(() => setCopiedPatientExp(false), 2000);
  };

  // Download PDF Report
  const handleDownloadPdf = () => {
    setDownloadingPdf(true);
    try {
      generateClinicalNotePdf({
        result,
        patientName: patientName.trim() || "Anonymous Patient",
        patientAge: patientAge.trim() || "N/A",
        patientGender,
        patientExplanation,
        reviewedBy,
        reviewedAt,
      });
      setDownloadedPdf(true);
      setTimeout(() => setDownloadedPdf(false), 2500);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Generate patient-friendly explanation via Gemini
  const handleSimplifyNote = async () => {
    setSimplifying(true);
    setSimplifyError(null);

    try {
      const response = await fetch("/api/simplify-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicalNote: result.clinicalNote,
          patientName: patientName.trim() || "Patient",
          chiefComplaint: result.clinicalIntake.chiefComplaint,
          urgency: result.urgency.flag,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to simplify clinical note.");
      }

      setPatientExplanation(data);
    } catch (err: any) {
      console.error("Simplify error:", err);
      setSimplifyError(err.message || "Failed to generate patient explanation.");
    } finally {
      setSimplifying(false);
    }
  };

  // Browser Speech Synthesis for patient explanation
  const handleToggleSpeakExplanation = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!patientExplanation) return;
    window.speechSynthesis.cancel();

    const textToSpeak =
      explanationTab === "english"
        ? patientExplanation.simplifiedEnglish
        : patientExplanation.simplifiedRomanUrdu;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // Print clinical and patient record
  const printRecord = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print the patient record.");
      return;
    }

    const urgencyColor =
      result.urgency.flag === "High"
        ? "#be123c"
        : result.urgency.flag === "Medium"
        ? "#d97706"
        : "#059669";

    const symptomsHtml = result.clinicalIntake.keySymptoms
      .map(
        (sym) =>
          `<span style="background-color: #f0fdfa; border: 1px solid #ccfbf1; color: #0f766e; padding: 3px 10px; border-radius: 9999px; margin-right: 6px; font-size: 12px; display: inline-block; margin-bottom: 4px; font-weight: 600;">${sym}</span>`
      )
      .join("");

    const patientExplanationHtml = patientExplanation
      ? `
      <div style="margin-top: 24px; padding: 16px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
        <div style="font-size: 15px; font-weight: bold; color: #166534; margin-bottom: 8px;">Patient-Friendly Summary (Roman Urdu / اردو)</div>
        <p style="font-size: 13px; color: #1e293b; line-height: 1.6; margin-bottom: 12px;">${patientExplanation.simplifiedRomanUrdu}</p>
        <div style="font-size: 13px; font-weight: bold; color: #166534; margin-bottom: 4px;">Home Care & Medication Advice:</div>
        <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #334155; line-height: 1.5;">
          ${patientExplanation.keyCareInstructions.map((inst) => `<li>${inst}</li>`).join("")}
        </ul>
        <div style="margin-top: 10px; font-size: 12px; color: #991b1b; font-weight: bold;">
          Emergency Warning: ${patientExplanation.warningRedFlags}
        </div>
      </div>
    `
      : "";

    const reviewSignoffHtml = reviewedBy
      ? `
      <div style="margin-top: 20px; padding: 14px 16px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div>
          <div style="font-size: 13px; font-weight: bold; color: #065f46;">Reviewed by ${withDoctorTitle(reviewedBy)}</div>
          <div style="font-size: 11px; color: #047857; margin-top: 2px;">Signed off: ${reviewedAt || "—"}</div>
        </div>
        <div style="font-size: 10px; font-weight: bold; color: #065f46; background-color: #d1fae5; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">Verified for Patient Record</div>
      </div>
    `
      : `
      <div style="margin-top: 20px; padding: 12px 16px; background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; font-size: 12px; color: #92400e; font-weight: bold;">
        Pending Doctor Review — AI-generated draft, not yet verified for the patient record.
      </div>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>CarePen AI - Clinical & Referral Slip</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; padding: 36px; line-height: 1.5; }
            .header { border-bottom: 2px solid #0d9488; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 22px; font-weight: 800; color: #0d9488; letter-spacing: -0.5px; }
            .meta { font-size: 11px; color: #64748b; text-align: right; line-height: 1.4; }
            .section-title { font-size: 13px; font-weight: bold; color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
            .card { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; font-size: 13px; }
            .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 11px; color: white; background-color: ${urgencyColor}; text-transform: uppercase; }
            .note-box { background-color: #f1f5f9; border-left: 4px solid #0284c7; padding: 14px; border-radius: 6px; font-family: monospace; font-size: 12.5px; line-height: 1.6; }
            .footer { margin-top: 36px; border-top: 1px dashed #cbd5e1; padding-top: 12px; font-size: 10.5px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">CarePen AI • Clinical Scribe</div>
              <div style="font-size: 11px; color: #64748b;">Outpatient Referral & Encounter Record (Pakistan)</div>
            </div>
            <div class="meta">
              <strong>Encounter Date:</strong> ${new Date().toLocaleDateString()}<br>
              <strong>Generated At:</strong> ${new Date().toLocaleTimeString()}
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <div class="section-title" style="border:none; margin-bottom: 6px;">Patient Demographics</div>
              <div><strong>Name:</strong> ${patientName || "Anonymous Patient"}</div>
              <div><strong>Age / Gender:</strong> ${patientAge || "Unspecified"} / ${patientGender || "Unspecified"}</div>
            </div>
            <div class="card" style="border-top: 3px solid ${urgencyColor};">
              <div class="section-title" style="border:none; margin-bottom: 6px;">Triage Urgency Status</div>
              <div style="margin-bottom: 6px;"><span class="badge">${result.urgency.flag} Urgency</span></div>
              <div style="font-size: 12px; color: #334155;"><strong>Rationale:</strong> ${result.urgency.reason}</div>
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <div class="section-title">Clinical Intake Summary</div>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 6px 0; font-weight: bold; width: 25%; color: #475569;">Chief Complaint:</td>
                <td style="padding: 6px 0;">${result.clinicalIntake.chiefComplaint}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 6px 0; font-weight: bold; color: #475569;">Duration:</td>
                <td style="padding: 6px 0;">${result.clinicalIntake.duration}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 6px 0; font-weight: bold; color: #475569;">Key Symptoms:</td>
                <td style="padding: 6px 0;">${symptomsHtml || "None identified"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 6px 0; font-weight: bold; color: #475569;">Pertinent History:</td>
                <td style="padding: 6px 0;">${result.clinicalIntake.relevantHistory}</td>
              </tr>
            </table>
          </div>

          <div>
            <div class="section-title">Clinical Scribe Note (EHR Formatted)</div>
            <div class="note-box">${result.clinicalNote}</div>
          </div>

          ${reviewSignoffHtml}

          ${patientExplanationHtml}

          <div class="footer">
            CarePen AI Documentation Engine • Verified by Examining Physician • OPD Record
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 400);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getUrgencyClasses = (flag: string) => {
    switch (flag) {
      case "High":
        return {
          banner: "bg-rose-50 border-rose-200 text-rose-900",
          badge: "bg-rose-600 text-white border-rose-700 shadow-rose-200",
          indicator: "bg-rose-500",
          chip: "bg-rose-50 text-rose-800 border-rose-200",
        };
      case "Medium":
        return {
          banner: "bg-amber-50 border-amber-200 text-amber-900",
          badge: "bg-amber-600 text-white border-amber-700 shadow-amber-200",
          indicator: "bg-amber-500",
          chip: "bg-amber-50 text-amber-800 border-amber-200",
        };
      default:
        return {
          banner: "bg-emerald-50 border-emerald-200 text-emerald-900",
          badge: "bg-emerald-600 text-white border-emerald-700 shadow-emerald-200",
          indicator: "bg-emerald-500",
          chip: "bg-emerald-50 text-emerald-800 border-emerald-200",
        };
    }
  };

  const urgencyStyle = getUrgencyClasses(result.urgency.flag);

  return (
    <div id="result-view-root" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Urgency Alert Bar with Healthcare styling */}
      <div
        id="urgency-banner"
        className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border shadow-xs transition-all ${urgencyStyle.banner}`}
      >
        <div className="p-2 rounded-xl bg-white/80 shrink-0 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-inherit" />
        </div>
        <div className="flex-1 space-y-1" id="urgency-details">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              id="urgency-badge"
              className={`text-xs font-extrabold uppercase px-3 py-1 rounded-lg border shadow-xs tracking-wider ${urgencyStyle.badge}`}
            >
              {result.urgency.flag} Urgency Triage
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Assigned by Clinical AI
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium leading-relaxed pt-0.5" id="urgency-reason-text">
            {result.urgency.reason}
          </p>
        </div>
      </div>

      {/* Primary 2-Column Section: Intake Breakdown & Doctor EHR Note */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="results-sections-grid">
        
        {/* Left Side: Structured Clinical Intake Card */}
        <div
          className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between"
          id="structured-summary-card"
        >
          <div>
            {/* Card Header */}
            <div className="bg-gradient-to-r from-teal-50/80 via-sky-50/50 to-white px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-600 text-white rounded-xl shadow-xs">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 tracking-tight" id="summary-header-title">
                    Structured Clinical Intake
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">Standardized Medical Shorthand</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="intake-download-pdf-btn"
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  title="Download Clean PDF Report"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-100/90 hover:bg-teal-200/90 border border-teal-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  {downloadedPdf ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-teal-800" />
                      <span>PDF Downloaded</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-3.5 h-3.5 text-teal-700" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-4" id="summary-details">
              
              {/* Patient Meta Strip */}
              <div className="flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-slate-400">Patient:</span>
                  <strong className="text-slate-900 font-semibold">{patientName || "Anonymous"}</strong>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-slate-400">Demographics:</span>
                  <strong className="text-slate-900 font-semibold">{patientAge || "Age N/A"} / {patientGender || "N/A"}</strong>
                </div>
              </div>

              {/* Chief Complaint */}
              <div className="border-b border-slate-100 pb-3.5 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Chief Complaint
                </span>
                <p className="text-sm font-bold text-slate-800 leading-relaxed">
                  {result.clinicalIntake.chiefComplaint}
                </p>
              </div>

              {/* Duration */}
              <div className="border-b border-slate-100 pb-3.5 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Symptom Duration</span>
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  {result.clinicalIntake.duration || "Not specified in intake"}
                </p>
              </div>

              {/* Key Symptoms Chips */}
              <div className="border-b border-slate-100 pb-3.5 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Extracted Clinical Symptoms
                </span>
                <div className="flex flex-wrap gap-2" id="symptom-badges-container">
                  {result.clinicalIntake.keySymptoms && result.clinicalIntake.keySymptoms.length > 0 ? (
                    result.clinicalIntake.keySymptoms.map((symptom, idx) => (
                      <span
                        key={idx}
                        id={`symptom-chip-${idx}`}
                        className="px-3 py-1.5 text-xs font-semibold bg-teal-50 text-teal-800 rounded-xl border border-teal-200/80 flex items-center gap-1.5 shadow-2xs"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${urgencyStyle.indicator}`} />
                        {symptom}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-xs italic">No specific symptoms parsed</span>
                  )}
                </div>
              </div>

              {/* Relevant History */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Pertinent History & Risk Factors
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {result.clinicalIntake.relevantHistory || "None mentioned during intake."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Doctor EHR Ready Note Block */}
        <div
          className="lg:col-span-5 bg-gradient-to-b from-blue-900 to-slate-900 text-white rounded-3xl shadow-xl overflow-hidden border border-blue-800 flex flex-col justify-between"
          id="clinical-note-scribe-box"
        >
          <div>
            {/* Header */}
            <div className="px-5 py-4 border-b border-blue-800/80 bg-blue-950/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-800 text-blue-300 rounded-xl">
                  <Clipboard className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight">EHR Clinical Scribe Note</span>
              </div>
              {reviewedBy ? (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Reviewed &amp; Signed</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/50">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>Draft — Pending Review</span>
                </div>
              )}
            </div>

            {/* Note text container */}
            <div className="p-5 space-y-3">
              <div className="bg-white/10 rounded-2xl p-4 text-blue-50 font-mono text-xs leading-relaxed min-h-[160px] whitespace-pre-wrap select-all border border-white/10 shadow-inner">
                {result.clinicalNote}
              </div>
              <p className="text-[11px] text-blue-200/80 leading-relaxed">
                Standardized paragraph for quick copy-pasting into hospital EMRs or doctor prescription software.
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="p-5 pt-0 space-y-3">
            <div className="pt-4 border-t border-blue-800/60 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
              {/* Copy Note Button */}
              <button
                id="copy-to-clipboard-btn"
                onClick={copyClinicalNote}
                className={`col-span-2 sm:flex-1 flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer shadow-md active:scale-95 ${
                  copiedNote
                    ? "bg-emerald-500 text-white"
                    : "bg-teal-500 hover:bg-teal-600 text-white"
                }`}
              >
                {copiedNote ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied Scribe Note!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Scribe Note</span>
                  </>
                )}
              </button>

              {/* Download PDF Button */}
              <button
                id="download-pdf-report-btn"
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                title="Download Clean PDF Clinical Report"
                className={`flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer shadow-md active:scale-95 border ${
                  downloadedPdf
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-teal-600 hover:bg-teal-500 text-white border-teal-500"
                }`}
              >
                {downloadedPdf ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    <span>PDF Report</span>
                  </>
                )}
              </button>

              {/* Print Slip */}
              <button
                id="print-referral-slip-btn"
                onClick={printRecord}
                title="Print Referral or Clinical Slip"
                className="bg-blue-800 hover:bg-blue-700 text-white p-3 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer border border-blue-700 shadow-xs flex items-center justify-center"
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* Save to History */}
              <button
                id="save-to-history-btn"
                onClick={onSave}
                disabled={isSaved}
                className={`px-3.5 py-3 rounded-xl font-bold text-xs transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center ${
                  isSaved
                    ? "bg-blue-950 text-blue-400 border border-blue-900 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-600 text-white border border-blue-600 shadow-sm"
                }`}
              >
                {isSaved ? "Saved" : "Save Log"}
              </button>
            </div>

            {/* Trigger Patient-Friendly Translation Button */}
            {!patientExplanation && (
              <button
                id="trigger-simplify-note-btn"
                type="button"
                onClick={handleSimplifyNote}
                disabled={simplifying}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                {simplifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Translating to Simple Urdu...</span>
                  </>
                ) : (
                  <>
                    <Languages className="w-4 h-4" />
                    <span>Explain in simple Urdu / Roman Urdu (for Patient)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Doctor Review & Sign-Off Section */}
      <div
        id="doctor-review-signoff-card"
        className={`rounded-3xl border shadow-sm overflow-hidden ${
          reviewedBy ? "border-emerald-200/90" : "border-amber-200/90"
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between gap-3 ${
            reviewedBy
              ? "bg-gradient-to-r from-emerald-50/80 to-white border-emerald-200/80"
              : "bg-gradient-to-r from-amber-50/80 to-white border-amber-200/80"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl text-white shadow-xs ${reviewedBy ? "bg-emerald-600" : "bg-amber-600"}`}>
              {reviewedBy ? <FileCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight" id="review-section-title">
                Review &amp; Finalize
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Doctor sign-off before adding this note to the patient record
              </p>
            </div>
          </div>
          <span
            className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${
              reviewedBy
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {reviewedBy ? "Reviewed" : "Draft — Unreviewed"}
          </span>
        </div>

        {/* Body */}
        {reviewedBy ? (
          <div className="p-5 flex items-start gap-3 bg-emerald-50/40">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-emerald-900">
                Reviewed by {withDoctorTitle(reviewedBy)}
              </p>
              <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Signed off: {reviewedAt || "—"}
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                This AI-generated note has been verified by the reviewing doctor and finalized for the patient record.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Reviewer name input */}
            <div className="space-y-1.5">
              <label htmlFor="reviewing-doctor-name" className="text-xs font-bold text-slate-700 block">
                Reviewing Doctor&apos;s Name
              </label>
              <input
                id="reviewing-doctor-name"
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g., Dr. Ayesha Khan"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 rounded-xl focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
              />
            </div>

            {/* Confirmation checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none" htmlFor="review-confirmation-checkbox">
              <input
                id="review-confirmation-checkbox"
                type="checkbox"
                checked={reviewAcknowledged}
                onChange={(e) => setReviewAcknowledged(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600 cursor-pointer shrink-0"
              />
              <span className="text-xs text-slate-600 leading-relaxed font-medium">
                I have reviewed this AI-generated note and confirm its accuracy before adding it to the patient record.
              </span>
            </label>

            {/* Submit */}
            <button
              id="confirm-review-btn"
              type="button"
              onClick={handleConfirmReview}
              disabled={!reviewerName.trim() || !reviewAcknowledged || reviewSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95 ${
                !reviewerName.trim() || !reviewAcknowledged || reviewSubmitting
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md cursor-pointer"
              }`}
            >
              {reviewSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Sign-Off...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>Confirm &amp; Sign Off Note</span>
                </>
              )}
            </button>

            {/* Review status hint / error */}
            {reviewError ? (
              <p className="text-xs text-rose-700 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {reviewError}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                This note remains a draft / unreviewed until a doctor signs off.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Feature 2: Patient-Friendly Note Translation Section (Below Clinical Note) */}
      {patientExplanation && (
        <div
          id="patient-friendly-explanation-card"
          className="bg-gradient-to-br from-teal-50/70 via-sky-50/50 to-emerald-50/60 rounded-3xl border border-teal-200/80 shadow-md p-6 space-y-5 animate-in fade-in slide-in-from-top-3 duration-300"
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-200/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight" id="patient-exp-title">
                    Patient-Friendly Explanation & Home Care Advice
                  </h3>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full border border-teal-200">
                    Non-Technical
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Clear, compassionate Urdu & English summary designed for patients and family members.
                </p>
              </div>
            </div>

            {/* Language switch & Audio */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              {/* Tab Selector */}
              <div className="flex items-center bg-white/90 p-1 rounded-xl border border-teal-200 shadow-2xs text-xs font-semibold">
                <button
                  id="patient-tab-roman-btn"
                  onClick={() => setExplanationTab("roman")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    explanationTab === "roman"
                      ? "bg-teal-600 text-white shadow-2xs"
                      : "text-slate-600 hover:text-teal-800"
                  }`}
                >
                  Roman Urdu
                </button>
                <button
                  id="patient-tab-urdu-btn"
                  onClick={() => setExplanationTab("urdu")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    explanationTab === "urdu"
                      ? "bg-teal-600 text-white shadow-2xs"
                      : "text-slate-600 hover:text-teal-800"
                  }`}
                >
                  اردو Script
                </button>
                <button
                  id="patient-tab-en-btn"
                  onClick={() => setExplanationTab("english")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    explanationTab === "english"
                      ? "bg-teal-600 text-white shadow-2xs"
                      : "text-slate-600 hover:text-teal-800"
                  }`}
                >
                  Simple English
                </button>
              </div>

              {/* Audio Listen */}
              <button
                id="patient-audio-speak-btn"
                onClick={handleToggleSpeakExplanation}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                  isPlayingAudio
                    ? "bg-rose-600 text-white border-rose-600 animate-pulse"
                    : "bg-white text-teal-800 border-teal-200 hover:bg-teal-50"
                }`}
                title={isPlayingAudio ? "Stop reading aloud" : "Read aloud for patient"}
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Copy Patient Explanation */}
              <button
                id="copy-patient-explanation-btn"
                onClick={copyPatientExplanation}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  copiedPatientExp
                    ? "bg-emerald-600 text-white border border-emerald-600"
                    : "bg-white hover:bg-teal-50 text-teal-800 border border-teal-200"
                }`}
              >
                {copiedPatientExp ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Explanation</span>
                  </>
                )}
              </button>

              {/* Download PDF with Patient Explanation */}
              <button
                id="patient-download-pdf-btn"
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                title="Download Patient Slip PDF"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-teal-800 bg-white hover:bg-teal-50 border border-teal-200 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <FileDown className="w-3.5 h-3.5 text-teal-700" />
                <span>PDF Slip</span>
              </button>
            </div>
          </div>

          {/* Explanation Text Box */}
          <div className="bg-white rounded-2xl p-5 border border-teal-100 shadow-xs space-y-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                Doctor's Diagnosis in Plain Words (مریض کے لیے آسان وضاحت)
              </span>
              <p
                className={`text-sm sm:text-base text-slate-800 leading-relaxed ${
                  explanationTab === "urdu"
                    ? "text-right font-serif leading-loose text-lg"
                    : "font-sans"
                }`}
                dir={explanationTab === "urdu" ? "rtl" : "ltr"}
                id="patient-explanation-paragraph"
              >
                {explanationTab === "roman" && patientExplanation.simplifiedRomanUrdu}
                {explanationTab === "urdu" && patientExplanation.simplifiedUrdu}
                {explanationTab === "english" && patientExplanation.simplifiedEnglish}
              </p>
            </div>

            {/* Key Home Care Bullet Points */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Home Care & Medication Advice (گھریلو دیکھ بھال اور ہدایات):</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {patientExplanation.keyCareInstructions.map((instruction, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-xs text-slate-800 flex items-start gap-2 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-teal-200/80 text-teal-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-medium">{instruction}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Red Flags Notice */}
            {patientExplanation.warningRedFlags && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block mb-0.5">
                    When to rush to Hospital / Emergency (کب ہنگامی حالت میں ہسپتال جانا ہے):
                  </strong>
                  <span className="leading-relaxed text-rose-800">{patientExplanation.warningRedFlags}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Callout if simplification fails */}
      {simplifyError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">{simplifyError}</div>
        </div>
      )}
    </div>
  );
}
