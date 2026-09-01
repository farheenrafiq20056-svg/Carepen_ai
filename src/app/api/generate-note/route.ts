import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

/**
 * POST /api/generate-note
 * Generates a structured clinical note from raw patient conversation text.
 * Gemini API key is kept server-side only — never exposed to the frontend.
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured on the server." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { text, patientName, patientAge, patientGender } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Patient conversation text is required." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "carepen-ai" } },
    });

    const systemInstruction = `You are CarePen AI, an expert clinical scribe assistant for doctors and clinic staff in Pakistan.
Your task is to analyze a messy, unstructured patient conversation, complaint, or list of symptoms.
The input can be in English, Urdu (in Arabic script), or Roman Urdu (Urdu words written in English letters, e.g., "mujhe kal se bukhar hai aur chhati me dard hai").

Analyze the input text carefully, translate and interpret all Urdu/Roman Urdu colloquial phrases into accurate standard English medical terminology, and generate a highly professional, structured JSON response according to the schema.

Guidelines for clinical interpretation:
- "bukhar" -> Fever
- "gale me dard" / "gala kharab" -> Sore throat / pharyngitis
- "zukam" / "nazla" -> Nasal congestion / coryza / common cold
- "sar dard" -> Headache
- "pait kharab" / "pait me dard" -> Abdominal pain / diarrhea / gastroenteritis
- "khaansi" -> Cough
- "saas me masla" -> Shortness of breath / dyspnea
- "chhati me dard" -> Chest pain (highly urgent if acute)
- "vomit" / "ulti" -> Vomiting
- "kamzori" -> Generalized weakness / fatigue
- Keep clinical summaries objective and professional.
- For Urgency Flag:
  - HIGH: If the patient exhibits red-flag symptoms such as acute chest pain, severe difficulty breathing, sudden weakness/stroke symptoms, heavy bleeding, high fever with stiff neck, or other potential emergencies.
  - MEDIUM: If there are acute symptoms needing timely care but not immediately life-threatening (e.g., severe earache, moderate fever for several days, controlled vomiting, high blood pressure with moderate headache).
  - LOW: If it's a chronic condition with no acute deterioration, mild common cold, simple rash, or minor scratch.
- Short reason for urgency: brief explanation in clinical English (e.g., "Acute chest pain requires urgent ECG to rule out ischemic event").
- Clinical Note: A concise, highly professional one-paragraph summary in standard medical shorthand (e.g., "Pt is a 34yo presenting with 3-day history of high-grade fever, sore throat, and productive cough. No dyspnea or chest pain noted..."). This should be immediately useful to a doctor for copy-pasting.`;

    const prompt = `Patient Details (if known):
Name: ${patientName || "Unspecified"}
Age: ${patientAge || "Unspecified"}
Gender: ${patientGender || "Unspecified"}

Here is the messy patient conversation/complaint:
"""
${text}
"""

Please process this conversation and output a structured clinical intake summary, urgency flag with reason, and copyable clinical note.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["clinicalIntake", "urgency", "clinicalNote"],
          properties: {
            clinicalIntake: {
              type: Type.OBJECT,
              required: ["chiefComplaint", "duration", "keySymptoms", "relevantHistory"],
              properties: {
                chiefComplaint: { type: Type.STRING, description: "Standard clinical translation of the main complaint." },
                duration: { type: Type.STRING, description: "Duration of symptoms described by the patient." },
                keySymptoms: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of identified key symptoms in professional medical English terminology." },
                relevantHistory: { type: Type.STRING, description: "Any relevant medical history, comorbidities, or medications mentioned, or 'None mentioned' if none." },
              },
            },
            urgency: {
              type: Type.OBJECT,
              required: ["flag", "reason"],
              properties: {
                flag: { type: Type.STRING, description: "Urgency categorization. MUST be one of: 'Low', 'Medium', 'High'." },
                reason: { type: Type.STRING, description: "Short reason for the selected urgency flag." },
              },
            },
            clinicalNote: { type: Type.STRING, description: "A clean, concise, one-paragraph clinical summary of the encounter suitable for medical records (EMR/EHR)." },
          },
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response content from Gemini API.");
    }

    const resultJson = JSON.parse(responseText.trim());

    // NOTE: Persistence is handled exclusively by the client via insertNote()
    // in lib/auth-utils (RLS-protected). Do NOT insert here as well —
    // inserting in both places created a duplicate row per generation.

    return NextResponse.json(resultJson);
  } catch (error: any) {
    console.error("Error generating clinical note:", error);
    return NextResponse.json(
      { error: "Failed to generate clinical note. Please try again.", details: error.message },
      { status: 500 }
    );
  }
}
