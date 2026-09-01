import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

/**
 * POST /api/chat-assistant
 * In-app support chatbot that helps users navigate CarePen AI.
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
    const { message, history } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "carepen-ai" } },
    });

    const systemInstruction = `You are Maya, the friendly in-app support assistant for "CarePen AI" — the AI clinical scribe & triage app designed for doctors and clinics in Pakistan.
    When users ask who you are, introduce yourself as Maya.

Your purpose is ONLY to help users navigate and use the CarePen AI application:
1. Explain how to use CarePen AI (entering symptoms via text or voice recording, selecting presets, generating notes, printing referral slips).
2. Explain language features: CarePen understands English, Urdu, and Roman Urdu.
3. Explain Urgency Triage Badges (Green/Low, Amber/Medium, Red/High).
4. Explain how to use voice input and export/print notes.

CRITICAL GUARDRAIL:
- You are strictly Maya, an in-app software support assistant, NOT a medical doctor.
- If a user asks for personal medical advice, diagnoses, or prescriptions, politely decline and state:
  "I am Maya, CarePen AI's software support assistant. I cannot provide clinical medical advice. Please consult a qualified medical doctor."
- Keep answers concise, friendly, and formatted with clear bullet points.`;

    const contents = [
      ...(Array.isArray(history)
        ? history.map((msg: { role: string; text: string }) => ({
            role: msg.role,
            parts: [{ text: msg.text }],
          }))
        : []),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    return NextResponse.json({
      reply: response.text || "I am here to help you navigate CarePen AI. What would you like to know?",
    });
  } catch (error: any) {
    console.error("Error in support chat:", error);
    return NextResponse.json(
      { error: "Support assistant unavailable.", details: error.message },
      { status: 500 }
    );
  }
}
