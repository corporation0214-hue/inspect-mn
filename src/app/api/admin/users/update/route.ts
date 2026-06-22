import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      id,
      full_name,
      role,
      department,
      position,
      phone,
      status,
      actor_id,
      actor_name,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "User id required" }, { status: 400 });
    }

    const { error } = await admin
      .from("profiles")
      .update({
        full_name,
        role,
        department,
        position,
        phone,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await admin.from("audit_logs").insert({
      user_id: actor_id || null,
      user_name: actor_name || "Admin",
      action: "UPDATE_USER",
      module: "ADMIN",
      target_id: id,
      description: `${full_name || id} хэрэглэгчийн role/status шинэчлэгдэв: ${role}`,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Update failed" },
      { status: 500 }
    );
  }
}