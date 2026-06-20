"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("inspect_demo_auth");
    localStorage.removeItem("inspect_user");
    router.push("/");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <p className="text-slate-600">Системээс гарч байна...</p>
    </main>
  );
}