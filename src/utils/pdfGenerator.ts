import { jsPDF } from "jspdf";
import { ClinicalResult, PatientExplanation } from "@/types";

export interface GeneratePdfOptions {
  result: ClinicalResult;
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  clinicName?: string;
  patientExplanation?: PatientExplanation | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
}

// Normalize so "Dr." appears exactly once, whether or not the user typed it
// ("Ayzakumar", "Dr Ayzakumar", "Dr.Ayzakumar" all become "Dr. Ayzakumar")
const withDoctorTitle = (name: string) => {
  const stripped = name.trim().replace(/^dr[.\s]\s*/i, "");
  return stripped ? `Dr. ${stripped}` : name.trim();
};

export function generateClinicalNotePdf({
  result,
  patientName = "Anonymous Patient",
  patientAge = "Age N/A",
  patientGender = "Unspecified",
  clinicName = "CarePen Outpatient Health Center",
  patientExplanation = null,
  reviewedBy = null,
  reviewedAt = null,
}: GeneratePdfOptions): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = margin;
      drawHeader(true);
    }
  };

  const drawHeader = (isContinuation = false) => {
    doc.setFillColor(13, 148, 136);
    doc.rect(margin, y, contentWidth, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("CAREPEN AI  \u2022  CLINICAL ENCOUNTER REPORT", margin + 6, y + 7.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(
      isContinuation
        ? `Outpatient Medical Documentation (Cont.) - ${clinicName}`
        : `Standardized Outpatient & Triage Summary  |  ${clinicName}`,
      margin + 6,
      y + 13
    );
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    doc.setFontSize(8);
    doc.text(`Date: ${dateStr}`, pageWidth - margin - 6, y + 7.5, { align: "right" });
    doc.text(`Time: ${timeStr}`, pageWidth - margin - 6, y + 13, { align: "right" });
    y += 22;
  };

  drawHeader();

  const isUrgent = result.urgency.flag === "High";
  const isMedium = result.urgency.flag === "Medium";
  const triageBgColor = isUrgent ? [254, 242, 242] : isMedium ? [255, 251, 235] : [240, 253, 244];
  const triageTextColor = isUrgent ? [190, 18, 60] : isMedium ? [180, 83, 9] : [21, 128, 61];

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth * 0.58, 28, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("PATIENT DEMOGRAPHICS", margin + 4, y + 6);
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(patientName || "Anonymous Patient", margin + 4, y + 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Age: ${patientAge || "N/A"}   |   Gender: ${patientGender || "N/A"}`, margin + 4, y + 19);
  doc.text(`Encounter ID: #${Math.random().toString(36).substring(2, 8).toUpperCase()}`, margin + 4, y + 24);

  const triageX = margin + contentWidth * 0.60;
  const triageWidth = contentWidth * 0.40;
  doc.setFillColor(triageBgColor[0], triageBgColor[1], triageBgColor[2]);
  doc.setDrawColor(triageTextColor[0], triageTextColor[1], triageTextColor[2]);
  doc.roundedRect(triageX, y, triageWidth, 28, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(triageTextColor[0], triageTextColor[1], triageTextColor[2]);
  doc.text("CLINICAL TRIAGE TIER", triageX + 4, y + 6);
  doc.setFontSize(11);
  doc.text(`[ ${result.urgency.flag.toUpperCase()} URGENCY ]`, triageX + 4, y + 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const urgencyReasonLines = doc.splitTextToSize(result.urgency.reason || "", triageWidth - 8);
  doc.text(urgencyReasonLines.slice(0, 2), triageX + 4, y + 18);
  y += 33;

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("1. STRUCTURED CLINICAL INTAKE SUMMARY", margin + 4, y + 5);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Chief Complaint:", margin + 4, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  const complaintLines = doc.splitTextToSize(result.clinicalIntake.chiefComplaint || "None reported", contentWidth - 40);
  doc.text(complaintLines, margin + 36, y);
  y += complaintLines.length * 4.5 + 2;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("Duration:", margin + 4, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(result.clinicalIntake.duration || "Not specified", margin + 36, y);
  y += 6.5;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("Key Symptoms:", margin + 4, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  const symptomsStr = result.clinicalIntake.keySymptoms?.length
    ? result.clinicalIntake.keySymptoms.join("  \u2022  ")
    : "None identified";
  const symptomsLines = doc.splitTextToSize(symptomsStr, contentWidth - 40);
  doc.text(symptomsLines, margin + 36, y);
  y += symptomsLines.length * 4.5 + 2;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("History / Risks:", margin + 4, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  const historyLines = doc.splitTextToSize(result.clinicalIntake.relevantHistory || "None documented", contentWidth - 40);
  doc.text(historyLines, margin + 36, y);
  y += historyLines.length * 4.5 + 5;

  checkPageBreak(45);
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, contentWidth, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("2. EHR CLINICAL SCRIBE NOTE (FOR MEDICAL CHART / EMR)", margin + 4, y + 5);
  y += 10;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  const noteLines = doc.splitTextToSize(result.clinicalNote || "No clinical note generated.", contentWidth - 10);
  const noteBoxHeight = noteLines.length * 4.5 + 8;
  checkPageBreak(noteBoxHeight + 10);
  doc.roundedRect(margin, y, contentWidth, noteBoxHeight, 2, 2, "FD");
  doc.setFillColor(14, 116, 144);
  doc.rect(margin, y, 2.5, noteBoxHeight, "F");
  doc.setFont("courier", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(noteLines, margin + 7, y + 6);
  y += noteBoxHeight + 6;

  // Doctor review / sign-off status
  if (reviewedBy) {
    checkPageBreak(16);
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(margin, y, contentWidth, 11, 1.5, 1.5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(6, 95, 70);
    doc.text(`REVIEWED & SIGNED OFF: ${withDoctorTitle(reviewedBy)}`, margin + 4, y + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(4, 120, 87);
    doc.text(`Doctor verified this AI-generated note on ${reviewedAt || "—"}`, margin + 4, y + 9);
    y += 15;
  } else {
    checkPageBreak(12);
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(253, 230, 138);
    doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(146, 64, 14);
    doc.text("PENDING DOCTOR REVIEW - AI-generated draft, not yet verified for the patient record.", margin + 4, y + 5.5);
    y += 12;
  }

  if (patientExplanation) {
    checkPageBreak(45);
    doc.setFillColor(240, 253, 250);
    doc.setDrawColor(153, 246, 228);
    doc.rect(margin, y, contentWidth, 7, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(13, 148, 136);
    doc.text("3. PATIENT HOME CARE & MEDICATION INSTRUCTIONS", margin + 4, y + 5);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Simple Explanation for Patient:", margin + 4, y);
    y += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    const expLines = doc.splitTextToSize(patientExplanation.simplifiedRomanUrdu || patientExplanation.simplifiedEnglish || "", contentWidth - 8);
    doc.text(expLines, margin + 4, y);
    y += expLines.length * 4.5 + 4;

    if (patientExplanation.keyCareInstructions?.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(13, 148, 136);
      doc.text("Key Care Advice & Steps:", margin + 4, y);
      y += 4.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      patientExplanation.keyCareInstructions.forEach((inst, idx) => {
        const instLines = doc.splitTextToSize(`${idx + 1}. ${inst}`, contentWidth - 12);
        doc.text(instLines, margin + 6, y);
        y += instLines.length * 4 + 1.5;
      });
      y += 2;
    }

    if (patientExplanation.warningRedFlags) {
      checkPageBreak(20);
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(254, 202, 202);
      const redFlagLines = doc.splitTextToSize(`EMERGENCY WARNING: ${patientExplanation.warningRedFlags}`, contentWidth - 10);
      const flagHeight = redFlagLines.length * 4 + 6;
      doc.roundedRect(margin, y, contentWidth, flagHeight, 1.5, 1.5, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(185, 28, 28);
      doc.text(redFlagLines, margin + 4, y + 4.5);
      y += flagHeight + 5;
    }
  }

  checkPageBreak(30);
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y + 2, pageWidth - margin, y + 2);
  y += 7;

  const signColWidth = (contentWidth - 10) / 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("ATTENDING MEDICAL PRACTITIONER", margin + 4, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(
    `Doctor Name: ${reviewedBy ? withDoctorTitle(reviewedBy) : "__________________________"}`,
    margin + 4,
    y + 7
  );
  doc.text(reviewedAt ? `Review Signed: ${reviewedAt}` : "Review Status: Pending Doctor Sign-Off", margin + 4, y + 13);
  doc.text("Signature & Stamp: ______________________", margin + 4, y + 19);

  const rightX = margin + signColWidth + 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("CLINICAL AI DOCUMENTATION NOTICE", rightX, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  const disclaimer = "This encounter note was synthesized via CarePen AI Clinical Scribe to assist clinician charting. The attending physician has reviewed and confirmed all clinical indicators prior to EMR entry or patient discharge.";
  const discLines = doc.splitTextToSize(disclaimer, signColWidth - 4);
  doc.text(discLines, rightX, y + 5);

  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `CarePen AI Healthcare Systems  \u2022  Confidential Medical Record  \u2022  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: "center" }
    );
  }

  const cleanName = (patientName || "Patient").replace(/[^a-zA-Z0-9_-]/g, "_");
  const dateStamp = new Date().toISOString().split("T")[0];
  doc.save(`CarePen_Clinical_Report_${cleanName}_${dateStamp}.pdf`);
}
