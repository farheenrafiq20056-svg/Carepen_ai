import { NextResponse } from "next/server";

/**
 * GET /api/health
 * Health check endpoint for monitoring.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    appName: "CarePen AI",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    supabaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  });
}
