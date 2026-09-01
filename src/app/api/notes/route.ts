import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

/**
 * GET /api/notes
 * Fetches the authenticated user's notes.
 * RLS ensures users can only see their own notes.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch notes", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ notes: data || [] });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch notes", details: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notes
 * Saves a new note for the authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const noteData = await request.json();

    const { data, error } = await supabase
      .from("notes")
      .insert([{ ...noteData, user_id: user.id }])
      .select();

    if (error) {
      return NextResponse.json(
        { error: "Failed to save note", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, note: data?.[0] });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to save note", details: err.message },
      { status: 500 }
    );
  }
}
