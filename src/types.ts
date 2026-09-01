export interface ClinicalIntake {
  chiefComplaint: string;
  duration: string;
  keySymptoms: string[];
  relevantHistory: string;
}

export interface UrgencyInfo {
  flag: "Low" | "Medium" | "High";
  reason: string;
}

export interface ClinicalResult {
  clinicalIntake: ClinicalIntake;
  urgency: UrgencyInfo;
  clinicalNote: string;
  patientExplanation?: PatientExplanation;
}

export interface PatientExplanation {
  simplifiedRomanUrdu: string;
  simplifiedUrdu: string;
  simplifiedEnglish: string;
  keyCareInstructions: string[];
  warningRedFlags: string;
}

export interface SupportChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface SavedNote {
  id: string;
  user_id?: string;
  timestamp: string;
  rawInput: string;
  result: ClinicalResult;
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
}

export interface SupabaseNoteRow {
  id: string;
  user_id: string;
  raw_input: string;
  intake_summary: ClinicalIntake;
  urgency_level: "Low" | "Medium" | "High";
  urgency_reason: string;
  clinical_note: string;
  patient_name?: string;
  patient_age?: string;
  patient_gender?: string;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
}

export interface TriageDayCount {
  /** Local calendar date, e.g. "2026-09-01" */
  date: string;
  /** Human-friendly axis label, e.g. "Tue 1" */
  label: string;
  Low: number;
  Medium: number;
  High: number;
}

export interface ScenarioPreset {
  title: string;
  language: "English" | "Urdu" | "Roman Urdu";
  preview: string;
  text: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  clinicName?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}
