"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      const supabase = createClient();

      await supabase.auth.signOut({ scope: "local" });

      router.replace("/");
      router.refresh();
    };

    logout();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-slate-600">Logging out...</p>
    </main>
  );
}