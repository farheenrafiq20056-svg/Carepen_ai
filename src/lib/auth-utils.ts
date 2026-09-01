"use client";

import { createClient } from "@/lib/supabase-client";
import type { SavedNote, UserProfile, ContactMessage } from "@/types";

/* ──────────────────────────────────────────────
 *  Authentication helpers (email / password only)
 * ────────────────────────────────────────────── */

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return {
    user: data.user,
    error: error ? error.message : null,
  };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
  clinicName?: string
) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        clinic_name: clinicName || "CarePen Clinic",
      },
    },
  });
  return {
    user: data.user,
    error: error ? error.message : null,
  };
}

export async function signOutUser() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function getActiveUser(): Promise<UserProfile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.email || "",
    fullName: user.user_metadata?.full_name || "Dr. Medical Practitioner",
    avatarUrl: user.user_metadata?.avatar_url,
    clinicName: user.user_metadata?.clinic_name || "CarePen Clinic",
  };
}

/* ──────────────────────────────────────────────
 *  Notes CRUD (Supabase `notes` table with RLS)
 * ────────────────────────────────────────────── */

export async function fetchUserNotes(userId: string): Promise<SavedNote[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row: any) => {
    const intakeSummary =
      typeof row.intake_summary === "string"
        ? JSON.parse(row.intake_summary)
        : row.intake_summary || {};

    return {
      id: row.id,
      user_id: row.user_id,
      timestamp: new Date(row.created_at).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      rawInput: row.raw_input,
      result: {
        clinicalIntake: {
          chiefComplaint: intakeSummary.chiefComplaint || "",
          duration: intakeSummary.duration || "",
          keySymptoms: intakeSummary.keySymptoms || [],
          relevantHistory: intakeSummary.relevantHistory || "",
        },
        urgency: {
          flag: row.urgency_level || "Low",
          reason: row.urgency_reason || "",
        },
        clinicalNote: row.clinical_note || "",
      },
      patientName: row.patient_name || "Anonymous Patient",
      patientAge: row.patient_age || "Age N/A",
      patientGender: row.patient_gender || "Male",
      reviewedBy: row.reviewed_by || null,
      reviewedAt: row.reviewed_at
        ? new Date(row.reviewed_at).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : null,
    };
  });
}

export async function insertNote(
  note: SavedNote,
  userId: string
): Promise<string | null> {
  const supabase = createClient();

  const payload = {
    user_id: userId,
    raw_input: note.rawInput,
    intake_summary: note.result
      ? JSON.stringify({
          chiefComplaint: note.result.clinicalIntake?.chiefComplaint || "",
          duration: note.result.clinicalIntake?.duration || "",
          keySymptoms: note.result.clinicalIntake?.keySymptoms || [],
          relevantHistory: note.result.clinicalIntake?.relevantHistory || "",
        })
      : "{}",
    urgency_level: note.result?.urgency?.flag || "Low",
    urgency_reason: note.result?.urgency?.reason || "",
    clinical_note: note.result?.clinicalNote || "",
    patient_name: note.patientName || "Anonymous Patient",
    patient_age: note.patientAge || "Age N/A",
    patient_gender: note.patientGender || "Male",
  };

  const { data, error } = await supabase
    .from("notes")
    .insert(payload)
    .select("id")
    .single();
  if (error) {
    console.error("insertNote error:", error.message);
    return null;
  }
  return data?.id ?? null;
}

/**
 * Normalizes a doctor's name so the "Dr." title appears exactly once,
 * regardless of how it was typed ("Ayzakumar", "Dr Ayzakumar",
 * "Dr.Ayzakumar" all become "Dr. Ayzakumar").
 * The [.\s] guard keeps real names like "Drake" untouched.
 */
function withDoctorTitle(name: string): string {
  const stripped = name.trim().replace(/^dr[.\s]\s*/i, "");
  return stripped ? `Dr. ${stripped}` : name.trim();
}

/**
 * Records a doctor's review / sign-off on a note.
 * Sets reviewed_by and reviewed_at on the notes row (RLS: own notes only).
 */
export async function reviewNote(
  noteId: string,
  doctorName: string
): Promise<{ reviewedBy: string | null; reviewedAt: string | null }> {
  const supabase = createClient();
  const reviewedAt = new Date();
  const normalized = withDoctorTitle(doctorName);

  const { data, error } = await supabase
    .from("notes")
    .update({
      reviewed_by: normalized,
      reviewed_at: reviewedAt.toISOString(),
    })
    .eq("id", noteId)
    .select("id")
    .single();

  if (error || !data) {
    console.error("reviewNote error:", error?.message || "Note not found for review.");
    return { reviewedBy: null, reviewedAt: null };
  }

  return {
    reviewedBy: normalized,
    reviewedAt: reviewedAt.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

export async function deleteNote(noteId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("notes").delete().eq("id", noteId);
  if (error) {
    console.error("deleteNote error:", error.message);
  }
}

/* ──────────────────────────────────────────────
 *  Contact form submission
 * ────────────────────────────────────────────── */

export async function insertContactMessage(msg: ContactMessage) {
  const supabase = createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: msg.name,
    email: msg.email,
    message: msg.message,
  });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, error: null };
}
