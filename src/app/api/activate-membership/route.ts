import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { plan, payment_id } = await req.json();

  // Get logged-in user session
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not logged in or session expired" }, { status: 401 });
  }

  const start = new Date();
  const expiry = new Date();
  expiry.setDate(start.getDate() + 30); // 30-day membership

  // Save membership record
  const { error: dbError } = await supabase.from("memberships").insert({
    user_id: user.id,
    plan,
    payment_id, // Store Razorpay payment ID for tracking
    start_date: start.toISOString(),
    expiry_date: expiry.toISOString(),
    is_active: true,
  });

  if (dbError) {
    console.error("Database error:", dbError);
    return NextResponse.json({ error: "Failed to activate membership" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
