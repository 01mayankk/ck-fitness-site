import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { plan } = await req.json();

  // Get logged-in user
  const auth = await supabase.auth.getUser();
  const user = auth.data.user;

  if (!user) return NextResponse.json({ error: "Not logged in" });

  const start = new Date();
  const expiry = new Date();
  expiry.setDate(start.getDate() + 30); // 30-day membership

  // Save membership record
  await supabase.from("memberships").insert({
    user_id: user.id,
    plan,
    start_date: start.toISOString(),
    expiry_date: expiry.toISOString(),
    is_active: true,
  });

  return NextResponse.json({ success: true });
}
