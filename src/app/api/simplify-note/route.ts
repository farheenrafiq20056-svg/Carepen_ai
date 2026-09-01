import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

/**
 * POST /api/simplify-note
 * Translates a complex clinical note into patient-friendly
 * Roman Urdu, Urdu script, and simple English.
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { clinicalNote, patientName, chiefComplaint, urgency } = body;

    if (!clinicalNote || typeof clinicalNote !== "string") {
      return NextResponse.json(
        { error: "Clinical note content is required." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "carepen-ai" } },
    });

    const systemInstruction = `You are CarePen AI's Patient Communication Specialist.
Your job is to translate complex doctor clinical notes into clear, compassionate, and easy-to-understand language for patients and their families in Pakistan.
You will provide:
1. "simplifiedRomanUrdu": The explanation written in Roman Urdu.
2. "simplifiedUrdu": The explanation in proper Urdu script (اردو).
3. "simplifiedEnglish": The explanation in very simple, jargon-free English (grade 5 reading level).
4. "keyCareInstructions": 3-4 bullet points of practical home care / medicine / dietary advice in Roman Urdu and English.
5. "warningRedFlags": When to urgently return to the clinic/hospital or visit emergency in Roman Urdu.

Keep the tone encouraging, respectful, clear, and reassuring. Avoid medical jargon.`;

    const prompt = `Patient Name: ${patientName || "Patient"}
Chief Complaint: ${chiefComplaint || "General checkup"}
Urgency: ${urgency || "Standard"}

Doctor's Clinical Note:
"""
${clinicalNote}
"""

Please rewrite this note into patient-friendly simplified Roman Urdu, Urdu script, and simple English with key care advice.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["simplifiedRomanUrdu", "simplifiedUrdu", "simplifiedEnglish", "keyCareInstructions", "warningRedFlags"],
          properties: {
            simplifiedRomanUrdu: { type: Type.STRING, description: "Friendly explanation in Roman Urdu." },
            simplifiedUrdu: { type: Type.STRING, description: "Explanation in Urdu script." },
            simplifiedEnglish: { type: Type.STRING, description: "Explanation in plain English." },
            keyCareInstructions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable home care instructions." },
            warningRedFlags: { type: Type.STRING, description: "Emergency warning signs." },
          },
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response content from Gemini API.");
    }

    return NextResponse.json(JSON.parse(responseText.trim()));
  } catch (error: any) {
    console.error("Error simplifying note:", error);
    return NextResponse.json(
      { error: "Failed to simplify clinical note.", details: error.message },
      { status: 500 }
    );
  }
}
