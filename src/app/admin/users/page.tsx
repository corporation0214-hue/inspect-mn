import DashboardLayout from "@/components/layout/DashboardLayout";
import { createClient } from "@/lib/supabase/server";
import UsersClient from "./UsersClient";
import { redirect } from "next/navigation";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export default async function UsersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: users } = await adminSupabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <DashboardLayout>
      <UsersClient users={users || []} />
    </DashboardLayout>
  );
}